.PHONY: compliance-check validate-plugin register-plugins test-e2e-smoke \
        run-rule-engine run-scheduler run-gateway run-frontend dev-backend ci-gate \
        fabric-bootstrap

MANIFEST ?=
PLUGINS_DIR ?= ..
CORE_ROOT := $(CURDIR)

compliance-check:
	bash ci/compliance/compliance-check.sh .

fabric-bootstrap:
	bash scripts/fabric-sandbox-bootstrap.sh

validate-plugin:
	MANIFEST="$(MANIFEST)" bash ci/compliance/validate-plugin.sh

register-plugins:
	@test -x .venv/bin/python || python3 -m venv .venv
	.venv/bin/pip install -q -r rule-engine-py/requirements.txt pyyaml
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

run-rule-engine:
	cd rule-engine-py && ../.venv/bin/python main.py

run-scheduler:
	cd control-plane-go && CORE_ROOT=$(CORE_ROOT) SCHEDULER_PORT=8082 go run ./cmd/scheduler

run-gateway:
	cd api-gateway-go && CORE_ROOT=$(CORE_ROOT) GATEWAY_PORT=8080 go run ./cmd/gateway

run-frontend:
	cd frontend-web && npm run dev

dev-backend: register-plugins
	@echo "Run in separate terminals: make run-rule-engine, run-scheduler, run-gateway"
