package containermanager

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

type ResolveResult struct {
	Group     string
	Image     string
	Namespace string
	Tools     []string
}

type Resolver interface {
	Resolve(taskType string) (ResolveResult, bool)
}

type LocalResolver struct {
	manifest *toolchain.Manifest
}

func NewLocalResolver(m *toolchain.Manifest) *LocalResolver {
	return &LocalResolver{manifest: m}
}

func (r *LocalResolver) Resolve(taskType string) (ResolveResult, bool) {
	if r == nil || r.manifest == nil {
		return ResolveResult{}, false
	}
	group, g, ok := r.manifest.ResolveGroup(taskType)
	if !ok {
		return ResolveResult{}, false
	}
	return ResolveResult{
		Group:     group,
		Image:     g.Image,
		Namespace: g.Namespace,
		Tools:     g.Tools,
	}, true
}

type HTTPResolver struct {
	baseURL string
	client  *http.Client
}

func NewHTTPResolver(baseURL string) *HTTPResolver {
	baseURL = strings.TrimRight(baseURL, "/")
	return &HTTPResolver{
		baseURL: baseURL,
		client:  &http.Client{Timeout: 5 * time.Second},
	}
}

func (r *HTTPResolver) Resolve(taskType string) (ResolveResult, bool) {
	if r == nil || r.baseURL == "" {
		return ResolveResult{}, false
	}
	url := fmt.Sprintf("%s/resolve/%s", r.baseURL, taskType)
	resp, err := r.client.Get(url)
	if err != nil {
		return ResolveResult{}, false
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return ResolveResult{}, false
	}
	var out struct {
		Group     string   `json:"group"`
		Image     string   `json:"image"`
		Namespace string   `json:"namespace"`
		Tools     []string `json:"tools"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return ResolveResult{}, false
	}
	return ResolveResult{
		Group:     out.Group,
		Image:     out.Image,
		Namespace: out.Namespace,
		Tools:     out.Tools,
	}, true
}

func NewResolver(coreRoot string) Resolver {
	if url := os.Getenv("CONTAINER_MANAGER_URL"); url != "" {
		if probeContainerManager(url) {
			return NewHTTPResolver(url)
		}
		log.Printf("warning: CONTAINER_MANAGER_URL unreachable (%s), fallback to local manifest", url)
	}
	m, err := toolchain.LoadManifest(coreRoot)
	if err != nil {
		return nil
	}
	return NewLocalResolver(m)
}

func probeContainerManager(baseURL string) bool {
	client := &http.Client{Timeout: 2 * time.Second}
	url := strings.TrimRight(baseURL, "/") + "/health"
	resp, err := client.Get(url)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode == http.StatusOK
}
