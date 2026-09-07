import { useState } from 'react';
import { localDate, money, normalize } from '../../lib/demo-domain.mjs';
import { cents, expenseCategories, financeSummary } from '../../lib/business-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, values, type DemoProps } from './Shared';
import { DeleteRecord, RecordEditor, type RecordData } from './BusinessShared';
export default function FinanceDemo({ data, send, busy }: DemoProps) {
  const [month, setMonth] = useState(localDate().slice(0, 7)),
    [query, setQuery] = useState('');
  const [editor, setEditor] = useState<RecordData | null>(null),
    [deleting, setDeleting] = useState<RecordData | null>(null),
    [budget, setBudget] = useState<string | null>(null);
  const transactions = data.transactions as RecordData[];
  const summary = financeSummary(transactions, month);
  const rows = transactions
    .filter(
      (t) =>
        t.date.startsWith(month) && normalize(t.concept + t.category).includes(normalize(query)),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const max = Math.max(summary.income, summary.expense, 1);
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">FINANZAS DEL NEGOCIO · EJEMPLO</span>
          <h2>
            Claridad para
            <br />
            decidir mejor.
          </h2>
          <p>Ingresos, gastos y presupuesto en una misma vista.</p>
        </div>
        <button
          className="demo-button"
          onClick={() => setEditor({ kind: 'Ingreso', category: 'Servicios', date: localDate() })}
        >
          + Registrar movimiento
        </button>
      </div>
      <div className="demo-toolbar">
        <label className="compact-field">
          Mes del reporte
          <input
            type="month"
            value={month}
            onChange={(e) => {
              if (e.target.value) setMonth(e.target.value);
            }}
          />
        </label>
        <span className="form-note">Importes en MXN · Ejemplos, sin conexión bancaria</span>
      </div>
      <Stats
        items={[
          { label: 'Ingresos del mes', value: money(summary.income) },
          { label: 'Gastos del mes', value: money(summary.expense) },
          {
            label: 'Flujo neto del mes',
            value: money(summary.net),
            detail: 'Ingresos menos gastos. No es saldo bancario.',
          },
        ]}
      />
      <div className="business-grid">
        <section className="business-panel">
          <p className="demo-eyebrow">ENTRADAS Y SALIDAS</p>
          <h3>El pulso de tu mes.</h3>
          <div className="finance-bars">
            {[
              ['Ingresos', summary.income, 'income'],
              ['Gastos', summary.expense, 'expense'],
            ].map(([label, amount, className]) => (
              <div key={String(label)}>
                <div className="bar-label">
                  <span>{label}</span>
                  <strong>{money(Number(amount))}</strong>
                </div>
                <div className="bar-track">
                  <span
                    className={String(className)}
                    style={{ width: `${(Number(amount) / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="form-note">
            El reporte reúne todos los movimientos del mes elegido. La búsqueda de abajo filtra
            únicamente la lista.
          </p>
        </section>
        <section className="business-panel">
          <p className="demo-eyebrow">PLANIFICA EL GASTO</p>
          <h3>Presupuesto por categoría.</h3>
          <div className="budget-list">
            {expenseCategories.map((category) => {
              const spent =
                transactions
                  .filter(
                    (t) =>
                      t.kind === 'Gasto' && t.date.startsWith(month) && t.category === category,
                  )
                  .reduce((sum, t) => sum + cents(t.amount), 0) / 100;
              const cap = data.budgets[category] as number;
              return (
                <div className="budget-row" key={category}>
                  <div>
                    <strong>{category}</strong>
                    <small className={spent > cap ? 'over-budget' : ''}>
                      {money(spent)} / {money(cap)}
                      {spent > cap ? ' · Excedido' : ''}
                    </small>
                  </div>
                  <button
                    className="inline-button"
                    aria-label={`Editar presupuesto de ${category}`}
                    onClick={() => setBudget(category)}
                  >
                    Ajustar
                  </button>
                  <div className="bar-track">
                    <span
                      className={spent > cap ? 'expense' : 'income'}
                      style={{
                        width: `${cap ? Math.min((spent / cap) * 100, 100) : spent ? 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="form-note">
            Estos límites mensuales de referencia se aplican a todos los meses.
          </p>
        </section>
      </div>
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Buscar movimientos"
            placeholder="Buscar concepto o categoría…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <ExportButton
          name={`altum-finanzas-${month}`}
          rows={rows.map((t) => ({
            Fecha: t.date,
            Concepto: t.concept,
            Tipo: t.kind,
            Categoría: t.category,
            Importe_MXN: t.amount,
          }))}
        />
      </div>
      {rows.length ? (
        <div className="table-scroll">
          <table className="data-table">
            <caption>Movimientos de {month}</caption>
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Importe</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.concept}</strong>
                    <small>{t.kind}</small>
                  </td>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td className={t.kind === 'Ingreso' ? 'income-text' : 'expense-text'}>
                    {t.kind === 'Ingreso' ? '+' : '−'}
                    {money(t.amount)}
                  </td>
                  <td>
                    <div className="inline-actions">
                      <button onClick={() => setEditor(t)} aria-label={`Editar ${t.concept}`}>
                        Editar
                      </button>
                      <button onClick={() => setDeleting(t)} aria-label={`Eliminar ${t.concept}`}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>
          No hay movimientos para este mes y búsqueda. Registra el primero o cambia el filtro.
        </Empty>
      )}
      {editor && (
        <RecordEditor
          title={editor.id ? 'Editar movimiento' : 'Registrar movimiento'}
          record={editor}
          entity="transaction"
          send={send}
          busy={busy}
          close={() => setEditor(null)}
          fields={[
            { name: 'concept', label: 'Concepto', full: true },
            { name: 'kind', label: 'Tipo', options: ['Ingreso', 'Gasto'] },
            { name: 'category', label: 'Categoría', options: expenseCategories },
            { name: 'amount', label: 'Importe (MXN)', type: 'number' },
            { name: 'date', label: 'Fecha', type: 'date' },
          ]}
        />
      )}
      {deleting && (
        <DeleteRecord
          name={deleting.concept}
          record={deleting}
          entity="transaction"
          send={send}
          busy={busy}
          close={() => setDeleting(null)}
        />
      )}
      {budget && (
        <Modal title={`Presupuesto · ${budget}`} onClose={() => setBudget(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await send({ type: 'budget.save', category: budget, ...values(e) }))
                setBudget(null);
            }}
          >
            <Field label="Límite mensual (MXN)">
              <input
                type="number"
                name="amount"
                required
                min="0"
                max="10000000"
                step=".01"
                defaultValue={data.budgets[budget]}
              />
            </Field>
            <div className="modal-actions">
              <button className="demo-button" disabled={busy}>
                Guardar presupuesto
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
