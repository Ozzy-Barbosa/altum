import { Component, lazy, Suspense, useState, type ReactNode } from 'react';
import { solutions } from '../../data/catalog';
import { Modal, useDemo } from './Shared';
import { FeedbackContext } from './Shared';
const Catalog = lazy(() => import('./CatalogDemo'));
const Agenda = lazy(() => import('./AgendaDemo'));
const Inventory = lazy(() => import('./InventoryDemo'));
const Projects = lazy(() => import('./ProjectsDemo'));
const Search = lazy(() => import('./SearchDemo'));
class DemoErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="demo-error" role="alert">
        <h2>No se pudo abrir la demo.</h2>
        <p>
          Los datos guardados en este navegador podrían estar dañados. Puedes volver al catálogo o
          restablecer este módulo.
        </p>
        <button
          className="demo-button"
          onClick={() => {
            const module = location.pathname.split('/').filter(Boolean).at(-1);
            localStorage.removeItem(`altum-demo-v2:${module}`);
            location.reload();
          }}
        >
          Restablecer este módulo
        </button>
        <a className="text-link" href="/demos/">
          Volver a las demos
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
function Workspace({ module }: { module: string }) {
  const { data, send, ready, busy, notice, error, cloud } = useDemo(module);
  const [reset, setReset] = useState(false);
  const [revision, setRevision] = useState(0);
  const solution = solutions.find((s) => s.slug === module)!;
  const props = { data, send, busy };
  return (
    <FeedbackContext value={error}>
      <div
        className="demo-shell"
        style={{ '--demo-accent': solution.color } as React.CSSProperties}
      >
        <aside className="demo-sidebar">
          <a className="demo-home" href="/demos/">
            ↙ Todas las demos
          </a>
          <p className="demo-sidebar-label">TU NEGOCIO, EN DIGITAL</p>
          <nav aria-label="Aplicaciones de demostración">
            {solutions.map((s, i) => (
              <a
                href={`/demos/${s.slug}/`}
                aria-current={module === s.slug ? 'page' : undefined}
                key={s.slug}
              >
                <span aria-hidden="true">{['≋', '◷', '▦', '◇', '▤', '⌕'][i]}</span>
                {s.name}
              </a>
            ))}
          </nav>
          <div className="sidebar-help">
            <span className="status-dot"></span>
            <strong>Hecho para tu negocio.</strong>
            <p>Explora esta base e imagínala con tu marca.</p>
            <a href={`/contacto/?solucion=${module}`}>Quiero una solución así ↗</a>
          </div>
        </aside>
        <div className="demo-main">
          <div className="demo-topbar">
            <span>
              <span className="status-dot"></span>
              {cloud ? 'Sesión en la nube' : 'Demo local'}{' '}
              <span className="demo-topbar-detail">· Datos de ejemplo</span>
            </span>
            <button onClick={() => setReset(true)} disabled={busy || !ready}>
              ↻ Restablecer demo
            </button>
          </div>
          <div className="demo-save-note">
            {cloud
              ? 'Tus cambios se guardan en tu espacio de prueba.'
              : 'Tus cambios se guardan solo en este navegador. No uses datos reales.'}
          </div>
          <div className="feedback-area" aria-live="polite">
            {error ? (
              <p className="demo-alert" role="alert">
                {error}
              </p>
            ) : notice ? (
              <p className="demo-notice" role="status">
                {notice}
              </p>
            ) : null}
          </div>
          <fieldset className="demo-content" disabled={busy || !ready} aria-busy={!ready || busy}>
            <Suspense fallback={<p className="loading-demo">Cargando tu demostración…</p>}>
              <div key={revision}>
                {module === 'menu' || module === 'commerce' ? (
                  <Catalog kind={module} {...props} />
                ) : module === 'agenda' ? (
                  <Agenda {...props} />
                ) : module === 'inventario' ? (
                  <Inventory {...props} />
                ) : module === 'proyectos' ? (
                  <Projects {...props} />
                ) : (
                  <Search {...props} />
                )}
              </div>
            </Suspense>
          </fieldset>
        </div>
      </div>
      {reset ? (
        <Modal title="Restablecer esta demo" onClose={() => setReset(false)}>
          <p>
            Se reemplazarán tus cambios de {solution.name} por la información de ejemplo original.
            Las otras demos se conservan.
          </p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setReset(false)}>
              Conservar cambios
            </button>
            <button
              className="demo-button"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'reset' })) {
                  setRevision((v) => v + 1);
                  setReset(false);
                }
              }}
            >
              Restablecer ejemplos
            </button>
          </div>
        </Modal>
      ) : null}
    </FeedbackContext>
  );
}
export default function DemoApp({ module }: { module: string }) {
  return (
    <DemoErrorBoundary>
      <Workspace module={module} />
    </DemoErrorBoundary>
  );
}
