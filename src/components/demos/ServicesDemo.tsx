import { useState } from 'react';
import { localDate, normalize } from '../../lib/demo-domain.mjs';
import { jobStages } from '../../lib/business-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, values, type DemoProps } from './Shared';
import { DeleteRecord, folio, RecordEditor, type RecordData } from './BusinessShared';
export default function ServicesDemo({ data, send, busy }: DemoProps) {
  const [query, setQuery] = useState(''),
    [status, setStatus] = useState('Todas');
  const [editor, setEditor] = useState<RecordData | null>(null),
    [detailId, setDetailId] = useState<string | null>(null),
    [deleting, setDeleting] = useState<RecordData | null>(null);
  const jobs = data.jobs as RecordData[];
  const filtered = jobs.filter(
    (j) =>
      (status === 'Todas' || status === j.status) &&
      normalize(`${j.customer} ${j.equipment} ${j.assignee} ${folio('OS', j.number)}`).includes(
        normalize(query),
      ),
  );
  const detail = jobs.find((j) => j.id === detailId);
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">TALLER Y SERVICIO TÉCNICO · EJEMPLO</span>
          <h2>
            Del reporte
            <br />a la entrega.
          </h2>
          <p>Controla equipos, responsables y cada avance del servicio.</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ date: localDate(), priority: 'Normal' })}
        >
          + Nueva orden
        </button>
      </div>
      <Stats
        items={[
          { label: 'Órdenes activas', value: jobs.filter((j) => j.status !== 'Entregada').length },
          {
            label: 'Prioridad alta o urgente',
            value: jobs.filter((j) => j.priority !== 'Normal' && j.status !== 'Entregada').length,
          },
          { label: 'Listas para entregar', value: jobs.filter((j) => j.status === 'Lista').length },
          { label: 'Entregadas', value: jobs.filter((j) => j.status === 'Entregada').length },
        ]}
      />
      <div className="service-flow" aria-label="Etapas del servicio">
        {jobStages.map((s, i) => (
          <button
            key={s}
            aria-pressed={status === s}
            onClick={() => setStatus(status === s ? 'Todas' : s)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <strong>{s}</strong>
            <small>
              {jobs.filter((j) => j.status === s).length}{' '}
              {jobs.filter((j) => j.status === s).length === 1 ? 'orden' : 'órdenes'}
            </small>
          </button>
        ))}
      </div>
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Buscar órdenes"
            placeholder="Equipo, cliente, responsable o folio…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          Estado
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Todas</option>
            {jobStages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <ExportButton
          name="altum-ordenes-ejemplo"
          rows={filtered.map((j) => ({
            Folio: folio('OS', j.number),
            Cliente: j.customer,
            Equipo: j.equipment,
            Responsable: j.assignee,
            Fecha: j.date,
            Prioridad: j.priority,
            Estado: j.status,
          }))}
        />
      </div>
      <div className="service-grid-cards">
        {filtered.map((j) => (
          <article className="service-job" key={j.id}>
            <div className="card-top">
              <small>{folio('OS', j.number)}</small>
              <span className={`tag ${j.priority !== 'Normal' ? 'priority-high' : ''}`}>
                {j.priority}
              </span>
            </div>
            <h3>{j.equipment}</h3>
            <p>{j.customer}</p>
            <p className="job-issue">{j.issue}</p>
            <div className="job-meta">
              <span>
                Responsable <strong>{j.assignee}</strong>
              </span>
              <span>
                Programada <strong>{j.date}</strong>
              </span>
            </div>
            <div className="job-bottom">
              <span className="tag">{j.status}</span>
              <button
                className="inline-button"
                onClick={() => setDetailId(j.id)}
                aria-label={`Seguimiento de ${folio('OS', j.number)}`}
              >
                Ver seguimiento →
              </button>
            </div>
            <div className="inline-actions">
              <button onClick={() => setEditor(j)} aria-label={`Editar ${folio('OS', j.number)}`}>
                Editar
              </button>
              <button
                onClick={() => setDeleting(j)}
                aria-label={`Eliminar ${folio('OS', j.number)}`}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty>No hay órdenes con estos filtros. Registra un servicio de ejemplo.</Empty>
      )}
      {editor && (
        <RecordEditor
          title={editor.id ? 'Editar orden' : 'Nueva orden de servicio'}
          record={editor}
          entity="job"
          send={send}
          busy={busy}
          close={() => setEditor(null)}
          fields={[
            { name: 'customer', label: 'Cliente de ejemplo' },
            { name: 'equipment', label: 'Equipo o servicio' },
            { name: 'issue', label: 'Trabajo solicitado', type: 'textarea', full: true },
            { name: 'assignee', label: 'Responsable', maxLength: 80 },
            { name: 'date', label: 'Fecha programada', type: 'date' },
            { name: 'priority', label: 'Prioridad', options: ['Normal', 'Alta', 'Urgente'] },
            {
              name: 'notes',
              label: 'Notas internas',
              type: 'textarea',
              full: true,
              required: false,
            },
          ]}
        />
      )}
      {deleting && (
        <DeleteRecord
          name={folio('OS', deleting.number)}
          record={deleting}
          entity="job"
          send={send}
          busy={busy}
          close={() => setDeleting(null)}
        />
      )}
      {detail && (
        <Modal
          title={`Seguimiento · ${folio('OS', detail.number)}`}
          onClose={() => setDetailId(null)}
        >
          <h3>{detail.equipment}</h3>
          <p>
            {detail.customer} · {detail.assignee}
          </p>
          <p>{detail.issue}</p>
          {detail.notes && <p className="note">{detail.notes}</p>}
          <ol className="job-timeline">
            {detail.history.map((h: RecordData, i: number) => (
              <li key={i}>
                <span className="timeline-dot" />
                <div>
                  <strong>{h.status}</strong>
                  <small>{h.at}</small>
                  <p>{h.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <form
            key={detail.history.length}
            onSubmit={async (e) => {
              e.preventDefault();
              const record = values(e);
              await send({
                type: 'job.stage',
                id: detail.id,
                stage: record.stage,
                note: record.note,
              });
            }}
          >
            <div className="form-grid">
              <Field label="Nuevo estado">
                <select name="stage" defaultValue={detail.status}>
                  {jobStages.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Nota de avance (opcional)">
                <input name="note" maxLength={250} placeholder="Qué cambió en este paso" />
              </Field>
            </div>
            <div className="modal-actions">
              <button className="demo-button" disabled={busy}>
                Actualizar seguimiento
              </button>
            </div>
            <p className="form-note">
              El historial registra cambios de estado de ejemplo. No envía notificaciones a
              clientes.
            </p>
          </form>
        </Modal>
      )}
    </>
  );
}
