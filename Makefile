.PHONY: compliance-check validate-plugin register-plugins test-e2e-smoke \
        run-rule-engine run-agent-assist run-scheduler run-scheduler-cm run-gateway run-container-manager run-frontend dev-backend ci-gate \
        fabric-bootstrap tutorial-audit labweave-path-check labweave-assist-smoke labweave-up labweave-up-lan labweave-down \
        k8s-smoke-all labweave-prod-build labweave-prod-up labweave-prod-down deploy-verify \
        container-manager-smoke scheduler-resolver-smoke bazel-smoke stop-backend \
        core-version-check release-check bazel-gate

MANIFEST ?=
PLUGINS_DIR ?= ..
CORE_ROOT := $(CURDIR)

compliance-check:
	bash ci/compliance/compliance-check.sh .

fabric-bootstrap:
	bash scripts/fabric-sandbox-bootstrap.sh

k8s-job-smoke:
	bash scripts/k8s-job-smoke.sh

k8s-multilang-smoke:
	bash scripts/k8s-multilang-smoke.sh

k8s-smoke-all:
	bash scripts/k8s-smoke-all.sh

labweave-prod-build:
	bash deploy/scripts/labweave-prod-build.sh

labweave-prod-up:
	bash deploy/scripts/labweave-prod-up.sh

labweave-prod-down:
	bash deploy/scripts/labweave-prod-down.sh

deploy-verify:
	bash deploy/scripts/verify-local.sh

labweave-path-check:
	bash ci/labweave-path-check.sh

tutorial-audit:
	bash ci/tutorial-audit.sh

core-version-check:
	bash ci/core-version-check.sh

release-check:
	bash scripts/release-check.sh

container-manager-smoke:
	bash scripts/container-manager-smoke.sh

scheduler-resolver-smoke:
	bash scripts/scheduler-resolver-smoke.sh

bazel-smoke:
	bash scripts/bazel-smoke.sh

bazel-gate:
	bash ci/bazel-gate.sh

validate-plugin:
	MANIFEST="$(MANIFEST)" bash ci/compliance/validate-plugin.sh

register-plugins:
	@test -x .venv/bin/python || python3 -m venv .venv
	.venv/bin/pip install -q -r rule-engine-py/requirements.txt -r agent-assist-py/requirements.txt pyyaml
	python3 ci/register-plugins.py $(PLUGINS_DIR)
	@find $(PLUGINS_DIR) -name 'plugin.manifest.yaml' | while read -r m; do \
		echo "  validated $$m"; \
		MANIFEST="$$m" bash ci/compliance/validate-plugin.sh || exit 1; \
	done

.PHONY: integration-all-plugins test-e2e-smoke

integration-all-plugins:
	bash ci/integration-all-plugins.sh

ci-gate:
	bash ci/ci-gate.sh

test-e2e-smoke:
	bash ci/e2e-smoke.sh

labweave-assist-smoke:
	bash ci/labweave-assist-smoke.sh

labweave-up:
	bash scripts/labweave-up.sh

labweave-up-lan:
	LABWEAVE_BIND_HOST=0.0.0.0 bash scripts/labweave-up.sh

labweave-down:
	bash scripts/labweave-down.sh

run-rule-engine:
	cd rule-engine-py && ../.venv/bin/python main.py

run-agent-assist:
	cd agent-assist-py && CORE_ROOT=$(CORE_ROOT) ../.venv/bin/python main.py

run-scheduler:
	cd control-plane-go && env -u CONTAINER_MANAGER_URL CORE_ROOT=$(CORE_ROOT) SCHEDULER_PORT=8082 go run ./cmd/scheduler

run-scheduler-cm:
	cd control-plane-go && CORE_ROOT=$(CORE_ROOT) SCHEDULER_PORT=8082 CONTAINER_MANAGER_URL=http://127.0.0.1:8083 go run ./cmd/scheduler

run-container-manager:
	cd control-plane-go && CORE_ROOT=$(CORE_ROOT) CONTAINER_MANAGER_PORT=8083 go run ./cmd/container-manager

stop-backend:
	@fuser -k 8080/tcp 8081/tcp 8082/tcp 8083/tcp 8084/tcp 2>/dev/null || true
	@echo "==> backend ports 8080-8084 freed"

run-gateway:
	cd api-gateway-go && CORE_ROOT=$(CORE_ROOT) GATEWAY_PORT=8080 AGENT_ASSIST_URL=http://127.0.0.1:8084 go run ./cmd/gateway

run-frontend:
	cd frontend-web && npm run dev

dev-backend: register-plugins
	@echo "Run in separate terminals: make run-rule-engine, run-agent-assist, run-scheduler, run-gateway"
