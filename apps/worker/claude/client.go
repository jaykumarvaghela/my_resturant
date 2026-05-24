package claude

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

const apiURL = "https://api.anthropic.com/v1/messages"

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Request struct {
	Model     string    `json:"model"`
	MaxTokens int       `json:"max_tokens"`
	Messages  []Message `json:"messages"`
}

func Ask(prompt string) (string, error) {
	apiKey := os.Getenv("ANTHROPIC_API_KEY")
	payload := Request{
		Model:     "claude-sonnet-4-20250514",
		MaxTokens: 1024,
		Messages:  []Message{{Role: "user", Content: prompt}},
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", apiURL, bytes.NewBuffer(body))
	req.Header.Set("x-api-key", apiKey)
	req.Header.Set("anthropic-version", "2023-06-01")
	req.Header.Set("content-type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("claude request failed: %w", err)
	}
	defer resp.Body.Close()

	// TODO: Parse response
	return "ok", nil
}
