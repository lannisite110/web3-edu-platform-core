package containermanager

import (
	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

// Manager resolves toolchain images for compile jobs (v0.5 container-manager service).
type Manager struct {
	toolchain *toolchain.Manifest
}

func New(m *toolchain.Manifest) *Manager {
	return &Manager{toolchain: m}
}

func (m *Manager) Version() string {
	if m == nil || m.toolchain == nil {
		return ""
	}
	return m.toolchain.Version
}

func (m *Manager) Groups() map[string]toolchain.Group {
	if m == nil || m.toolchain == nil {
		return nil
	}
	return m.toolchain.Groups
}

func (m *Manager) ResolveImage(taskType string) (group string, image string, namespace string, ok bool) {
	if m == nil || m.toolchain == nil {
		return "", "", "", false
	}
	group, g, ok := m.toolchain.ResolveGroup(taskType)
	if !ok {
		return "", "", "", false
	}
	return group, g.Image, g.Namespace, true
}

func (m *Manager) Resolve(taskType string) (map[string]any, bool) {
	group, image, namespace, ok := m.ResolveImage(taskType)
	if !ok {
		return nil, false
	}
	g := m.toolchain.Groups[group]
	return map[string]any{
		"task_type":  taskType,
		"group":      group,
		"image":      image,
		"namespace":  namespace,
		"tools":      g.Tools,
		"compliance": "testnet-only",
	}, true
}
