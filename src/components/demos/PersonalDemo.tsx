import { useState } from 'react';
import { localDate, money } from '../../lib/demo-domain.mjs';
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
          <span className="demo-eyebrow">PLAN PERSONAL · EJEMPLO</span>
          <h2>
            Un propósito.
            <br />
            Un paso cada mes.
          </h2>
          <p>Separa tu presupuesto cotidiano de las metas que quieres construir.</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ monthly: 1000, date: localDate() })}
        >
          + Crear meta
        </button>
      </div>
      <Stats
        items={[
          { label: 'Ingreso mensual planeado', value: money(summary.income) },
          { label: 'Gasto mensual planeado', value: money(summary.expense) },
          { label: 'Disponible antes de metas', value: money(summary.available) },
        ]}
      />
      <section className="business-panel" style={{ marginTop: 24 }}>
        <p className="demo-eyebrow">TU PLAN MENSUAL</p>
        <h3>Primero, lo cotidiano.</h3>
        <div className="personal-budget">
          <p>
            Gastos fijos <strong>{money(data.budget.fixed)}</strong>
          </p>
          <p>
            Gastos variables <strong>{money(data.budget.variable)}</strong>
          </p>
          <p>
            Pagos de deuda <strong>{money(data.budget.debt)}</strong>
          </p>
          <p>
            Aportaciones planeadas a metas activas <strong>{money(committed)}</strong>
          </p>
          <p>
            Margen después de metas <strong>{money(summary.available - committed)}</strong>
          </p>
        </div>
        <div className="actions">
          <button className="demo-button secondary" onClick={() => setBudget(true)}>
            Ajustar presupuesto
          </button>
        </div>
        {committed > summary.available ? (
          <p className="demo-alert">
            Las aportaciones planeadas superan tu disponible mensual. Ajusta el plan para que sea
            consistente.
          </p>
        ) : null}
        <p className="form-note">
          Es una planificación, no un saldo bancario. Las aportaciones registradas no modifican
          automáticamente este presupuesto. No se calculan rendimientos.
        </p>
      </section>
      <div className="demo-toolbar" style={{ marginTop: 30 }}>
        <h3>Tus metas</h3>
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
        <Empty>Crea una meta para comenzar tu plan.</Empty>
      ) : (
        <div className="savings-goals">
          {goals.map((g) => {
            const s = goalSummary(g);
            return (
              <article className="goal-card" key={g.id}>
                <p className="demo-eyebrow">
                  {s.percent === 100 ? 'META COMPLETADA' : 'UN PASO A LA VEZ'}
                </p>
                <h3>{g.name}</h3>
                <p>
                  {money(s.saved)} de {money(g.target)}
                </p>
                <div
                  className="bar-track"
                  role="progressbar"
                  aria-label={`Avance de ${g.name}`}
                  aria-valuenow={s.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span className="income" style={{ width: s.percent + '%' }} />
                </div>
                <p>
                  {s.percent}% · Fecha objetivo: {g.date}
                </p>
                <p className="form-note">
                  {s.remaining === 0
                    ? 'Objetivo cubierto.'
                    : g.monthly > 0
                      ? `A ${money(g.monthly)} al mes: aproximadamente ${Math.ceil(s.remaining / g.monthly)} meses más, sin rendimientos.`
                      : 'Define una aportación mensual para estimar la duración.'}
                </p>
                <div className="actions">
                  <button className="demo-button secondary" onClick={() => setDetail(g.id)}>
                    Aportaciones
                  </button>
                  <button
                    className="text-link"
                    aria-label={`Editar ${g.name}`}
                    onClick={() => setEditor(g)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-link"
                    aria-label={`Eliminar ${g.name}`}
                    onClick={() => setRemove(g)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {budget ? (
        <RecordEditor
          title="Presupuesto mensual"
          entity="budget"
          record={data.budget}
          fields={[
            { name: 'income', label: 'Ingreso mensual', type: 'number' },
            { name: 'fixed', label: 'Gastos fijos', type: 'number' },
            { name: 'variable', label: 'Gastos variables', type: 'number' },
            { name: 'debt', label: 'Pagos de deuda', type: 'number' },
          ]}
          send={send}
          busy={busy}
          close={() => setBudget(false)}
        />
      ) : null}
      {editor ? (
        <RecordEditor
          title={editor.id ? 'Editar meta' : 'Nueva meta'}
          entity="goal"
          record={editor}
          fields={[
            { name: 'name', label: 'Nombre de la meta', full: true },
            { name: 'target', label: 'Importe objetivo', type: 'number' },
            { name: 'monthly', label: 'Aportación mensual planeada', type: 'number' },
            { name: 'date', label: 'Fecha objetivo', type: 'date' },
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
        <Modal title={`Aportaciones: ${selected.name}`} onClose={() => setDetail(null)}>
          <p>
            Ahorrado: {money(goalSummary(selected).saved)} · Pendiente:{' '}
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
                <Field label="Importe de la aportación">
                  <input
                    required
                    name="amount"
                    type="number"
                    min=".01"
                    step=".01"
                    max={goalSummary(selected).remaining}
                  />
                </Field>
                <Field label="Fecha de la aportación">
                  <input required name="date" type="date" defaultValue={localDate()} />
                </Field>
                <Field label="Nota de la aportación" full>
                  <input name="note" maxLength={250} placeholder="Información de ejemplo" />
                </Field>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="demo-button secondary"
                  onClick={() => setDetail(null)}
                >
                  Cerrar
                </button>
                <button className="demo-button" disabled={busy}>
                  Registrar aportación
                </button>
              </div>
            </form>
          ) : (
            <p className="demo-notice">La meta está completa.</p>
          )}
        </Modal>
      ) : null}
    </>
  );
}
