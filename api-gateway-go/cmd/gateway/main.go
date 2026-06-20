package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/web3edu/platform-core/api-gateway-go/internal/plugins"
	"github.com/web3edu/platform-core/api-gateway-go/internal/security"
)

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func main() {
	reg, err := plugins.LoadRegistry()
	if err != nil {
		log.Fatalf("load plugin registry: %v (run: make register-plugins)", err)
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	r.Use(security.MainnetBlockMiddleware())

	ruleEngineURL := env("RULE_ENGINE_URL", "http://127.0.0.1:8081")
	schedulerURL := env("SCHEDULER_URL", "http://127.0.0.1:8082")
	agentAssistURL := env("AGENT_ASSIST_URL", "http://127.0.0.1:8084")
	client := &http.Client{Timeout: 10 * time.Second}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "api-gateway-go", "plugins": len(reg.List())})
	})

	r.GET("/api/v1/plugins", func(c *gin.Context) {
		c.JSON(http.StatusOK, reg.List())
	})

	lab := r.Group("/api/v1/labs/:plugin_id")
	{
		lab.POST("/simulate", func(c *gin.Context) {
			pluginID := c.Param("plugin_id")
			p, ok := reg.Get(pluginID)
			if !ok {
				c.JSON(http.StatusNotFound, gin.H{"error": "plugin not found"})
				return
			}

			var body struct {
				UserPrompt      string         `json:"user_prompt"`
				Params          map[string]any `json:"params"`
				AllowedChainIDs []any          `json:"allowed_chain_ids"`
				TaskType        string         `json:"task_type"`
			}
			if err := c.ShouldBindJSON(&body); err != nil {
				body.Params = map[string]any{}
				body.AllowedChainIDs = []any{11155111}
			}
			if body.AllowedChainIDs == nil {
				body.AllowedChainIDs = []any{11155111}
			}

			evalReq := map[string]any{
				"plugin_id":           pluginID,
				"user_prompt":         body.UserPrompt,
				"params":              body.Params,
				"allowed_chain_ids":   body.AllowedChainIDs,
			}
			evalBody, _ := json.Marshal(evalReq)
			resp, err := client.Post(ruleEngineURL+"/evaluate", "application/json", bytes.NewReader(evalBody))
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"error": "rule engine unavailable", "detail": err.Error()})
				return
			}
			defer resp.Body.Close()
			evalRaw, _ := io.ReadAll(resp.Body)
			if resp.StatusCode >= 400 {
				c.Data(resp.StatusCode, "application/json", evalRaw)
				return
			}

			taskType := p.TaskTypes[0]
			if body.TaskType != "" {
				for _, tt := range p.TaskTypes {
					if tt == body.TaskType {
						taskType = body.TaskType
						break
					}
				}
			}
			submitReq := map[string]any{
				"plugin_id": pluginID,
				"task_type": taskType,
				"params":    body.Params,
			}
			submitBody, _ := json.Marshal(submitReq)
			sresp, err := client.Post(schedulerURL+"/submit", "application/json", bytes.NewReader(submitBody))
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"error": "scheduler unavailable", "detail": err.Error()})
				return
			}
			defer sresp.Body.Close()
			taskRaw, _ := io.ReadAll(sresp.Body)
			if sresp.StatusCode >= 400 {
				c.Data(sresp.StatusCode, "application/json", taskRaw)
				return
			}

			var task map[string]any
			_ = json.Unmarshal(taskRaw, &task)

			c.JSON(http.StatusAccepted, gin.H{
				"plugin_id":   pluginID,
				"plugin_name": p.Name,
				"evaluation":  json.RawMessage(evalRaw),
				"task":        task,
			})
		})

		lab.GET("/status/:task_id", func(c *gin.Context) {
			taskID := c.Param("task_id")
			resp, err := client.Get(schedulerURL + "/status/" + taskID)
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
				return
			}
			defer resp.Body.Close()
			raw, _ := io.ReadAll(resp.Body)
			c.Data(resp.StatusCode, "application/json", raw)
		})

		lab.GET("/report/:task_id", func(c *gin.Context) {
			taskID := c.Param("task_id")
			resp, err := client.Get(schedulerURL + "/report/" + taskID)
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
				return
			}
			defer resp.Body.Close()
			raw, _ := io.ReadAll(resp.Body)
			c.Data(resp.StatusCode, "application/json", raw)
		})

		lab.POST("/assist", func(c *gin.Context) {
			pluginID := c.Param("plugin_id")
			if _, ok := reg.Get(pluginID); !ok {
				c.JSON(http.StatusNotFound, gin.H{"error": "plugin not found"})
				return
			}
			body, err := io.ReadAll(c.Request.Body)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			url := agentAssistURL + "/assist/" + pluginID
			resp, err := client.Post(url, "application/json", bytes.NewReader(body))
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"error": "agent assist unavailable", "detail": err.Error()})
				return
			}
			defer resp.Body.Close()
			raw, _ := io.ReadAll(resp.Body)
			c.Data(resp.StatusCode, "application/json", raw)
		})
	}

	port := env("GATEWAY_PORT", "8080")
	log.Printf("gateway listening on :%s (%d plugins)", port, len(reg.List()))
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
