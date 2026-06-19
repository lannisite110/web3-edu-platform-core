package jobsubmit

import (
	"fmt"
	"os"
)

// Mode controls how scheduler fulfills compile/trace jobs (v0.3).
type Mode string

const (
	ModeLocal    Mode = "local"    // in-process simulation (default)
	ModeCluster  Mode = "cluster"  // submit Kubernetes Job (requires kubeconfig)
)

type Request struct {
	TaskID      string
	PluginID    string
	TaskType    string
	Namespace   string
	JobTemplate string
	Image       string
	Params      map[string]any
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

// Submit dispatches a job. Cluster mode returns a scaffold response until client-go wiring lands.
func Submit(req Request) (Result, error) {
	mode := CurrentMode()
	switch mode {
	case ModeCluster:
		return Result{
			Mode:    ModeCluster,
			Status:  "accepted",
			Message: "v0.3 cluster scaffold: configure KUBECONFIG and JOB_SUBMIT_MODE=cluster (client-go Job submit next)",
			Extra: map[string]any{
				"namespace":    req.Namespace,
				"job_template": req.JobTemplate,
				"image":        req.Image,
				"task_type":    req.TaskType,
			},
		}, nil
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
