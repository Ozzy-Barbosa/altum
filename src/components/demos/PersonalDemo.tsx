import { ui } from '../../i18n/messages.mjs';
import { useState } from 'react';
import { localDate } from '../../lib/demo-domain.mjs';
import { formatMoney as money } from '../../i18n/messages.mjs';
import { goalSummary, personalSummary } from '../../lib/extended-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, values, type DemoProps } from './Shared';
import { RecordEditor, DeleteRecord, type RecordData } from './BusinessShared';
export default function PersonalDemo({ data, send, busy }: DemoProps) {
  const [budget, setBudget] = useState(false),
    [editor, setEditor] = useState<RecordData | null>(null),
    [remove, setRemove] = useState<RecordData | null>(null),
    [detail, setDetail] = useState<string | null>(null);
  const goals = data.goals as RecordData[],
    summary = personalSummary(data.budget),
    selected = goals.find((g) => g.id === detail);
  const committed =
    goals.reduce(
      (n, g) => n + (goalSummary(g).remaining > 0 ? Math.round(g.monthly * 100) : 0),
      0,
    ) / 100;
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">{ui('PLAN PERSONAL · EJEMPLO')}</span>
          <h2>
            {ui('Un propósito. ')}
            <br />
            {ui('Un paso cada mes. ')}
          </h2>
          <p>{ui('Separa tu presupuesto cotidiano de las metas que quieres construir.')}</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ monthly: 1000, date: localDate() })}
        >
          {ui('+ Crear meta ')}
        </button>
      </div>
      <Stats
        items={[
          { label: ui('Ingreso mensual planeado'), value: money(summary.income) },
          { label: ui('Gasto mensual planeado'), value: money(summary.expense) },
          { label: ui('Disponible antes de metas'), value: money(summary.available) },
        ]}
      />
      <section className="business-panel" style={{ marginTop: 24 }}>
        <p className="demo-eyebrow">{ui('TU PLAN MENSUAL')}</p>
        <h3>{ui('Primero, lo cotidiano.')}</h3>
        <div className="personal-budget">
          <p>
            {ui('Gastos fijos ')}
            <strong>{money(data.budget.fixed)}</strong>
          </p>
          <p>
            {ui('Gastos variables ')}
            <strong>{money(data.budget.variable)}</strong>
          </p>
          <p>
            {ui('Pagos de deuda ')}
            <strong>{money(data.budget.debt)}</strong>
          </p>
          <p>
            {ui('Aportaciones planeadas a metas activas ')}
            <strong>{money(committed)}</strong>
          </p>
          <p>
            {ui('Margen después de metas ')}
            <strong>{money(summary.available - committed)}</strong>
          </p>
        </div>
        <div className="actions">
          <button className="demo-button secondary" onClick={() => setBudget(true)}>
            {ui('Ajustar presupuesto ')}
          </button>
        </div>
        {committed > summary.available ? (
          <p className="demo-alert">
            {ui(
              'Las aportaciones planeadas superan tu disponible mensual. Ajusta el plan para que sea consistente. ',
            )}
          </p>
        ) : null}
        <p className="form-note">
          {ui(
            'Es una planificación, no un saldo bancario. Las aportaciones registradas no modifican automáticamente este presupuesto. No se calculan rendimientos. ',
          )}
        </p>
      </section>
      <div className="demo-toolbar" style={{ marginTop: 30 }}>
        <h3>{ui('Tus metas')}</h3>
        <ExportButton
          name="altum-metas"
          rows={goals.map((g) => ({
            Meta: g.name,
            Objetivo: g.target,
            Ahorrado: goalSummary(g).saved,
            Pendiente: goalSummary(g).remaining,
            AportacionMensual: g.monthly,
            FechaObjetivo: g.date,
          }))}
        />
      </div>
      {!goals.length ? (
        <Empty>{ui('Crea una meta para comenzar tu plan.')}</Empty>
      ) : (
        <div className="savings-goals">
          {goals.map((g) => {
            const s = goalSummary(g);
            return (
              <article className="goal-card" key={g.id}>
                <p className="demo-eyebrow">
                  {s.percent === 100 ? ui('META COMPLETADA') : ui('UN PASO A LA VEZ')}
                </p>
                <h3>{g.name}</h3>
                <p>
                  {money(s.saved)} {ui(' de ')}
                  {money(g.target)}
                </p>
                <div
                  className="bar-track"
                  role="progressbar"
                  aria-label={ui('Avance de {value0}', undefined, { value0: g.name })}
                  aria-valuenow={s.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span className="income" style={{ width: s.percent + '%' }} />
                </div>
                <p>
                  {s.percent}
                  {ui('% · Fecha objetivo: ')}
                  {g.date}
                </p>
                <p className="form-note">
                  {s.remaining === 0
                    ? ui('Objetivo cubierto.')
                    : g.monthly > 0
                      ? ui(
                          'A {value0} al mes: aproximadamente {value1} meses más, sin rendimientos.',
                          undefined,
                          { value0: money(g.monthly), value1: Math.ceil(s.remaining / g.monthly) },
                        )
                      : ui('Define una aportación mensual para estimar la duración.')}
                </p>
                <div className="actions">
                  <button className="demo-button secondary" onClick={() => setDetail(g.id)}>
                    {ui('Aportaciones ')}
                  </button>
                  <button
                    className="text-link"
                    aria-label={ui('Editar {value0}', undefined, { value0: g.name })}
                    onClick={() => setEditor(g)}
                  >
                    {ui('Editar ')}
                  </button>
                  <button
                    className="text-link"
                    aria-label={ui('Eliminar {value0}', undefined, { value0: g.name })}
                    onClick={() => setRemove(g)}
                  >
                    {ui('Eliminar ')}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {budget ? (
        <RecordEditor
          title={ui('Presupuesto mensual')}
          entity="budget"
          record={data.budget}
          fields={[
            { name: 'income', label: ui('Ingreso mensual'), type: 'number' },
            { name: 'fixed', label: ui('Gastos fijos'), type: 'number' },
            { name: 'variable', label: ui('Gastos variables'), type: 'number' },
            { name: 'debt', label: ui('Pagos de deuda'), type: 'number' },
          ]}
          send={send}
          busy={busy}
          close={() => setBudget(false)}
        />
      ) : null}
      {editor ? (
        <RecordEditor
          title={editor.id ? ui('Editar meta') : ui('Nueva meta')}
          entity="goal"
          record={editor}
          fields={[
            { name: 'name', label: ui('Nombre de la meta'), full: true },
            { name: 'target', label: ui('Importe objetivo'), type: 'number' },
            { name: 'monthly', label: ui('Aportación mensual planeada'), type: 'number' },
            { name: 'date', label: ui('Fecha objetivo'), type: 'date' },
          ]}
          send={send}
          busy={busy}
          close={() => setEditor(null)}
        />
      ) : null}
      {remove ? (
        <DeleteRecord
          name={remove.name}
          entity="goal"
          record={remove}
          send={send}
          busy={busy}
          close={() => setRemove(null)}
        />
      ) : null}
      {selected ? (
        <Modal
          title={ui('Aportaciones: {value0}', undefined, { value0: selected.name })}
          onClose={() => setDetail(null)}
        >
          <p>
            {ui('Ahorrado: ')}
            {money(goalSummary(selected).saved)} {ui(' · Pendiente:')}{' '}
            {money(goalSummary(selected).remaining)}
          </p>
          <ol className="service-timeline">
            {selected.contributions.map((c: RecordData) => (
              <li key={c.id}>
                <strong>
                  {money(c.amount)} · {c.date}
                </strong>
                <p>{c.note}</p>
              </li>
            ))}
          </ol>
          {goalSummary(selected).remaining > 0 ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                if (await send({ type: 'contribution.save', id: selected.id, record: values(e) }))
                  form.reset();
              }}
            >
              <div className="form-grid">
                <Field label={ui('Importe de la aportación')}>
                  <input
                    required
                    name="amount"
                    type="number"
                    min=".01"
                    step=".01"
                    max={goalSummary(selected).remaining}
                  />
                </Field>
                <Field label={ui('Fecha de la aportación')}>
                  <input required name="date" type="date" defaultValue={localDate()} />
                </Field>
                <Field label={ui('Nota de la aportación')} full>
                  <input name="note" maxLength={250} placeholder={ui('Información de ejemplo')} />
                </Field>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="demo-button secondary"
                  onClick={() => setDetail(null)}
                >
                  {ui('Cerrar ')}
                </button>
                <button className="demo-button" disabled={busy}>
                  {ui('Registrar aportación ')}
                </button>
              </div>
            </form>
          ) : (
            <p className="demo-notice">{ui('La meta está completa.')}</p>
          )}
        </Modal>
      ) : null}
    </>
  );
}
