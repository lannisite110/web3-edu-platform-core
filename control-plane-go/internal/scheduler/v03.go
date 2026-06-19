package scheduler

import (
	"log"
	"time"

	"github.com/web3edu/platform-core/control-plane/internal/jobsubmit"
	"github.com/web3edu/platform-core/control-plane/internal/plugins"
	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

func (s *Store) completeV3(task *Task) {
	time.Sleep(500 * time.Millisecond)
	done := time.Now()
	task.Status = TaskCompleted
	task.CompletedAt = &done

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
		}
	}
	if s.toolchain != nil {
		if _, g, ok := s.toolchain.ResolveGroup(task.TaskType); ok {
			req.Image = g.Image
		}
	}

	sub, _ := jobsubmit.Submit(req)

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

	if s.toolchain != nil {
		if groupName, g, ok := s.toolchain.ResolveGroup(task.TaskType); ok {
			report["toolchain_group"] = groupName
			report["toolchain_image"] = g.Image
			report["toolchain_tools"] = g.Tools
			report["compile_message"] = sub.Message + "; toolchain " + g.Namespace + " / " + g.Image
		} else {
			report["compile_message"] = sub.Message
		}
	} else {
		report["compile_message"] = sub.Message
	}

	task.Report = report
	log.Printf("task %s completed mode=%s namespace=%s type=%s", task.ID, sub.Mode, task.Namespace, task.TaskType)
}

// keep v0.2 helpers for registry wiring
func (s *Store) SetToolchain(m *toolchain.Manifest) { s.toolchain = m }
func (s *Store) SetPluginRegistry(reg *plugins.Registry) { s.plugins = reg }
