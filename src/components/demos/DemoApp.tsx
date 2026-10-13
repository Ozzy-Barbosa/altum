import { ui, localizedHref } from '../../i18n/messages.mjs';
import { Component, lazy, Suspense, useState, type ReactNode } from 'react';
import { solutions } from '../../data/catalog';
import { Modal, useDemo } from './Shared';
import { FeedbackContext } from './Shared';
const Catalog = lazy(() => import('./CatalogDemo'));
const Agenda = lazy(() => import('./AgendaDemo'));
const Inventory = lazy(() => import('./InventoryDemo'));
const Projects = lazy(() => import('./ProjectsDemo'));
const Search = lazy(() => import('./SearchDemo'));
const Finance = lazy(() => import('./FinanceDemo'));
const Crm = lazy(() => import('./CrmDemo'));
const Quotes = lazy(() => import('./QuotesDemo'));
const Personal = lazy(() => import('./PersonalDemo'));
const Support = lazy(() => import('./SupportDemo'));
const Services = lazy(() => import('./ServicesDemo'));
class DemoErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="demo-error" role="alert">
        <h2>{ui('No se pudo abrir la demo.')}</h2>
        <p>
          {ui(
            'Los datos guardados en este navegador podrían estar dañados. Puedes volver al catálogo o restablecer este módulo. ',
          )}
        </p>
        <button
          className="demo-button"
          onClick={() => {
            const module = location.pathname.split('/').filter(Boolean).at(-1);
            try {
              localStorage.removeItem(`altum-demo-v2:${module}`);
              localStorage.removeItem(`altum-demo-v2:${module}:previous`);
            } catch {}
            location.reload();
          }}
        >
          {ui('Restablecer este módulo ')}
        </button>
        <a className="text-link" href={localizedHref('/demos/')}>
          {ui('Volver a las demos ')}
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
          <a className="demo-home" href={localizedHref('/demos/')}>
            {ui('↙ Todas las demos ')}
          </a>
          <p className="demo-sidebar-label">{ui('TU NEGOCIO, EN DIGITAL')}</p>
          <label className="demo-switcher">
            {ui('Explorar otra demo ')}
            <select
              value={module}
              onChange={(e) => {
                location.href = localizedHref(`/demos/${e.target.value}/`);
              }}
            >
              {solutions.map((s) => (
                <option value={s.slug} key={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <nav aria-label={ui('Aplicaciones de demostración')}>
            {solutions.map((s, i) => (
              <a
                href={localizedHref(`/demos/${s.slug}/`)}
                aria-current={module === s.slug ? 'page' : undefined}
                key={s.slug}
              >
                <span aria-hidden="true">
                  {['≋', '◷', '▦', '◇', '▤', '⌕', '↗', '◎', '▧', '⚒', '◉', '✧'][i]}
                </span>
                {s.name}
              </a>
            ))}
          </nav>
          <div className="sidebar-help">
            <span className="status-dot"></span>
            <strong>{ui('Hecho para tu negocio.')}</strong>
            <p>{ui('Explora esta base e imagínala con tu marca.')}</p>
            <a href={localizedHref(`/contacto/?solucion=${module}`)}>
              {ui('Quiero una solución así ↗')}
            </a>
          </div>
        </aside>
        <div className="demo-main">
          <div className="demo-topbar">
            <span>
              <span className="status-dot"></span>
              {cloud ? ui('Sesión en la nube') : ui('Demo local')}{' '}
              <span className="demo-topbar-detail">{ui('· Datos de ejemplo')}</span>
            </span>
            <button onClick={() => setReset(true)} disabled={busy || !ready}>
              {ui('↻ Restablecer demo ')}
            </button>
          </div>
          <div className="demo-save-note">
            {cloud
              ? ui('Tus cambios se guardan en tu espacio de prueba.')
              : ui('Tus cambios se guardan solo en este navegador. No uses datos reales.')}
          </div>
          <div className="feedback-area" aria-live="polite">
            {error ? (
              <p className="demo-alert" role="alert">
                {ui(error)}
              </p>
            ) : notice ? (
              <p className="demo-notice" role="status">
                {ui(notice)}
              </p>
            ) : null}
          </div>
          <fieldset className="demo-content" disabled={busy || !ready} aria-busy={!ready || busy}>
            <Suspense fallback={<p className="loading-demo">{ui('Cargando tu demostración…')}</p>}>
              <div key={revision}>
                {module === 'menu' || module === 'commerce' ? (
                  <Catalog kind={module} {...props} />
                ) : module === 'agenda' ? (
                  <Agenda {...props} />
                ) : module === 'inventario' ? (
                  <Inventory {...props} />
                ) : module === 'proyectos' ? (
                  <Projects {...props} />
                ) : module === 'finanzas' ? (
                  <Finance {...props} />
                ) : module === 'crm' ? (
                  <Crm {...props} />
                ) : module === 'cotizaciones' ? (
                  <Quotes {...props} />
                ) : module === 'personal' ? (
                  <Personal {...props} />
                ) : module === 'soporte' ? (
                  <Support {...props} />
                ) : module === 'servicios' ? (
                  <Services {...props} />
                ) : (
                  <Search {...props} />
                )}
              </div>
            </Suspense>
          </fieldset>
        </div>
      </div>
      {reset ? (
        <Modal title={ui('Restablecer esta demo')} onClose={() => setReset(false)}>
          <p>
            {ui('Se reemplazarán tus cambios de ')}
            {solution.name}{' '}
            {ui(' por la información de ejemplo original. Las otras demos se conservan. ')}
          </p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setReset(false)}>
              {ui('Conservar cambios ')}
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
              {ui('Restablecer ejemplos ')}
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
