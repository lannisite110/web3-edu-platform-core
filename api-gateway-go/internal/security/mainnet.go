package security

import (
	"bytes"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

var blockedPatterns = []string{
	"mainnet",
	"eth-mainnet",
	"mainnet.infura.io",
	"api.mainnet-beta.solana.com",
}

func MainnetBlockMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var bodyBytes []byte
		if c.Request.Body != nil {
			bodyBytes, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}
		scan := strings.ToLower(c.Request.URL.RawQuery + " " + string(bodyBytes))
		for _, p := range blockedPatterns {
			if strings.Contains(scan, p) {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
					"error":      "mainnet configuration blocked by compliance policy",
					"pattern":    p,
					"compliance": "testnet-only",
				})
				return
			}
		}
		c.Next()
	}
}
