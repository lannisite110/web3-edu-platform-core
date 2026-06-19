package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/web3edu/platform-core/control-plane/internal/containermanager"
	"github.com/web3edu/platform-core/control-plane/internal/toolchain"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	root := os.Getenv("CORE_ROOT")
	if root == "" {
		root = ".."
	}

	manifest, err := toolchain.LoadManifest(root)
	if err != nil {
		log.Fatalf("load toolchain manifest: %v", err)
	}
	mgr := containermanager.New(manifest)
	log.Printf("container-manager loaded manifest v%s (%d groups)", mgr.Version(), len(mgr.Groups()))

	r := gin.New()
	r.Use(gin.Recovery())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "container-manager",
			"version": mgr.Version(),
			"groups":  len(mgr.Groups()),
		})
	})

	r.GET("/toolchains", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"version": mgr.Version(),
			"groups":  mgr.Groups(),
		})
	})

	r.GET("/resolve/:taskType", func(c *gin.Context) {
		out, ok := mgr.Resolve(c.Param("taskType"))
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "unknown task type"})
			return
		}
		c.JSON(http.StatusOK, out)
	})

	port := os.Getenv("CONTAINER_MANAGER_PORT")
	if port == "" {
		port = "8083"
	}
	log.Printf("container-manager listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
