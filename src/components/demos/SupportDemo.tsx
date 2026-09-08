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
          <span className="demo-eyebrow">MESA DE AYUDA · EJEMPLO</span>
          <h2>
            Escuchar.
            <br />
            Atender. Resolver.
          </h2>
          <p>Cada incidencia tiene un responsable y una historia.</p>
        </div>
        <button
          className="demo-button"
          onClick={() =>
            setEditor({ category: 'Red y Wi-Fi', priority: 'Media', due: localDate() })
          }
        >
          + Nuevo ticket
        </button>
      </div>
      <Stats
        items={[
          {
            label: 'Solicitudes activas',
            value: tickets.filter((t) => t.status !== 'Resuelto').length,
          },
          {
            label: 'Prioridad alta activa',
            value: tickets.filter((t) => t.priority === 'Alta' && t.status !== 'Resuelto').length,
          },
          {
            label: 'Fuera de fecha objetivo',
            value: tickets.filter((t) => t.due < localDate() && t.status !== 'Resuelto').length,
          },
          { label: 'Resueltas', value: tickets.filter((t) => t.status === 'Resuelto').length },
        ]}
      />
      <div className="demo-toolbar" style={{ marginTop: 25 }}>
        <label className="search-input">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Buscar tickets"
            placeholder="Buscar asunto, cliente o folio…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="compact-field">
          Estado del ticket
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            {['Todos', ...ticketStages].map((s) => (
              <option key={s}>{s}</option>
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
        <Empty>No hay tickets con estos filtros.</Empty>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <caption>Solicitudes de soporte</caption>
            <thead>
              <tr>
                <th>Solicitud</th>
                <th>Responsable</th>
                <th>Prioridad / fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <small>
                      {folio('TK', t.number)} · {t.category}
                    </small>
                    <strong>{t.subject}</strong>
                    <span>{t.customer}</span>
                  </td>
                  <td>{t.assignee}</td>
                  <td>
                    {t.priority}
                    <small>{t.due}</small>
                  </td>
                  <td>
                    <span className="tag">{t.status}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        onClick={() => setDetail(t.id)}
                        aria-label={`Abrir ${folio('TK', t.number)}`}
                      >
                        Ver y responder
                      </button>
                      <button
                        onClick={() => setEditor(t)}
                        aria-label={`Editar ${folio('TK', t.number)}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setRemove(t)}
                        aria-label={`Eliminar ${folio('TK', t.number)}`}
                      >
                        Eliminar
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
        No se envían mensajes ni se monitorean dispositivos. La fecha objetivo es una referencia del
        ejemplo.
      </p>
      {editor ? (
        <RecordEditor
          title={editor.id ? 'Editar ticket' : 'Nuevo ticket'}
          entity="ticket"
          record={editor}
          fields={[
            { name: 'subject', label: 'Asunto', full: true },
            { name: 'customer', label: 'Cliente de ejemplo' },
            { name: 'assignee', label: 'Responsable' },
            { name: 'category', label: 'Categoría', options: ticketCategories },
            { name: 'priority', label: 'Prioridad', options: ['Alta', 'Media', 'Baja'] },
            { name: 'due', label: 'Fecha objetivo', type: 'date' },
            {
              name: 'description',
              label: 'Descripción',
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
          title={`${folio('TK', selected.number)} · ${selected.subject}`}
          onClose={() => setDetail(null)}
        >
          <p>{selected.description}</p>
          <ol className="service-timeline">
            {selected.history.map((h: RecordData) => (
              <li key={h.id}>
                <strong>
                  {h.status} · {h.date}
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
              <Field label="Nuevo estado" full>
                <select name="status" defaultValue={selected.status} key={selected.status}>
                  {ticketStages.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Respuesta o avance" full>
                <textarea name="note" required maxLength={1000} rows={3} />
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
                Guardar respuesta
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
