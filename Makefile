.PHONY: test
test:
	deno check tests/main.test.ts

.PHONY: fmt
fmt:
	deno fmt

.PHONY: check-tidy
check-tidy:
	deno fmt --check
