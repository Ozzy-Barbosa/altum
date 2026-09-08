import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { seed, transition, loadCloud, saveCloud, currentSession } from '../../lib/demo-store';
import { readBrowserSnapshot, saveBrowserSnapshot } from '../../lib/local-persistence.mjs';
export type Data = Record<string, any>;
export type Dispatch = (action: Record<string, any>) => Promise<boolean>;
export type DemoProps = { data: Data; send: Dispatch; busy: boolean };
export const FeedbackContext = createContext('');
export const values = (event: { currentTarget: HTMLFormElement }) =>
  Object.fromEntries(new FormData(event.currentTarget));
export function useDemo(module: string) {
  const [data, setData] = useState<Data>(() => seed(module));
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [cloud, setCloud] = useState(false);
  const version = useRef(0);
  const state = useRef(data);
  const localSnapshot = useRef<string | null>(null);
  const locked = useRef(false);
  useEffect(() => {
    let live = true;
    const init = async () => {
      const local = readBrowserSnapshot(module, seed(module));
      if (live) {
        localSnapshot.current = local.raw;
        state.current = local.data;
        setData(local.data);
        if (local.recovered)
          setNotice('Recuperamos la copia local anterior porque la última no se pudo leer.');
        if (local.invalid)
          setError(
            'No pudimos leer los datos guardados. Se muestran ejemplos; revisa antes de guardar nuevos cambios.',
          );
      }
      if (
        module !== 'personal' &&
        module !== 'soporte' &&
        import.meta.env.PUBLIC_DEMO_CLOUD === 'true' &&
        (await currentSession())
      ) {
        try {
          const remote = await loadCloud(module);
          if (live) {
            state.current = remote.data;
            setData(remote.data);
            version.current = remote.version;
            setCloud(true);
          }
        } catch {
          if (live) setError('La nube no respondió. Estás usando la copia local de demostración.');
        }
      }
      if (live) setReady(true);
    };
    init();
    return () => {
      live = false;
    };
  }, [module]);
  const send: Dispatch = async (action) => {
    if (!ready || locked.current) return false;
    locked.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const next = transition(module, state.current, action);
      if (cloud) version.current = await saveCloud(module, next, version.current);
      const result = await saveBrowserSnapshot(
        module,
        next,
        cloud ? undefined : localSnapshot.current,
        seed(module),
      );
      localSnapshot.current = result.raw;
      const saved = result.saved;
      state.current = next;
      setData(next);
      setNotice(
        action.type === 'reset'
          ? 'Datos de ejemplo restablecidos.'
          : cloud
            ? 'Cambio guardado en tu espacio de demostración.'
            : saved
              ? 'Cambio guardado en este navegador.'
              : 'Cambio aplicado. Este navegador no permite guardarlo al cerrar.',
      );
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo completar la acción.');
      return false;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };
  return { data, send, ready, busy, notice, error, cloud };
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const error = useContext(FeedbackContext);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="demo-modal"
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button type="button" className="icon-button" aria-label="Cerrar ventana" onClick={onClose}>
          ×
        </button>
      </div>
      {error ? (
        <p className="demo-alert" role="alert">
          {error}
        </p>
      ) : null}
      {children}
    </dialog>
  );
}
export function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`field ${full ? 'full' : ''}`}>
      {label}
      {children}
    </label>
  );
}
export function Stats({
  items,
}: {
  items: { label: string; value: string | number; detail?: string }[];
}) {
  return (
    <div className="stats">
      {items.map((x) => (
        <article key={x.label}>
          <span>{x.label}</span>
          <strong>{x.value}</strong>
          {x.detail ? <small>{x.detail}</small> : null}
        </article>
      ))}
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="empty">
      <span aria-hidden="true">◇</span>
      <p>{children}</p>
    </div>
  );
}
export function Tabs({
  values: options,
  value,
  onChange,
}: {
  values: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="demo-tabs" aria-label="Vistas disponibles">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
export function ExportButton({ rows, name }: { rows: Record<string, unknown>[]; name: string }) {
  function download() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const escape = (v: unknown) => {
      let s = String(v ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return '"' + s.replaceAll('"', '""') + '"';
    };
    const csv =
      '\uFEFF' +
      [
        headers.map(escape).join(','),
        ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
      ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button
      className="demo-button secondary"
      type="button"
      onClick={download}
      disabled={!rows.length}
    >
      Exportar CSV ↓
    </button>
  );
}
