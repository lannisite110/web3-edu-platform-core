package scheduler

import (
	"log"
	"time"

	"github.com/web3edu/platform-core/control-plane/internal/containermanager"
	"github.com/web3edu/platform-core/control-plane/internal/jobsubmit"
	"github.com/web3edu/platform-core/control-plane/internal/plugins"
)

func (s *Store) completeV4(task *Task) {
	if jobsubmit.CurrentMode() == jobsubmit.ModeLocal {
		time.Sleep(500 * time.Millisecond)
	}

	req := jobsubmit.Request{
		TaskID:    task.ID,
		PluginID:  task.PluginID,
		TaskType:  task.TaskType,
		Namespace: task.Namespace,
		Params:    task.Params,
	}

	if s.plugins != nil {
		if p, ok := s.plugins.Get(task.PluginID); ok {
			req.JobTemplate = p.JobTemplate
			req.ManifestPath = p.ManifestPath
		}
	}
	if s.resolver != nil {
		if resolved, ok := s.resolver.Resolve(task.TaskType); ok {
			req.Image = resolved.Image
		}
	}

	sub, err := jobsubmit.Submit(req)
	if err != nil {
		sub = jobsubmit.Result{
			Mode:    jobsubmit.CurrentMode(),
			Status:  "failed",
			Message: err.Error(),
		}
	}

	done := time.Now()
	task.CompletedAt = &done
	switch sub.Status {
	case "completed":
		task.Status = TaskCompleted
	case "failed", "timeout":
		task.Status = TaskFailed
	default:
		task.Status = TaskCompleted
	}

	report := map[string]any{
		"namespace":  task.Namespace,
		"mode":       string(sub.Mode),
		"chain_id":   11155111,
		"compliance": "testnet-only",
		"task_type":  task.TaskType,
		"plugin_id":  task.PluginID,
		"job_submit": sub,
	}

	if s.plugins != nil {
		if p, ok := s.plugins.Get(task.PluginID); ok {
			if p.JobTemplate != "" {
				report["job_template"] = p.JobTemplate
			}
			report["plugin_name"] = p.Name
		}
	}

	if s.resolver != nil {
		if resolved, ok := s.resolver.Resolve(task.TaskType); ok {
			report["toolchain_group"] = resolved.Group
			report["toolchain_image"] = resolved.Image
			report["toolchain_tools"] = resolved.Tools
			report["compile_message"] = sub.Message + "; toolchain " + resolved.Namespace + " / " + resolved.Image
		} else {
			report["compile_message"] = sub.Message
		}
	} else {
		report["compile_message"] = sub.Message
	}

	task.Report = report
	log.Printf("task %s finished status=%s mode=%s namespace=%s type=%s", task.ID, task.Status, sub.Mode, task.Namespace, task.TaskType)
}

func (s *Store) SetResolver(r containermanager.Resolver) { s.resolver = r }
func (s *Store) SetPluginRegistry(reg *plugins.Registry) { s.plugins = reg }
