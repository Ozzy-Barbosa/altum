import { ui } from '../../i18n/messages.mjs';
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
          <span className="demo-eyebrow">{ui('TALLER Y SERVICIO TÉCNICO · EJEMPLO')}</span>
          <h2>
            {ui('Del reporte ')}
            <br />
            {ui('a la entrega. ')}
          </h2>
          <p>{ui('Controla equipos, responsables y cada avance del servicio.')}</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ date: localDate(), priority: 'Normal' })}
        >
          {ui('+ Nueva orden ')}
        </button>
      </div>
      <Stats
        items={[
          {
            label: ui('Órdenes activas'),
            value: jobs.filter((j) => j.status !== 'Entregada').length,
          },
          {
            label: ui('Prioridad alta o urgente'),
            value: jobs.filter((j) => j.priority !== 'Normal' && j.status !== 'Entregada').length,
          },
          {
            label: ui('Listas para entregar'),
            value: jobs.filter((j) => j.status === 'Lista').length,
          },
          { label: ui('Entregadas'), value: jobs.filter((j) => j.status === 'Entregada').length },
        ]}
      />
      <div className="service-flow" aria-label={ui('Etapas del servicio')}>
        {jobStages.map((s, i) => (
          <button
            key={s}
            aria-pressed={status === s}
            onClick={() => setStatus(status === s ? 'Todas' : s)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <strong>{ui(s)}</strong>
            <small>
              {jobs.filter((j) => j.status === s).length}{' '}
              {jobs.filter((j) => j.status === s).length === 1 ? ui('orden') : ui('órdenes')}
            </small>
          </button>
        ))}
      </div>
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label={ui('Buscar órdenes')}
            placeholder={ui('Equipo, cliente, responsable o folio…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          {ui('Estado ')}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value={'Todas'}>{ui('Todas')}</option>
            {jobStages.map((s) => (
              <option key={s} value={s}>
                {ui(s)}
              </option>
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
                {ui(j.priority)}
              </span>
            </div>
            <h3>{j.equipment}</h3>
            <p>{j.customer}</p>
            <p className="job-issue">{j.issue}</p>
            <div className="job-meta">
              <span>
                {ui('Responsable ')}
                <strong>{j.assignee}</strong>
              </span>
              <span>
                {ui('Programada ')}
                <strong>{j.date}</strong>
              </span>
            </div>
            <div className="job-bottom">
              <span className="tag">{ui(j.status)}</span>
              <button
                className="inline-button"
                onClick={() => setDetailId(j.id)}
                aria-label={ui('Seguimiento de {value0}', undefined, {
                  value0: folio('OS', j.number),
                })}
              >
                {ui('Ver seguimiento → ')}
              </button>
            </div>
            <div className="inline-actions">
              <button
                onClick={() => setEditor(j)}
                aria-label={ui('Editar {value0}', undefined, { value0: folio('OS', j.number) })}
              >
                {ui('Editar ')}
              </button>
              <button
                onClick={() => setDeleting(j)}
                aria-label={ui('Eliminar {value0}', undefined, { value0: folio('OS', j.number) })}
              >
                {ui('Eliminar ')}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty>{ui('No hay órdenes con estos filtros. Registra un servicio de ejemplo.')}</Empty>
      )}
      {editor && (
        <RecordEditor
          title={editor.id ? ui('Editar orden') : ui('Nueva orden de servicio')}
          record={editor}
          entity="job"
          send={send}
          busy={busy}
          close={() => setEditor(null)}
          fields={[
            { name: 'customer', label: ui('Cliente de ejemplo') },
            { name: 'equipment', label: ui('Equipo o servicio') },
            { name: 'issue', label: ui('Trabajo solicitado'), type: 'textarea', full: true },
            { name: 'assignee', label: ui('Responsable'), maxLength: 80 },
            { name: 'date', label: ui('Fecha programada'), type: 'date' },
            { name: 'priority', label: ui('Prioridad'), options: ['Normal', 'Alta', 'Urgente'] },
            {
              name: 'notes',
              label: ui('Notas internas'),
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
          title={ui('Seguimiento · {value0}', undefined, { value0: folio('OS', detail.number) })}
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
                  <strong>{ui(h.status)}</strong>
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
              <Field label={ui('Nuevo estado')}>
                <select name="stage" defaultValue={detail.status}>
                  {jobStages.map((s) => (
                    <option key={s} value={s}>
                      {ui(s)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={ui('Nota de avance (opcional)')}>
                <input name="note" maxLength={250} placeholder={ui('Qué cambió en este paso')} />
              </Field>
            </div>
            <div className="modal-actions">
              <button className="demo-button" disabled={busy}>
                {ui('Actualizar seguimiento ')}
              </button>
            </div>
            <p className="form-note">
              {ui(
                'El historial registra cambios de estado de ejemplo. No envía notificaciones a clientes. ',
              )}
            </p>
          </form>
        </Modal>
      )}
    </>
  );
}
