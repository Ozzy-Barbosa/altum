import { ui } from '../../i18n/messages.mjs';
import { useState } from 'react';
import { localDate, normalize } from '../../lib/demo-domain.mjs';
import { ticketStages, ticketCategories } from '../../lib/extended-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, values, type DemoProps } from './Shared';
import { RecordEditor, DeleteRecord, folio, type RecordData } from './BusinessShared';
export default function SupportDemo({ data, send, busy }: DemoProps) {
  const [query, setQuery] = useState(''),
    [stage, setStage] = useState('Todos'),
    [editor, setEditor] = useState<RecordData | null>(null),
    [remove, setRemove] = useState<RecordData | null>(null),
    [detail, setDetail] = useState<string | null>(null);
  const tickets = data.tickets as RecordData[],
    selected = tickets.find((t) => t.id === detail);
  const rows = tickets.filter(
    (t) =>
      (stage === 'Todos' || stage === t.status) &&
      normalize(t.subject + ' ' + t.customer + ' ' + folio('TK', t.number)).includes(
        normalize(query),
      ),
  );
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">{ui('MESA DE AYUDA · EJEMPLO')}</span>
          <h2>
            {ui('Escuchar. ')}
            <br />
            {ui('Atender. Resolver. ')}
          </h2>
          <p>{ui('Cada incidencia tiene un responsable y una historia.')}</p>
        </div>
        <button
          className="demo-button"
          onClick={() =>
            setEditor({ category: 'Red y Wi-Fi', priority: 'Media', due: localDate() })
          }
        >
          {ui('+ Nuevo ticket ')}
        </button>
      </div>
      <Stats
        items={[
          {
            label: ui('Solicitudes activas'),
            value: tickets.filter((t) => t.status !== 'Resuelto').length,
          },
          {
            label: ui('Prioridad alta activa'),
            value: tickets.filter((t) => t.priority === 'Alta' && t.status !== 'Resuelto').length,
          },
          {
            label: ui('Fuera de fecha objetivo'),
            value: tickets.filter((t) => t.due < localDate() && t.status !== 'Resuelto').length,
          },
          { label: ui('Resueltas'), value: tickets.filter((t) => t.status === 'Resuelto').length },
        ]}
      />
      <div className="demo-toolbar" style={{ marginTop: 25 }}>
        <label className="search-input">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label={ui('Buscar tickets')}
            placeholder={ui('Buscar asunto, cliente o folio…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          {ui('Estado del ticket ')}
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            {['Todos', ...ticketStages].map((s) => (
              <option key={s} value={s}>
                {ui(s)}
              </option>
            ))}
          </select>
        </label>
        <ExportButton
          name="altum-soporte"
          rows={rows.map((t) => ({
            Folio: folio('TK', t.number),
            Asunto: t.subject,
            Cliente: t.customer,
            Categoria: t.category,
            Prioridad: t.priority,
            Responsable: t.assignee,
            Estado: t.status,
            FechaObjetivo: t.due,
          }))}
        />
      </div>
      {!rows.length ? (
        <Empty>{ui('No hay tickets con estos filtros.')}</Empty>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <caption>{ui('Solicitudes de soporte')}</caption>
            <thead>
              <tr>
                <th>{ui('Solicitud')}</th>
                <th>{ui('Responsable')}</th>
                <th>{ui('Prioridad / fecha')}</th>
                <th>{ui('Estado')}</th>
                <th>{ui('Acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <small>
                      {folio('TK', t.number)} · {ui(t.category)}
                    </small>
                    <strong>{t.subject}</strong>
                    <span>{t.customer}</span>
                  </td>
                  <td>{t.assignee}</td>
                  <td>
                    {ui(t.priority)}
                    <small>{t.due}</small>
                  </td>
                  <td>
                    <span className="tag">{ui(t.status)}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        onClick={() => setDetail(t.id)}
                        aria-label={ui('Abrir {value0}', undefined, {
                          value0: folio('TK', t.number),
                        })}
                      >
                        {ui('Ver y responder ')}
                      </button>
                      <button
                        onClick={() => setEditor(t)}
                        aria-label={ui('Editar {value0}', undefined, {
                          value0: folio('TK', t.number),
                        })}
                      >
                        {ui('Editar ')}
                      </button>
                      <button
                        onClick={() => setRemove(t)}
                        aria-label={ui('Eliminar {value0}', undefined, {
                          value0: folio('TK', t.number),
                        })}
                      >
                        {ui('Eliminar ')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="form-note">
        {ui(
          'No se envían mensajes ni se monitorean dispositivos. La fecha objetivo es una referencia del ejemplo. ',
        )}
      </p>
      {editor ? (
        <RecordEditor
          title={editor.id ? ui('Editar ticket') : ui('Nuevo ticket')}
          entity="ticket"
          record={editor}
          fields={[
            { name: 'subject', label: ui('Asunto'), full: true },
            { name: 'customer', label: ui('Cliente de ejemplo') },
            { name: 'assignee', label: ui('Responsable') },
            { name: 'category', label: ui('Categoría'), options: ticketCategories },
            { name: 'priority', label: ui('Prioridad'), options: ['Alta', 'Media', 'Baja'] },
            { name: 'due', label: ui('Fecha objetivo'), type: 'date' },
            {
              name: 'description',
              label: ui('Descripción'),
              type: 'textarea',
              full: true,
              maxLength: 1000,
            },
          ]}
          send={send}
          busy={busy}
          close={() => setEditor(null)}
        />
      ) : null}
      {remove ? (
        <DeleteRecord
          name={remove.subject}
          entity="ticket"
          record={remove}
          send={send}
          busy={busy}
          close={() => setRemove(null)}
        />
      ) : null}
      {selected ? (
        <Modal
          title={ui('{value0} · {value1}', undefined, {
            value0: folio('TK', selected.number),
            value1: selected.subject,
          })}
          onClose={() => setDetail(null)}
        >
          <p>{selected.description}</p>
          <ol className="service-timeline">
            {selected.history.map((h: RecordData) => (
              <li key={h.id}>
                <strong>
                  {ui(h.status)} · {h.date}
                </strong>
                <p>{h.note}</p>
              </li>
            ))}
          </ol>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              if (await send({ type: 'ticket.reply', id: selected.id, record: values(e) }))
                form.reset();
            }}
          >
            <div className="form-grid">
              <Field label={ui('Nuevo estado')} full>
                <select name="status" defaultValue={selected.status} key={selected.status}>
                  {ticketStages.map((s) => (
                    <option key={s} value={s}>
                      {ui(s)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={ui('Respuesta o avance')} full>
                <textarea name="note" required maxLength={1000} rows={3} />
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
                {ui('Guardar respuesta ')}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
