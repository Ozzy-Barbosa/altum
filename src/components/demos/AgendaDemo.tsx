import { useState } from 'react';
import { localDate, money, slots } from '../../lib/demo-domain.mjs';
import { Empty, Field, Modal, Stats, Tabs, type DemoProps } from './Shared';
export default function AgendaDemo({ data, send, busy }: DemoProps) {
  const [view, setView] = useState('Reservar');
  const [serviceId, setServiceId] = useState(data.services[0].id);
  const [professional, setProfessional] = useState(data.professionals[0]);
  const [date, setDate] = useState(localDate());
  const [time, setTime] = useState('');
  const [name, setName] = useState('Cliente de ejemplo');
  const [receipt, setReceipt] = useState(false);
  const [cancel, setCancel] = useState<string | null>(null);
  const service = data.services.find((s: any) => s.id === serviceId);
  const available = slots(data, serviceId, professional, date);
  const active = data.bookings.filter((b: any) => b.status === 'Confirmada');
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">ESTUDIO DE SERVICIOS · EJEMPLO</span>
          <h2>{data.brand}</h2>
          <p>Un espacio para ti, a tu ritmo.</p>
        </div>
        <span className="pill">Horario de La Paz, BCS</span>
      </div>
      <Tabs values={['Reservar', 'Mis citas', 'Panel']} value={view} onChange={setView} />
      {view === 'Reservar' ? (
        <div className="booking-layout">
          <div>
            <h3 className="step-title">
              <span>01</span> Elige tu servicio
            </h3>
            <div className="service-options">
              {data.services.map((s: any) => (
                <button
                  key={s.id}
                  className={s.id === serviceId ? 'selected' : ''}
                  aria-pressed={s.id === serviceId}
                  onClick={() => {
                    setServiceId(s.id);
                    setTime('');
                  }}
                >
                  <span>
                    <strong>{s.name}</strong>
                    <small>{s.duration} minutos</small>
                  </span>
                  <strong>{money(s.price)}</strong>
                </button>
              ))}
            </div>
            <h3 className="step-title">
              <span>02</span> Encuentra tu horario
            </h3>
            <div className="form-grid">
              <Field label="Profesional">
                <select
                  value={professional}
                  onChange={(e) => {
                    setProfessional(e.target.value);
                    setTime('');
                  }}
                >
                  {data.professionals.map((p: string) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Fecha">
                <input
                  aria-label="Fecha de la cita"
                  type="date"
                  min={localDate()}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime('');
                  }}
                  required
                />
              </Field>
            </div>
            <div className="time-grid">
              {available.map((t) => (
                <button key={t} aria-pressed={t === time} onClick={() => setTime(t)}>
                  {t}
                </button>
              ))}
            </div>
            {!available.length ? (
              <Empty>No hay horarios para esta fecha. Prueba otro día o profesional.</Empty>
            ) : null}
          </div>
          <aside className="booking-summary">
            <span className="demo-eyebrow">TU RESERVA DE EJEMPLO</span>
            <h3>{service.name}</h3>
            <p>
              {professional} · {service.duration} min
            </p>
            <div className="summary-date">
              <span>{date || 'Elige una fecha'}</span>
              <strong>{time || 'Elige un horario'}</strong>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  await send({ type: 'booking.create', serviceId, professional, date, time, name })
                ) {
                  setReceipt(true);
                  setTime('');
                }
              }}
            >
              <Field label="Nombre de ejemplo">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  required
                />
              </Field>
              <div className="cart-totals">
                <div className="total">
                  <strong>Total de ejemplo</strong>
                  <strong>{money(service.price)}</strong>
                </div>
              </div>
              <button
                type="submit"
                className="demo-button full-width"
                disabled={busy || !available.includes(time)}
              >
                Confirmar cita de ejemplo →
              </button>
            </form>
            <p className="demo-caption">No se agenda una cita real ni se envían recordatorios.</p>
          </aside>
        </div>
      ) : (
        <>
          <Stats
            items={[
              { label: 'Citas confirmadas', value: active.length },
              {
                label: 'Tiempo reservado',
                value: active.reduce((sum: number, b: any) => sum + b.duration, 0) + ' min',
              },
              {
                label: 'Valor de ejemplo',
                value: money(active.reduce((sum: number, b: any) => sum + b.price, 0)),
              },
            ]}
          />
          {data.bookings.length ? (
            <div className="booking-list">
              {data.bookings.map((b: any) => (
                <article key={b.id}>
                  <div className="date-badge">
                    <strong>{b.date.slice(8)}</strong>
                    <span>{b.date.slice(0, 7)}</span>
                  </div>
                  <div>
                    <h3>{b.service}</h3>
                    <p>
                      {b.professional} · {b.time} · {b.duration} min
                    </p>
                    <small>
                      {b.name} · Folio {b.id.slice(0, 8)}
                    </small>
                  </div>
                  <span className={`pill ${b.status === 'Cancelada' ? 'dim' : ''}`}>
                    {b.status}
                  </span>
                  {b.status === 'Confirmada' ? (
                    <button className="demo-button secondary" onClick={() => setCancel(b.id)}>
                      Cancelar cita
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <Empty>No tienes citas todavía. Elige un servicio y un horario para empezar.</Empty>
          )}
        </>
      )}
      {receipt ? (
        <Modal title="Tu cita de ejemplo está confirmada" onClose={() => setReceipt(false)}>
          <div className="success-mark">✓</div>
          <p>
            Revisa tu reserva en Mis citas. Este horario ya no se ofrece para el mismo profesional
            en tu demo.
          </p>
          <button
            className="demo-button full-width"
            onClick={() => {
              setReceipt(false);
              setView('Mis citas');
            }}
          >
            Ver mi cita →
          </button>
        </Modal>
      ) : null}
      {cancel ? (
        <Modal title="Cancelar cita de ejemplo" onClose={() => setCancel(null)}>
          <p>El horario quedará disponible nuevamente en tu demo.</p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setCancel(null)}>
              Conservar cita
            </button>
            <button
              className="demo-button danger"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'booking.cancel', id: cancel })) setCancel(null);
              }}
            >
              Confirmar cancelación
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
