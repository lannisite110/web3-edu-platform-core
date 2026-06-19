package jobsubmit

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/yaml"
)

func repoRootFromManifest(manifestPath string) string {
	if manifestPath == "" {
		return ""
	}
	if idx := strings.Index(manifestPath, "/plugins/"); idx > 0 {
		return manifestPath[:idx]
	}
	return filepath.Dir(filepath.Dir(manifestPath))
}

func resolveTemplatePath(req Request) (string, error) {
	if req.JobTemplate == "" {
		return "", nil
	}
	if filepath.IsAbs(req.JobTemplate) {
		if _, err := os.Stat(req.JobTemplate); err == nil {
			return req.JobTemplate, nil
		}
	}
	root := repoRootFromManifest(req.ManifestPath)
	if root == "" {
		return "", fmt.Errorf("cannot resolve repo root for job template %q", req.JobTemplate)
	}
	full := filepath.Join(root, req.JobTemplate)
	if _, err := os.Stat(full); err != nil {
		return "", fmt.Errorf("job template not found: %s", full)
	}
	return full, nil
}

func loadJobFromTemplate(path string) (*batchv1.Job, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var job batchv1.Job
	if err := yaml.Unmarshal(data, &job); err != nil {
		return nil, err
	}
	return &job, nil
}

func buildDefaultJob(req Request) *batchv1.Job {
	image := req.Image
	if image == "" {
		image = "busybox:1.36"
	}
	return &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: "edu-task-",
			Labels: map[string]string{
				"edu.web3/plugin-id":  req.PluginID,
				"edu.web3/task-type":  req.TaskType,
				"edu.web3/compliance": "testnet-only",
			},
		},
		Spec: batchv1.JobSpec{
			BackoffLimit: int32Ptr(1),
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"edu.web3/plugin-id": req.PluginID,
					},
				},
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:    "runner",
							Image:   image,
							Command: []string{"sh", "-c", fmt.Sprintf("echo edu task %s plugin %s; echo simulation complete", req.TaskType, req.PluginID)},
							Env: []corev1.EnvVar{
								{Name: "CHAIN_ID", Value: "11155111"},
								{Name: "TASK_TYPE", Value: req.TaskType},
								{Name: "PLUGIN_ID", Value: req.PluginID},
							},
						},
					},
				},
			},
		},
	}
}

func prepareJob(req Request) (*batchv1.Job, error) {
	var job *batchv1.Job
	path, err := resolveTemplatePath(req)
	if err != nil {
		return nil, err
	}
	if path != "" {
		job, err = loadJobFromTemplate(path)
		if err != nil {
			return nil, err
		}
		normalizeJobTemplate(job)
	} else {
		job = buildDefaultJob(req)
	}

	job.Namespace = req.Namespace
	if job.Labels == nil {
		job.Labels = map[string]string{}
	}
	job.Labels["edu.web3/task-id"] = req.TaskID
	job.Labels["edu.web3/plugin-id"] = req.PluginID
	job.Labels["edu.web3/task-type"] = req.TaskType

	if req.Image != "" && len(job.Spec.Template.Spec.Containers) > 0 {
		job.Spec.Template.Spec.Containers[0].Image = req.Image
	}
	if os.Getenv("JOB_SMOKE_BUSYBOX") == "1" && len(job.Spec.Template.Spec.Containers) > 0 {
		c := &job.Spec.Template.Spec.Containers[0]
		c.Image = "busybox:1.36"
		c.Command = []string{"sh", "-c", fmt.Sprintf("echo smoke %s; echo simulation complete", req.TaskType)}
		c.Env = []corev1.EnvVar{
			{Name: "CHAIN_ID", Value: "11155111"},
			{Name: "TASK_TYPE", Value: req.TaskType},
			{Name: "PLUGIN_ID", Value: req.PluginID},
		}
	}

	// Unique name per submission
	suffix := strings.ReplaceAll(req.TaskID, "-", "")[:8]
	base := job.Name
	if base == "" {
		base = "edu-task"
	}
	job.Name = fmt.Sprintf("%s-%s", sanitizeName(base), suffix)
	job.GenerateName = ""

	return job, nil
}

func normalizeJobTemplate(job *batchv1.Job) {
	spec := &job.Spec.Template.Spec
	if spec.RestartPolicy == "" {
		spec.RestartPolicy = corev1.RestartPolicyNever
	}
	if job.Spec.BackoffLimit == nil {
		job.Spec.BackoffLimit = int32Ptr(1)
	}
}

func sanitizeName(s string) string {
	s = strings.ToLower(s)
	var b strings.Builder
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			b.WriteRune(r)
		} else if r == '_' || r == '.' {
			b.WriteRune('-')
		}
	}
	out := strings.Trim(b.String(), "-")
	if out == "" {
		return "edu-task"
	}
	if len(out) > 50 {
		out = out[:50]
	}
	return out
}

func int32Ptr(v int32) *int32 { return &v }
