package plugins

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type PluginRef struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Version      string   `json:"version"`
	Repo         string   `json:"repo"`
	ComplianceTier string `json:"complianceTier"`
	Group        string   `json:"group"`
	RoutePrefix  string   `json:"routePrefix"`
	RulesEntry   string   `json:"rulesEntry"`
	TaskTypes    []string `json:"taskTypes"`
	Namespaces   []string `json:"namespaces"`
}

type Registry struct {
	byID map[string]PluginRef
	list []PluginRef
}

func LoadRegistry() (*Registry, error) {
	root := os.Getenv("CORE_ROOT")
	if root == "" {
		root = "."
	}
	path := filepath.Join(root, "api-gateway-go", "config", "plugins.registry.json")
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
