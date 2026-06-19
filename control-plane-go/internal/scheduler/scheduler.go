package scheduler

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/web3edu/platform-core/control-plane/internal/plugins"
	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

type TaskStatus string

const (
	TaskPending   TaskStatus = "pending"
	TaskRunning   TaskStatus = "running"
	TaskCompleted TaskStatus = "completed"
	TaskFailed    TaskStatus = "failed"
)

type Task struct {
	ID          string            `json:"id"`
	PluginID    string            `json:"plugin_id"`
	TaskType    string            `json:"task_type"`
	Namespace   string            `json:"namespace"`
	Status      TaskStatus        `json:"status"`
	Params      map[string]any    `json:"params"`
	Report      map[string]any    `json:"report,omitempty"`
	CreatedAt   time.Time         `json:"created_at"`
	CompletedAt *time.Time        `json:"completed_at,omitempty"`
}

type Store struct {
	mu        sync.RWMutex
	tasks     map[string]*Task
	route     map[string]string
	toolchain *toolchain.Manifest
	plugins   *plugins.Registry
}

func NewStore(routing map[string]string) *Store {
	return &Store{tasks: make(map[string]*Task), route: routing}
}

func (s *Store) Submit(pluginID, taskType string, params map[string]any) (*Task, error) {
	ns, ok := s.route[taskType]
	if !ok {
		return nil, fmt.Errorf("unknown task type: %s", taskType)
	}
	id := uuid.NewString()
	now := time.Now()
	task := &Task{
		ID:        id,
		PluginID:  pluginID,
		TaskType:  taskType,
		Namespace: ns,
		Status:    TaskRunning,
		Params:    params,
		CreatedAt: now,
	}
	s.mu.Lock()
	s.tasks[id] = task
	s.mu.Unlock()

	go s.completeV3(task)
	return task, nil
}

func (s *Store) Get(id string) (*Task, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	t, ok := s.tasks[id]
	return t, ok
}
