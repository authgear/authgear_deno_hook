.PHONY: test
test:
	deno check tests/main.test.ts

.PHONY: fmt
fmt:
	deno fmt --check
