import { useState } from 'react';
import { localDate, money, normalize } from '../../lib/demo-domain.mjs';
import { cents, leadStages } from '../../lib/business-domain.mjs';
import { Empty, ExportButton, Stats, type DemoProps } from './Shared';
import { DeleteRecord, RecordEditor, type RecordData } from './BusinessShared';
export default function CrmDemo({ data, send, busy }: DemoProps) {
  const [query, setQuery] = useState(''),
    [stage, setStage] = useState('Todas');
  const [editor, setEditor] = useState<RecordData | null>(null),
    [deleting, setDeleting] = useState<RecordData | null>(null);
  const leads = data.leads as RecordData[];
  const filtered = leads.filter(
    (l) =>
      (stage === 'Todas' || l.stage === stage) &&
      normalize(`${l.company} ${l.contact} ${l.interest}`).includes(normalize(query)),
  );
  const open = leads.filter((l) => !['Ganado', 'Perdido'].includes(l.stage));
  const won = leads.filter((l) => l.stage === 'Ganado');
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">RELACIONES QUE SE CONSTRUYEN · CRM</span>
          <h2>
            Cada conversación,
            <br />
            un siguiente paso.
          </h2>
          <p>Organiza contactos, oportunidades y próximos seguimientos.</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ stage: 'Nuevo', value: 0, followup: localDate() })}
        >
          + Nueva oportunidad
        </button>
      </div>
      <Stats
        items={[
          {
            label: 'Oportunidades abiertas',
            value: open.length,
            detail: 'Resumen de toda la cartera de ejemplo',
          },
          {
            label: 'Valor potencial abierto',
            value: money(open.reduce((sum, l) => sum + cents(l.value), 0) / 100),
            detail: 'Estimación; no equivale a ventas cobradas',
          },
          { label: 'Oportunidades ganadas', value: won.length },
          {
            label: 'Seguimientos por atender',
            value: open.filter((l) => l.followup && l.followup <= localDate()).length,
          },
        ]}
      />
      <div className="pipeline-summary" aria-label="Distribución por etapa">
        {leadStages.map((s, i) => (
          <button
            key={s}
            aria-pressed={stage === s}
            onClick={() => setStage(stage === s ? 'Todas' : s)}
            style={
              {
                '--stage': ['#80c9ff', '#b6a4ff', '#f6b66b', '#65d9b5', '#f2b2cf'][i],
              } as React.CSSProperties
            }
          >
            <span>{s}</span>
            <strong>{leads.filter((l) => l.stage === s).length}</strong>
            <span className="pipeline-line" />
          </button>
        ))}
      </div>
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Buscar oportunidades"
            placeholder="Negocio, contacto o interés…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          Etapa
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            <option>Todas</option>
            {leadStages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <ExportButton
          name="altum-oportunidades-ejemplo"
          rows={filtered.map((l) => ({
            Negocio: l.company,
            Contacto: l.contact,
            Interés: l.interest,
            Etapa: l.stage,
            Valor_MXN: l.value,
            Seguimiento: l.followup,
          }))}
        />
      </div>
      <div className="lead-grid">
        {filtered.map((l) => (
          <article className="lead-card" key={l.id}>
            <div className="card-top">
              <span className="avatar">{l.company.slice(0, 1)}</span>
              <span className="tag">{l.stage}</span>
            </div>
            <h3>{l.company}</h3>
            <p>
              {l.contact} · {l.interest}
            </p>
            <strong className="deal-value">{money(l.value)}</strong>
            <p className="lead-notes">
              {l.notes || 'Agrega notas para preparar la siguiente conversación.'}
            </p>
            <p
              className={
                l.followup && l.followup <= localDate() && !['Ganado', 'Perdido'].includes(l.stage)
                  ? 'followup-due'
                  : 'form-note'
              }
            >
              {l.followup ? `Seguimiento: ${l.followup}` : 'Sin fecha de seguimiento'}
            </p>
            <label className="task-status">
              Etapa comercial
              <select
                aria-label={`Etapa de ${l.company}`}
                value={l.stage}
                disabled={busy}
                onChange={(e) => send({ type: 'lead.stage', id: l.id, stage: e.target.value })}
              >
                {leadStages.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <div className="inline-actions">
              <button onClick={() => setEditor(l)} aria-label={`Editar ${l.company}`}>
                Editar
              </button>
              <button onClick={() => setDeleting(l)} aria-label={`Eliminar ${l.company}`}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && <Empty>No hay oportunidades con estos filtros.</Empty>}
      {editor && (
        <RecordEditor
          title={editor.id ? 'Editar oportunidad' : 'Nueva oportunidad'}
          record={editor}
          entity="lead"
          send={send}
          busy={busy}
          close={() => setEditor(null)}
          fields={[
            { name: 'company', label: 'Negocio de ejemplo' },
            { name: 'contact', label: 'Nombre de contacto', maxLength: 80 },
            { name: 'interest', label: 'Servicio de interés', full: true },
            { name: 'value', label: 'Valor estimado (MXN)', type: 'number' },
            { name: 'stage', label: 'Etapa', options: leadStages },
            { name: 'followup', label: 'Próximo seguimiento', type: 'date', required: false },
            { name: 'notes', label: 'Notas', type: 'textarea', full: true, required: false },
          ]}
        />
      )}
      {deleting && (
        <DeleteRecord
          name={deleting.company}
          record={deleting}
          entity="lead"
          send={send}
          busy={busy}
          close={() => setDeleting(null)}
        />
      )}
    </>
  );
}
