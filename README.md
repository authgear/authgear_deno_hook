# authgear\_deno\_hook

This Deno package assist the developer to write Deno Hooks.

https://deno.land/x/authgear_deno_hook

## Usage

```typescript
import { HookEvent, HookResponse } from "https://deno.land/x/authgear_deno_hook@v0.1.0/mod.ts";

export default async function(e: HookEvent): Promise<HookResponse> {
  // Write your hook with the help of the type definition.
}
```
