package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/web3edu/platform-core/control-plane/internal/containermanager"
	"github.com/web3edu/platform-core/control-plane/internal/plugins"
	"github.com/web3edu/platform-core/control-plane/internal/scheduler"
	"gopkg.in/yaml.v3"
)

func loadRouting() map[string]string {
	root := os.Getenv("CORE_ROOT")
	if root == "" {
		root = ".."
	}
	path := filepath.Join(root, "schemas", "task-types.yaml")
	data, err := os.ReadFile(path)
	if err != nil {
		log.Printf("warning: cannot read task-types.yaml: %v", err)
		return map[string]string{"BASE_CONTRACT_COMPILE": "ns-evm"}
	}
	var doc struct {
		Routing map[string]string `yaml:"routing"`
	}
	if err := yaml.Unmarshal(data, &doc); err != nil {
		log.Fatalf("parse task-types: %v", err)
	}
	return doc.Routing
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	root := os.Getenv("CORE_ROOT")
	if root == "" {
		root = ".."
	}
	store := scheduler.NewStore(loadRouting())
	if resolver := containermanager.NewResolver(root); resolver != nil {
		store.SetResolver(resolver)
		if os.Getenv("CONTAINER_MANAGER_URL") != "" {
			log.Printf("toolchain resolver: container-manager %s", os.Getenv("CONTAINER_MANAGER_URL"))
		} else {
			log.Printf("toolchain resolver: local manifest")
		}
	} else {
		log.Printf("warning: toolchain resolver unavailable")
	}
	if reg, err := plugins.LoadRegistry(root); err != nil {
		log.Printf("warning: plugin registry: %v", err)
	} else {
		store.SetPluginRegistry(reg)
		log.Printf("plugin registry loaded (%d plugins)", len(reg.List()))
	}
	mode := os.Getenv("JOB_SUBMIT_MODE")
	if mode == "" {
		mode = "local"
	}
	log.Printf("job submit mode: %s", mode)
	r := gin.New()
	r.Use(gin.Recovery())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "control-plane-scheduler"})
	})

	r.POST("/submit", func(c *gin.Context) {
		var req struct {
			PluginID string         `json:"plugin_id"`
			TaskType string         `json:"task_type"`
			Params   map[string]any `json:"params"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		task, err := store.Submit(req.PluginID, req.TaskType, req.Params)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusAccepted, task)
	})

	r.GET("/status/:id", func(c *gin.Context) {
		task, ok := store.Get(c.Param("id"))
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "task not found"})
			return
		}
		c.JSON(http.StatusOK, task)
	})

	r.GET("/report/:id", func(c *gin.Context) {
		task, ok := store.Get(c.Param("id"))
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "task not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"task_id": task.ID, "report": task.Report, "status": task.Status})
	})

	port := os.Getenv("SCHEDULER_PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("scheduler listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
