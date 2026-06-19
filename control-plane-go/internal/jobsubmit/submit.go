package jobsubmit

import (
	"fmt"
	"os"
)

// Mode controls how scheduler fulfills compile/trace jobs.
type Mode string

const (
	ModeLocal   Mode = "local"   // in-process simulation (default)
	ModeCluster Mode = "cluster" // submit Kubernetes Job via client-go
)

type Request struct {
	TaskID       string
	PluginID     string
	TaskType     string
	Namespace    string
	JobTemplate  string
	ManifestPath string
	Image        string
	Params       map[string]any
}

type Result struct {
	Mode    Mode              `json:"mode"`
	Status  string            `json:"status"`
	Message string            `json:"message"`
	Extra   map[string]any    `json:"extra,omitempty"`
}

func CurrentMode() Mode {
	switch os.Getenv("JOB_SUBMIT_MODE") {
	case "cluster", "k8s":
		return ModeCluster
	default:
		return ModeLocal
	}
}

// Submit dispatches a job (local sim or real Kubernetes Job in cluster mode).
func Submit(req Request) (Result, error) {
	switch CurrentMode() {
	case ModeCluster:
		return submitClusterJob(req)
	default:
		return Result{
			Mode:    ModeLocal,
			Status:  "completed",
			Message: "local job simulation",
			Extra: map[string]any{
				"namespace": req.Namespace,
				"task_type": req.TaskType,
			},
		}, nil
	}
}

func ValidateClusterPrereqs() error {
	if os.Getenv("KUBECONFIG") == "" && os.Getenv("KUBERNETES_SERVICE_HOST") == "" {
		return fmt.Errorf("cluster mode requires KUBECONFIG or in-cluster credentials")
	}
	return nil
}
