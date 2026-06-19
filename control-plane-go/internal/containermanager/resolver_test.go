package containermanager

import (
	"testing"

	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

func TestLocalResolverResolve(t *testing.T) {
	m := &toolchain.Manifest{
		Version: "0.2.0",
		Groups: map[string]toolchain.Group{
			"evm": {
				Namespace: "ns-evm",
				Image:     "edu/toolchain-evm:0.2.0",
				Tools:     []string{"solc"},
			},
		},
	}
	r := NewLocalResolver(m)
	got, ok := r.Resolve("HOT_MULTI_LANG_COMPILE")
	if !ok {
		t.Fatal("expected resolve ok")
	}
	if got.Image != "edu/toolchain-evm:0.2.0" || got.Group != "evm" {
		t.Fatalf("unexpected resolve: %+v", got)
	}
}
