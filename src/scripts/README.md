# GLOBAL SCRIPTS

This directory contains global typescript/javascript code that should be accessible to all modules. 

Modules from this directory can be imported using Parcel's tilde syntax to avoid ambiguous arbitrary relative nesting.

./scripts/factorial.js
---
```typescript
export function factorial(n: number): number {
  return n-2 < 0 ? 1 : n * factorial(n-1);
}
```

./components/componentName.ts
---
```typescript
import { factorial } from "~/src/assets/scripts/factorial";
```