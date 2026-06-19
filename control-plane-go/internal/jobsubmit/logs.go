package jobsubmit

import (
	"context"
	"io"
	"os"
	"strconv"
	"strings"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func autoCleanupEnabled() bool {
	return os.Getenv("JOB_AUTO_CLEANUP") != "false"
}

func podLogTailLines() int64 {
	if v := os.Getenv("JOB_LOG_TAIL_LINES"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			return int64(n)
		}
	}
	return 80
}

func attachJobDiagnostics(ctx context.Context, clientset *kubernetes.Clientset, namespace, jobName string, extra map[string]any) {
	pods, err := listJobPods(ctx, clientset, namespace, jobName)
	if err != nil {
		extra["pod_list_error"] = err.Error()
		return
	}
	attachPodStatus(pods, extra)
	attachPodEvents(ctx, clientset, namespace, pods, extra)

	logs, err := fetchJobPodLogsFromPods(ctx, clientset, namespace, pods, podLogTailLines())
	if err != nil {
		extra["pod_log_error"] = err.Error()
	} else if logs != "" {
		extra["pod_log_tail"] = logs
	}
}

func listJobPods(ctx context.Context, clientset *kubernetes.Clientset, namespace, jobName string) ([]corev1.Pod, error) {
	pods, err := clientset.CoreV1().Pods(namespace).List(ctx, metav1.ListOptions{
		LabelSelector: "job-name=" + jobName,
	})
	if err != nil {
		return nil, err
	}
	return pods.Items, nil
}

func fetchJobPodLogs(ctx context.Context, clientset *kubernetes.Clientset, namespace, jobName string, tail int64) (string, error) {
	pods, err := listJobPods(ctx, clientset, namespace, jobName)
	if err != nil {
		return "", err
	}
	return fetchJobPodLogsFromPods(ctx, clientset, namespace, pods, tail)
}

func fetchJobPodLogsFromPods(ctx context.Context, clientset *kubernetes.Clientset, namespace string, pods []corev1.Pod, tail int64) (string, error) {
	if len(pods) == 0 {
		return "", nil
	}
	var b strings.Builder
	for _, pod := range pods {
		req := clientset.CoreV1().Pods(namespace).GetLogs(pod.Name, &corev1.PodLogOptions{TailLines: &tail})
		stream, err := req.Stream(ctx)
		if err != nil {
			continue
		}
		data, _ := io.ReadAll(stream)
		stream.Close()
		if len(data) > 0 {
			if b.Len() > 0 {
				b.WriteString("\n---\n")
			}
			b.WriteString("pod/")
			b.WriteString(pod.Name)
			b.WriteString(":\n")
			b.Write(data)
		}
	}
	return b.String(), nil
}

func maybeCleanupJob(namespace, name string) {
	if !autoCleanupEnabled() {
		return
	}
	_ = CleanupJob(namespace, name)
}
