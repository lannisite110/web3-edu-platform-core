package jobsubmit

import (
	"context"
	"fmt"
	"strings"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func attachPodStatus(pods []corev1.Pod, extra map[string]any) {
	if len(pods) == 0 {
		return
	}
	summaries := make([]map[string]string, 0, len(pods))
	for _, pod := range pods {
		item := map[string]string{
			"name":  pod.Name,
			"phase": string(pod.Status.Phase),
		}
		for _, cs := range pod.Status.ContainerStatuses {
			if cs.State.Waiting != nil && cs.State.Waiting.Reason != "" {
				item["reason"] = cs.State.Waiting.Reason
				item["message"] = cs.State.Waiting.Message
			}
			if cs.State.Terminated != nil {
				item["exit_code"] = fmt.Sprintf("%d", cs.State.Terminated.ExitCode)
				item["reason"] = cs.State.Terminated.Reason
				item["message"] = cs.State.Terminated.Message
			}
		}
		summaries = append(summaries, item)
	}
	extra["pod_status"] = summaries
}

func attachPodEvents(ctx context.Context, clientset *kubernetes.Clientset, namespace string, pods []corev1.Pod, extra map[string]any) {
	var lines []string
	for _, pod := range pods {
		events, err := clientset.CoreV1().Events(namespace).List(ctx, metav1.ListOptions{
			FieldSelector: "involvedObject.name=" + pod.Name,
		})
		if err != nil || len(events.Items) == 0 {
			continue
		}
		start := 0
		if len(events.Items) > 5 {
			start = len(events.Items) - 5
		}
		for _, ev := range events.Items[start:] {
			lines = append(lines, fmt.Sprintf("%s %s: %s", pod.Name, ev.Reason, strings.TrimSpace(ev.Message)))
		}
	}
	if len(lines) > 0 {
		extra["pod_events"] = strings.Join(lines, "\n")
	}
}
