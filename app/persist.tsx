/**
 * Ignore this function. It's a helper to persist state across hot reloads.
 */
export function persist<T>(key: string, factory: () => T): T {
  //@ts-expect-error
  global[key] = global[key] || factory();
  //@ts-expect-error
  return global[key];
}
