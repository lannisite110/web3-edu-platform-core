package jobsubmit

import (
	"os"
	"path/filepath"
	"testing"

	corev1 "k8s.io/api/core/v1"
)

func TestLoadJobFromTemplateRestartPolicy(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "job.yaml")
	content := `apiVersion: batch/v1
kind: Job
metadata:
  name: test
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: runner
          image: busybox:1.36
          command: ["echo", "ok"]
`
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}

	job, err := loadJobFromTemplate(path)
	if err != nil {
		t.Fatal(err)
	}
	if job.Spec.Template.Spec.RestartPolicy != corev1.RestartPolicyNever {
		t.Fatalf("restartPolicy=%q want Never", job.Spec.Template.Spec.RestartPolicy)
	}
}
