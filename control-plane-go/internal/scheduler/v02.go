package scheduler

import (
	"log"
	"time"

	"github.com/web3edu/platform-core/control-plane/internal/plugins"
	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

func (s *Store) SetToolchain(m *toolchain.Manifest) {
	s.toolchain = m
}

func (s *Store) SetPluginRegistry(reg *plugins.Registry) {
	s.plugins = reg
}

func (s *Store) completeV2(task *Task) {
	time.Sleep(500 * time.Millisecond)
	done := time.Now()
	task.Status = TaskCompleted
	task.CompletedAt = &done

	report := map[string]any{
		"namespace":   task.Namespace,
		"mode":        "v0.2.0-local-job-sim",
		"chain_id":    11155111,
		"compliance":  "testnet-only",
		"task_type":   task.TaskType,
		"plugin_id":   task.PluginID,
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
			report["compile_message"] = "local sim: would run Job in " + g.Namespace + " with image " + g.Image
		} else {
			report["compile_message"] = "v0.2.0 scheduler sim completed (no toolchain mapping for task type)"
		}
	} else {
		report["compile_message"] = "v0.2.0 scheduler sim completed"
	}

	task.Report = report
	log.Printf("task %s completed namespace=%s type=%s", task.ID, task.Namespace, task.TaskType)
}
