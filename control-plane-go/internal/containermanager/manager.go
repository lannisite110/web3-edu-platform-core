package containermanager

import (
	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

// Manager resolves toolchain images for compile jobs (v0.4 container-manager).
type Manager struct {
	toolchain *toolchain.Manifest
}

func New(m *toolchain.Manifest) *Manager {
	return &Manager{toolchain: m}
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
