import { ui } from '../../i18n/messages.mjs';
import { useState } from 'react';
import { localDate, normalize } from '../../lib/demo-domain.mjs';
import { formatMoney as money } from '../../i18n/messages.mjs';
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
          <span className="demo-eyebrow">{ui('RELACIONES QUE SE CONSTRUYEN · CRM')}</span>
          <h2>
            {ui('Cada conversación, ')}
            <br />
            {ui('un siguiente paso. ')}
          </h2>
          <p>{ui('Organiza contactos, oportunidades y próximos seguimientos.')}</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ stage: 'Nuevo', value: 0, followup: localDate() })}
        >
          {ui('+ Nueva oportunidad ')}
        </button>
      </div>
      <Stats
        items={[
          {
            label: ui('Oportunidades abiertas'),
            value: open.length,
            detail: ui('Resumen de toda la cartera de ejemplo'),
          },
          {
            label: ui('Valor potencial abierto'),
            value: money(open.reduce((sum, l) => sum + cents(l.value), 0) / 100),
            detail: ui('Estimación; no equivale a ventas cobradas'),
          },
          { label: ui('Oportunidades ganadas'), value: won.length },
          {
            label: ui('Seguimientos por atender'),
            value: open.filter((l) => l.followup && l.followup <= localDate()).length,
          },
        ]}
      />
      <div className="pipeline-summary" aria-label={ui('Distribución por etapa')}>
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
            <span>{ui(s)}</span>
            <strong>{leads.filter((l) => l.stage === s).length}</strong>
            <span className="pipeline-line" />
          </button>
        ))}
      </div>
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label={ui('Buscar oportunidades')}
            placeholder={ui('Negocio, contacto o interés…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          {ui('Etapa ')}
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value={'Todas'}>{ui('Todas')}</option>
            {leadStages.map((s) => (
              <option key={s} value={s}>
                {ui(s)}
              </option>
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
              <span className="tag">{ui(l.stage)}</span>
            </div>
            <h3>{l.company}</h3>
            <p>
              {l.contact} · {l.interest}
            </p>
            <strong className="deal-value">{money(l.value)}</strong>
            <p className="lead-notes">
              {l.notes || ui('Agrega notas para preparar la siguiente conversación.')}
            </p>
            <p
              className={
                l.followup && l.followup <= localDate() && !['Ganado', 'Perdido'].includes(l.stage)
                  ? 'followup-due'
                  : 'form-note'
              }
            >
              {l.followup
                ? ui('Seguimiento: {value0}', undefined, { value0: l.followup })
                : ui('Sin fecha de seguimiento')}
            </p>
            <label className="task-status">
              {ui('Etapa comercial ')}
              <select
                aria-label={ui('Etapa de {value0}', undefined, { value0: l.company })}
                value={l.stage}
                disabled={busy}
                onChange={(e) => send({ type: 'lead.stage', id: l.id, stage: e.target.value })}
              >
                {leadStages.map((s) => (
                  <option key={s} value={s}>
                    {ui(s)}
                  </option>
                ))}
              </select>
            </label>
            <div className="inline-actions">
              <button
                onClick={() => setEditor(l)}
                aria-label={ui('Editar {value0}', undefined, { value0: l.company })}
              >
                {ui('Editar ')}
              </button>
              <button
                onClick={() => setDeleting(l)}
                aria-label={ui('Eliminar {value0}', undefined, { value0: l.company })}
              >
                {ui('Eliminar ')}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && <Empty>{ui('No hay oportunidades con estos filtros.')}</Empty>}
      {editor && (
        <RecordEditor
          title={editor.id ? ui('Editar oportunidad') : ui('Nueva oportunidad')}
          record={editor}
          entity="lead"
          send={send}
          busy={busy}
          close={() => setEditor(null)}
          fields={[
            { name: 'company', label: ui('Negocio de ejemplo') },
            { name: 'contact', label: ui('Nombre de contacto'), maxLength: 80 },
            { name: 'interest', label: ui('Servicio de interés'), full: true },
            { name: 'value', label: ui('Valor estimado (MXN)'), type: 'number' },
            { name: 'stage', label: ui('Etapa'), options: leadStages },
            { name: 'followup', label: ui('Próximo seguimiento'), type: 'date', required: false },
            { name: 'notes', label: ui('Notas'), type: 'textarea', full: true, required: false },
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
