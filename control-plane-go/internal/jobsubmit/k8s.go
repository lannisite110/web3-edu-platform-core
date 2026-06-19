package jobsubmit

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	batchv1 "k8s.io/api/batch/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func newClientset() (*kubernetes.Clientset, error) {
	var cfg *rest.Config
	var err error
	if os.Getenv("KUBERNETES_SERVICE_HOST") != "" {
		cfg, err = rest.InClusterConfig()
	} else {
		kubeconfig := os.Getenv("KUBECONFIG")
		if kubeconfig == "" {
			home, _ := os.UserHomeDir()
			kubeconfig = filepath.Join(home, ".kube", "config")
		}
		cfg, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
	}
	if err != nil {
		return nil, err
	}
	return kubernetes.NewForConfig(cfg)
}

func submitClusterJob(req Request) (Result, error) {
	if err := ValidateClusterPrereqs(); err != nil {
		return Result{}, err
	}
	clientset, err := newClientset()
	if err != nil {
		return Result{}, fmt.Errorf("kubernetes client: %w", err)
	}

	job, err := prepareJob(req)
	if err != nil {
		return Result{}, err
	}

	created, err := clientset.BatchV1().Jobs(req.Namespace).Create(context.Background(), job, metav1.CreateOptions{})
	if err != nil {
		return Result{}, fmt.Errorf("create job: %w", err)
	}

	timeout := pollTimeout()
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	status, message, extra, err := waitForJob(ctx, clientset, req.Namespace, created.Name)
	if err != nil {
		return Result{
			Mode:    ModeCluster,
			Status:  status,
			Message: message,
			Extra: map[string]any{
				"namespace": req.Namespace,
				"job_name":  created.Name,
				"error":     err.Error(),
			},
		}, nil
	}

	extra["namespace"] = req.Namespace
	extra["job_name"] = created.Name
	extra["job_template"] = req.JobTemplate
	if req.Image != "" {
		extra["toolchain_image"] = req.Image
	}

	return Result{
		Mode:    ModeCluster,
		Status:  status,
		Message: message,
		Extra:   extra,
	}, nil
}

func pollTimeout() time.Duration {
	if v := os.Getenv("JOB_POLL_TIMEOUT_SEC"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			return time.Duration(n) * time.Second
		}
	}
	return 90 * time.Second
}

func waitForJob(ctx context.Context, clientset *kubernetes.Clientset, namespace, name string) (status, message string, extra map[string]any, err error) {
	extra = map[string]any{}
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		job, getErr := clientset.BatchV1().Jobs(namespace).Get(ctx, name, metav1.GetOptions{})
		if getErr != nil {
			return "failed", "job get error", extra, getErr
		}
		extra["active"] = job.Status.Active
		extra["succeeded"] = job.Status.Succeeded
		extra["failed"] = job.Status.Failed

		if job.Status.Succeeded > 0 {
			return "completed", "kubernetes job succeeded", extra, nil
		}
		if job.Status.Failed > 0 {
			return "failed", "kubernetes job failed", extra, fmt.Errorf("job %s failed", name)
		}

		select {
		case <-ctx.Done():
			return "timeout", "kubernetes job poll timeout", extra, ctx.Err()
		case <-ticker.C:
		}
	}
}

// CleanupJob removes a completed job (optional, v0.4 helper).
func CleanupJob(namespace, name string) error {
	clientset, err := newClientset()
	if err != nil {
		return err
	}
	prop := metav1.DeletePropagationBackground
	return clientset.BatchV1().Jobs(namespace).Delete(context.Background(), name, metav1.DeleteOptions{PropagationPolicy: &prop})
}

// Ensure batchv1 import used
var _ = batchv1.Job{}
