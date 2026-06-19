package plugins

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type PluginRef struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	Version        string   `json:"version"`
	Repo           string   `json:"repo"`
	ComplianceTier string   `json:"complianceTier"`
	Group          string   `json:"group"`
	RoutePrefix    string   `json:"routePrefix"`
	RulesEntry     string   `json:"rulesEntry"`
	TaskTypes      []string `json:"taskTypes"`
	Namespaces     []string `json:"namespaces"`
	JobTemplate    string   `json:"jobTemplate,omitempty"`
	ManifestPath   string   `json:"manifestPath,omitempty"`
}

type Registry struct {
	byID map[string]PluginRef
	list []PluginRef
}

func LoadRegistry(coreRoot string) (*Registry, error) {
	path := filepath.Join(coreRoot, "control-plane-go", "config", "plugins.registry.json")
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var refs []PluginRef
	if err := json.Unmarshal(data, &refs); err != nil {
		return nil, err
	}
	r := &Registry{byID: make(map[string]PluginRef), list: refs}
	for _, p := range refs {
		r.byID[p.ID] = p
	}
	return r, nil
}

func (r *Registry) Get(id string) (PluginRef, bool) {
	p, ok := r.byID[id]
	return p, ok
}

func (r *Registry) List() []PluginRef {
	return r.list
}
