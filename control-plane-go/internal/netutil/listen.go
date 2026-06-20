package netutil

import "os"

// ListenAddr returns host:port for HTTP servers.
// LISTEN_HOST=127.0.0.1 binds localhost only (production); empty binds all interfaces.
func ListenAddr(port string) string {
	if h := os.Getenv("LISTEN_HOST"); h != "" {
		return h + ":" + port
	}
	return ":" + port
}
