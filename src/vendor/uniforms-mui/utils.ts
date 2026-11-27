// Local replacements for the lodash/invariant helpers upstream uniforms-mui
// imports, so the vendored copy adds no runtime dependencies.

export function omit<T extends object>(
  object: T,
  keys: readonly PropertyKey[],
): Partial<T> {
  const result = { ...object }
  for (const key of keys) {
    delete (result as Record<PropertyKey, unknown>)[key]
  }
  return result
}

/** Symmetric difference of two arrays, keeping first-seen order. */
export function xor<T>(a: readonly T[], b: readonly T[]): T[] {
  return [
    ...a.filter((item) => !b.includes(item)),
    ...b.filter((item) => !a.includes(item)),
  ]
}

export function cloneDeep<T>(value: T): T {
  return value === undefined ? value : structuredClone(value)
}

/** Throws when `condition` is falsy; `%s` placeholders take `args` in order. */
export function invariant(
  condition: unknown,
  format: string,
  ...args: unknown[]
): never | void {
  if (!condition) {
    let index = 0
    throw new Error(format.replace(/%s/g, () => String(args[index++])))
  }
}

/**
 * Merges default props for one MUI slot with whatever the caller passed in
 * `slotProps[slot]`, which MUI allows to be an object or a function of the
 * owner state. Caller values win, as the old `*Props` spreads did.
 */
export function mergeSlotProps<T>(defaults: object, override: T): T {
  if (typeof override === 'function') {
    return ((ownerState: unknown) => ({
      ...defaults,
      ...override(ownerState),
    })) as T
  }
  return { ...defaults, ...(override as object | undefined) } as T
}
