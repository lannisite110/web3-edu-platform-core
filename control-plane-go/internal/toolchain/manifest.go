package toolchain

import (
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

type Group struct {
	Namespace string   `yaml:"namespace"`
	Image     string   `yaml:"image"`
	Tools     []string `yaml:"tools"`
}

type Manifest struct {
	Version string           `yaml:"version"`
	Groups  map[string]Group `yaml:"groups"`
}

// TaskType -> toolchain group for compile jobs (v0.2)
var taskToolchain = map[string]string{
	"HOT_MULTI_LANG_COMPILE": "evm",
	"HOT_ZK_CIRCUIT_COMPILE": "zk",
	"HOT_ZK_ROLLUP_SIM":      "zk",
	"HOT_AA_WALLET_SIM":      "evm",
	"HOT_DEPIN_NODE_SIM":     "solana",
	"BASE_CONTRACT_COMPILE":  "evm",
}

func LoadManifest(coreRoot string) (*Manifest, error) {
	path := filepath.Join(coreRoot, "..", "web3-hot-topic-labs", "build-images", "manifest.yaml")
	if override := os.Getenv("TOOLCHAIN_MANIFEST"); override != "" {
		path = override
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var m Manifest
	if err := yaml.Unmarshal(data, &m); err != nil {
		return nil, err
	}
	return &m, nil
}

func (m *Manifest) ResolveGroup(taskType string) (string, Group, bool) {
	name, ok := taskToolchain[taskType]
	if !ok {
		return "", Group{}, false
	}
	g, ok := m.Groups[name]
	return name, g, ok
}
