import { ui } from '../../i18n/messages.mjs';
import { useState } from 'react';
import { localDate, normalize } from '../../lib/demo-domain.mjs';
import { formatMoney as money } from '../../i18n/messages.mjs';
import { quoteStages, quoteTotals } from '../../lib/business-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, values, type DemoProps } from './Shared';
import { DeleteRecord, folio, type RecordData } from './BusinessShared';
type Line = { key: string; description: string; quantity: string | number; price: string | number };
function QuoteEditor({
  record,
  send,
  busy,
  close,
}: DemoProps & { record: RecordData; close: () => void }) {
  const [lines, setLines] = useState<Line[]>(() =>
    (record.lines || [{ description: '', quantity: 1, price: 0 }]).map((l: Line) => ({
      ...l,
      key: crypto.randomUUID(),
    })),
  );
  const [discount, setDiscount] = useState(String(record.discount ?? 0));
  let total = null;
  try {
    total = quoteTotals(lines, Number(discount));
  } catch {
    /* Incomplete numeric inputs remain editable. */
  }
  const edit = (key: string, field: string, value: string) =>
    setLines((items) =>
      items.map((line) => (line.key === key ? { ...line, [field]: value } : line)),
    );
  return (
    <Modal title={record.id ? ui('Editar cotización') : ui('Nueva cotización')} onClose={close}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (
            await send({
              type: 'quote.save',
              id: record.id,
              record: { ...values(e), lines, discount },
            })
          )
            close();
        }}
      >
        <div className="form-grid">
          <Field label={ui('Cliente de ejemplo')}>
            <input name="customer" defaultValue={record.customer || ''} maxLength={120} required />
          </Field>
          <Field label={ui('Proyecto o servicio')}>
            <input name="title" defaultValue={record.title || ''} maxLength={120} required />
          </Field>
          <Field label={ui('Fecha de emisión')}>
            <input name="date" type="date" defaultValue={record.date || localDate()} required />
          </Field>
          <Field label={ui('Válida hasta (opcional)')}>
            <input name="validUntil" type="date" defaultValue={record.validUntil || ''} />
          </Field>
          <Field label={ui('Estado simulado')}>
            <select name="status" defaultValue={record.status || 'Borrador'}>
              {quoteStages.map((s) => (
                <option key={s} value={s}>
                  {ui(s)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={ui('Descuento (%)')}>
            <input
              type="number"
              min="0"
              max="100"
              step=".01"
              required
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Field>
        </div>
        <div className="quote-line-heading">
          <h3>{ui('Conceptos')}</h3>
          <button
            className="inline-button"
            type="button"
            disabled={lines.length >= 30}
            onClick={() =>
              setLines((items) => [
                ...items,
                { key: crypto.randomUUID(), description: '', quantity: 1, price: 0 },
              ])
            }
          >
            {ui('+ Agregar concepto ')}
          </button>
        </div>
        {lines.map((line, index) => (
          <div className="quote-line-editor" key={line.key}>
            <Field label={ui('Concepto {value0}', undefined, { value0: index + 1 })}>
              <input
                value={line.description}
                maxLength={180}
                required
                onChange={(e) => edit(line.key, 'description', e.target.value)}
              />
            </Field>
            <Field label={ui('Cantidad {value0}', undefined, { value0: index + 1 })}>
              <input
                type="number"
                min="1"
                max="10000"
                step="1"
                required
                value={line.quantity}
                onChange={(e) => edit(line.key, 'quantity', e.target.value)}
              />
            </Field>
            <Field label={ui('Precio {value0} (MXN)', undefined, { value0: index + 1 })}>
              <input
                type="number"
                min="0"
                max="10000000"
                step=".01"
                required
                value={line.price}
                onChange={(e) => edit(line.key, 'price', e.target.value)}
              />
            </Field>
            <button
              type="button"
              className="icon-button"
              aria-label={ui('Quitar concepto {value0}', undefined, { value0: index + 1 })}
              disabled={lines.length === 1}
              onClick={() => setLines((items) => items.filter((l) => l.key !== line.key))}
            >
              ×
            </button>
          </div>
        ))}
        <Field label={ui('Condiciones y notas (opcional)')} full>
          <textarea name="notes" rows={3} maxLength={500} defaultValue={record.notes || ''} />
        </Field>
        <p className="quote-running-total" aria-live="polite">
          {ui('Total: ')}
          <strong>{total ? money(total.total) : ui('Revisa los importes')}</strong>
        </p>
        <p className="form-note">
          {ui(
            'No se calculan impuestos. Es un presupuesto de ejemplo, no una factura. Cambiar el estado no envía mensajes. ',
          )}
        </p>
        <div className="modal-actions">
          <button className="demo-button secondary" type="button" onClick={close}>
            {ui('Cancelar ')}
          </button>
          <button className="demo-button" disabled={busy || !total}>
            {ui('Guardar cotización ')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export default function QuotesDemo(props: DemoProps) {
  const { data, send, busy } = props;
  const [query, setQuery] = useState(''),
    [status, setStatus] = useState('Todas');
  const [exporting, setExporting] = useState(false),
    [pdfNotice, setPdfNotice] = useState('');
  const [editor, setEditor] = useState<RecordData | null>(null),
    [previewId, setPreviewId] = useState<string | null>(null),
    [deleting, setDeleting] = useState<RecordData | null>(null);
  const quotes = data.quotes as RecordData[];
  const filtered = quotes.filter(
    (q) =>
      (status === 'Todas' || q.status === status) &&
      normalize(`${q.customer} ${q.title} ${folio('COT', q.number)}`).includes(normalize(query)),
  );
  const preview = quotes.find((q) => q.id === previewId);
  const totals = preview ? quoteTotals(preview.lines, preview.discount) : null;
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">{ui('PROPUESTAS QUE SE ENTIENDEN')}</span>
          <h2>
            {ui('De una solicitud ')}
            <br />
            {ui('a una propuesta clara. ')}
          </h2>
          <p>{ui('Prepara conceptos, revisa importes y presenta tu cotización.')}</p>
        </div>
        <button className="demo-button" onClick={() => setEditor({})}>
          {ui('+ Nueva cotización ')}
        </button>
      </div>
      <Stats
        items={[
          { label: ui('Cotizaciones guardadas'), value: quotes.length },
          {
            label: ui('Pendientes de respuesta'),
            value: quotes.filter((q) => q.status === 'Enviada').length,
          },
          {
            label: ui('Aceptadas'),
            value: quotes.filter((q) => q.status === 'Aceptada').length,
            detail: ui('Estados de ejemplo; no son pagos'),
          },
        ]}
      />
      <div className="demo-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label={ui('Buscar cotizaciones')}
            placeholder={ui('Cliente, proyecto o folio…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          {ui('Estado ')}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value={'Todas'}>{ui('Todas')}</option>
            {quoteStages.map((s) => (
              <option key={s} value={s}>
                {ui(s)}
              </option>
            ))}
          </select>
        </label>
        <ExportButton
          name="altum-cotizaciones-ejemplo"
          rows={filtered.map((q) => ({
            Folio: folio('COT', q.number),
            Cliente: q.customer,
            Proyecto: q.title,
            Estado: q.status,
            Fecha: q.date,
            Total_MXN: quoteTotals(q.lines, q.discount).total,
          }))}
        />
      </div>
      <div className="quote-list">
        {filtered.map((q) => (
          <article key={q.id}>
            <div className="quote-list-mark" aria-hidden="true">
              ▤
            </div>
            <div className="quote-list-main">
              <small>
                {folio('COT', q.number)} · {q.date}
              </small>
              <h3>{q.title}</h3>
              <p>{q.customer}</p>
              <span className="tag">{ui(q.status)}</span>
            </div>
            <div className="quote-list-actions">
              <strong>{money(quoteTotals(q.lines, q.discount).total)}</strong>
              <div className="inline-actions">
                <button
                  aria-label={ui('Ver {value0}', undefined, { value0: folio('COT', q.number) })}
                  onClick={() => setPreviewId(q.id)}
                >
                  {ui('Ver documento ')}
                </button>
                <button
                  aria-label={ui('Editar {value0}', undefined, { value0: folio('COT', q.number) })}
                  onClick={() => setEditor(q)}
                >
                  {ui('Editar ')}
                </button>
                <button
                  aria-label={ui('Eliminar {value0}', undefined, {
                    value0: folio('COT', q.number),
                  })}
                  onClick={() => setDeleting(q)}
                >
                  {ui('Eliminar ')}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty>{ui('No hay cotizaciones con estos filtros. Crea una propuesta de ejemplo.')}</Empty>
      )}
      {editor && <QuoteEditor {...props} record={editor} close={() => setEditor(null)} />}
      {deleting && (
        <DeleteRecord
          name={folio('COT', deleting.number)}
          record={deleting}
          entity="quote"
          send={send}
          busy={busy}
          close={() => setDeleting(null)}
        />
      )}
      {preview && totals && (
        <Modal title={ui('Vista de cotización')} onClose={() => setPreviewId(null)}>
          <div className="quote-paper" id="quote-print">
            <div className="quote-paper-head">
              <strong>
                {ui('ALTUM')}
                <span>{ui('COTIZADOR DE DEMOSTRACIÓN')}</span>
              </strong>
              <span>{folio('COT', preview.number)}</span>
            </div>
            <p>{ui('DOCUMENTO DE EJEMPLO · NO VÁLIDO COMO FACTURA')}</p>
            <h3>{preview.title}</h3>
            <div className="quote-details">
              <div>
                <small>{ui('Preparada para')}</small>
                <strong>{preview.customer}</strong>
              </div>
              <div>
                <small>{ui('Emisión')}</small>
                <strong>{preview.date}</strong>
              </div>
              <div>
                <small>{ui('Vigencia')}</small>
                <strong>{preview.validUntil || ui('Sin definir')}</strong>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{ui('Concepto')}</th>
                  <th>{ui('Cant.')}</th>
                  <th>{ui('Precio')}</th>
                  <th>{ui('Importe')}</th>
                </tr>
              </thead>
              <tbody>
                {preview.lines.map((l: RecordData, i: number) => (
                  <tr key={i}>
                    <td>{l.description}</td>
                    <td>{l.quantity}</td>
                    <td>{money(l.price)}</td>
                    <td>{money(quoteTotals([l], 0).total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="quote-totals">
              <div>
                <dt>{ui('Subtotal')}</dt>
                <dd>{money(totals.subtotal)}</dd>
              </div>
              <div>
                <dt>
                  {ui('Descuento (')}
                  {preview.discount} %)
                </dt>
                <dd>−{money(totals.discount)}</dd>
              </div>
              <div>
                <dt>{ui('Total sin impuestos')}</dt>
                <dd>{money(totals.total)}</dd>
              </div>
            </dl>
            <p className="quote-conditions">
              {preview.notes || ui('Sin condiciones adicionales de ejemplo.')}
            </p>
            <p>{ui('Creada con Altum · www.altumlapaz.com · Importes en MXN')}</p>
          </div>
          <label className="task-status">
            {ui('Estado simulado ')}
            <select
              value={preview.status}
              disabled={busy}
              onChange={(e) => send({ type: 'quote.stage', id: preview.id, stage: e.target.value })}
            >
              {quoteStages.map((s) => (
                <option key={s} value={s}>
                  {ui(s)}
                </option>
              ))}
            </select>
          </label>
          <p className="form-note">{ui('Este cambio no envía la cotización al cliente.')}</p>
          <div className="modal-actions">
            <button
              className="demo-button secondary"
              onClick={() => {
                const { id: _id, number: _number, ...copy } = preview;
                setPreviewId(null);
                setEditor({ ...copy, status: 'Borrador', date: localDate() });
              }}
            >
              {ui('Duplicar ')}
            </button>
            <button className="demo-button secondary" onClick={() => window.print()}>
              {ui('Imprimir ')}
            </button>
            <button
              className="demo-button"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                setPdfNotice('');
                try {
                  const { createQuotePdf } = await import('../../lib/quote-pdf');
                  await createQuotePdf(preview as Parameters<typeof createQuotePdf>[0]).save(
                    `altum-${folio('COT', preview.number)}-ejemplo.pdf`,
                    { returnPromise: true },
                  );
                  setPdfNotice('PDF generado. Revisa las descargas de tu navegador.');
                } catch {
                  setPdfNotice(
                    'No se pudo generar el PDF. Intenta de nuevo o utiliza la opción Imprimir.',
                  );
                } finally {
                  setExporting(false);
                }
              }}
            >
              {exporting ? ui('Preparando PDF…') : ui('Descargar PDF')}
            </button>
          </div>
          <p className="form-note" role="status">
            {ui(pdfNotice)}
          </p>
        </Modal>
      )}
    </>
  );
}
