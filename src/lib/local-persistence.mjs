export const localKey = (module) => `altum-demo-v2:${module}`;
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
// Validate the envelope and required top-level fields; business rules remain in the domain layer.
export function parseSnapshot(raw, module, initial) {
  if (!raw || raw.length > 2500000) return null;
  try {
    const value = JSON.parse(raw);
    if (value.version !== 2 || (value.module && value.module !== module) || !record(value.data))
      return null;
    if (
      value.revision !== undefined &&
      (!Number.isSafeInteger(value.revision) || value.revision < 0)
    )
      return null;
    for (const [key, example] of Object.entries(initial)) {
      const field = value.data[key];
      if (
        Array.isArray(example)
          ? !Array.isArray(field)
          : record(example)
            ? !record(field)
            : typeof field !== typeof example
      )
        return null;
    }
    return value;
  } catch {
    return null;
  }
}
export function readSnapshot(storage, module, initial) {
  let raw = null;
  try {
    raw = storage.getItem(localKey(module));
    const current = parseSnapshot(raw, module, initial);
    if (current) return { data: current.data, raw, recovered: false, invalid: false };
    if (raw) {
      const previous = parseSnapshot(
        storage.getItem(localKey(module) + ':previous'),
        module,
        initial,
      );
      if (previous) return { data: previous.data, raw, recovered: true, invalid: false };
    }
    return { data: initial, raw, recovered: false, invalid: Boolean(raw) };
  } catch {
    return { data: initial, raw: null, recovered: false, invalid: false };
  }
}
export function writeSnapshot(storage, module, data, expectedRaw, initial) {
  const key = localKey(module);
  let current;
  try {
    current = storage.getItem(key);
  } catch {
    return { saved: false, raw: expectedRaw ?? null };
  }
  if (expectedRaw !== undefined && current !== expectedRaw) {
    throw Error(
      'Esta demo cambió en otra pestaña. Recarga para ver la última versión antes de guardar. Tu cambio no se ha aplicado.',
    );
  }
  const previous = parseSnapshot(current, module, initial);
  const raw = JSON.stringify({
    version: 2,
    module,
    revision: (previous?.revision || 0) + 1,
    updatedAt: new Date().toISOString(),
    data,
  });
  if (!parseSnapshot(raw, module, initial))
    throw Error('Los datos no tienen una estructura válida para esta demo.');
  // A local recovery copy is useful, but is not a remote or guaranteed backup.
  if (previous) {
    try {
      storage.setItem(key + ':previous', current);
    } catch {}
  }
  try {
    storage.setItem(key, raw);
    return { saved: true, raw };
  } catch {
    return { saved: false, raw: current };
  }
}
export function readBrowserSnapshot(module, initial) {
  try {
    return readSnapshot(localStorage, module, initial);
  } catch {
    return { data: initial, raw: null, recovered: false, invalid: false };
  }
}
export async function saveBrowserSnapshot(module, data, expectedRaw, initial) {
  const save = () => {
    let storage;
    try {
      storage = localStorage;
    } catch {
      return { saved: false, raw: expectedRaw ?? null };
    }
    return writeSnapshot(storage, module, data, expectedRaw, initial);
  };
  // Web Locks serializes writes across tabs that support it. The snapshot comparison is the fallback.
  if (typeof navigator !== 'undefined' && navigator.locks)
    return navigator.locks.request(localKey(module), save);
  return save();
}
