import { useState } from 'react';
import { normalize } from '../../lib/demo-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, values, type DemoProps } from './Shared';
const states = ['Pendiente', 'En proceso', 'Terminado'];
export default function ProjectsDemo({ data, send, busy }: DemoProps) {
  const [query, setQuery] = useState('');
  const [project, setProject] = useState('Todos');
  const [editor, setEditor] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const tasks = data.tasks as any[];
  const filtered = tasks.filter(
    (t) =>
      (project === 'Todos' || t.project === project) &&
      normalize(t.title + ' ' + t.assignee).includes(normalize(query)),
  );
  const finished = filtered.filter((t) => t.status === 'Terminado').length;
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">EQUIPO DE EJEMPLO</span>
          <h2>
            Del pendiente
            <br />
            al hecho.
          </h2>
          <p>Coordina entregables y mantén claro el siguiente paso.</p>
        </div>
        <button className="demo-button" onClick={() => setEditor({})}>
          + Nueva tarea
        </button>
      </div>
      <Stats
        items={[
          { label: 'Tareas en esta vista', value: filtered.length },
          { label: 'Terminadas', value: finished },
          {
            label: 'Avance',
            value: (filtered.length ? Math.round((finished / filtered.length) * 100) : 0) + '%',
          },
        ]}
      />
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Buscar tareas"
            placeholder="Buscar tarea o responsable..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          Proyecto
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option>Todos</option>
            {[...new Set(tasks.map((t) => t.project))].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <ExportButton
          name="altum-tareas-ejemplo"
          rows={filtered.map((t) => ({
            Tarea: t.title,
            Proyecto: t.project,
            Responsable: t.assignee,
            Fecha: t.due,
            Estado: t.status,
          }))}
        />
      </div>
      <div className="kanban">
        {states.map((status, index) => (
          <section className={`kanban-column column-${index}`} key={status}>
            <h3>
              <span></span>
              {status}
              <small>{filtered.filter((t) => t.status === status).length}</small>
            </h3>
            {filtered
              .filter((t) => t.status === status)
              .map((t) => (
                <article className="task-card" key={t.id}>
                  <span className="task-project">{t.project}</span>
                  <h4>{t.title}</h4>
                  <div className="task-person">
                    <span className="avatar">{t.assignee.slice(0, 1)}</span>
                    {t.assignee}
                  </div>
                  <small className="task-date">{t.due || 'Sin fecha definida'}</small>
                  <label className="task-status">
                    Mover a
                    <select
                      aria-label={`Estado de ${t.title}`}
                      value={t.status}
                      disabled={busy}
                      onChange={(e) =>
                        send({ type: 'task.move', id: t.id, status: e.target.value })
                      }
                    >
                      {states.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <div className="inline-actions">
                    <button aria-label={`Editar ${t.title}`} onClick={() => setEditor(t)}>
                      Editar
                    </button>
                    <button aria-label={`Eliminar ${t.title}`} onClick={() => setDeleting(t)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            {!filtered.some((t) => t.status === status) ? (
              <Empty>Sin tareas en esta etapa.</Empty>
            ) : null}
          </section>
        ))}
      </div>
      {editor ? (
        <Modal title={editor.id ? 'Editar tarea' : 'Nueva tarea'} onClose={() => setEditor(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await send({ type: 'task.save', id: editor.id, task: values(e) }))
                setEditor(null);
            }}
          >
            <div className="form-grid">
              <Field label="Tarea *" full>
                <input name="title" defaultValue={editor.title || ''} required maxLength={120} />
              </Field>
              <Field label="Proyecto *">
                <input name="project" defaultValue={editor.project || ''} required maxLength={80} />
              </Field>
              <Field label="Responsable de ejemplo *">
                <input
                  name="assignee"
                  defaultValue={editor.assignee || ''}
                  required
                  maxLength={80}
                />
              </Field>
              <Field label="Fecha límite">
                <input name="due" type="date" defaultValue={editor.due || ''} />
              </Field>
              <Field label="Estado">
                <select name="status" defaultValue={editor.status || 'Pendiente'}>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <button className="demo-button full-width" disabled={busy} type="submit">
              Guardar tarea
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? (
        <Modal title="Eliminar tarea de ejemplo" onClose={() => setDeleting(null)}>
          <p>Se eliminará «{deleting.title}» del tablero de tu demo.</p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setDeleting(null)}>
              Cancelar
            </button>
            <button
              className="demo-button danger"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'task.delete', id: deleting.id })) setDeleting(null);
              }}
            >
              Eliminar tarea
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
