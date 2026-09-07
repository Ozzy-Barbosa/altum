import { useState } from 'react';
import { money, normalize } from '../../lib/demo-domain.mjs';
import { Empty, ExportButton, Field, Modal, Stats, Tabs, values, type DemoProps } from './Shared';
export default function InventoryDemo({ data, send, busy }: DemoProps) {
  const [view, setView] = useState('Productos');
  const [query, setQuery] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const [movement, setMovement] = useState(false);
  const [deleting, setDeleting] = useState<any>(null);
  const products = data.products as any[];
  const low = products.filter((p) => p.stock <= p.min);
  const visible = products.filter(
    (p) =>
      normalize(p.name + ' ' + p.category).includes(normalize(query)) &&
      (!lowOnly || p.stock <= p.min),
  );
  const categories = [...new Set(products.map((p) => p.category))];
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">BODEGA BRISA · DATOS DE EJEMPLO</span>
          <h2>
            Todo tu inventario,
            <br />a la vista.
          </h2>
          <p>Productos, movimientos y reposición.</p>
        </div>
        <button className="demo-button" onClick={() => setEditor({})}>
          + Nuevo producto
        </button>
      </div>
      <Stats
        items={[
          { label: 'Productos', value: products.length, detail: 'Referencias registradas' },
          {
            label: 'Unidades disponibles',
            value: products.reduce((sum, p) => sum + p.stock, 0),
            detail: 'Suma de existencias',
          },
          { label: 'Por reponer', value: low.length, detail: 'En el mínimo o por debajo' },
          {
            label: 'Valor a precio de venta',
            value: money(products.reduce((sum, p) => sum + p.stock * p.price, 0)),
            detail: 'No representa utilidad',
          },
        ]}
      />
      <Tabs values={['Productos', 'Movimientos', 'Dashboard']} value={view} onChange={setView} />
      {view === 'Productos' ? (
        <>
          <div className="demo-toolbar">
            <label className="search-field">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Buscar en inventario"
                placeholder="Buscar nombre o categoría..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={lowOnly}
                onChange={(e) => setLowOnly(e.target.checked)}
              />{' '}
              Solo por reponer
            </label>
            <ExportButton
              rows={visible.map((p) => ({
                Producto: p.name,
                Categoria: p.category,
                Precio: p.price,
                Existencias: p.stock,
                Minimo: p.min,
              }))}
              name="altum-inventario-ejemplo"
            />
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <caption>Productos de ejemplo</caption>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio MXN</th>
                  <th>Existencias</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <small>{p.category}</small>
                    </td>
                    <td>{money(p.price)}</td>
                    <td>
                      <strong>{p.stock}</strong>
                      <small>Mínimo {p.min}</small>
                    </td>
                    <td>
                      <span className={`pill ${p.stock <= p.min ? 'warning' : ''}`}>
                        {p.stock === 0
                          ? 'Agotado'
                          : p.stock <= p.min
                            ? 'Por reponer'
                            : 'Disponible'}
                      </span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button onClick={() => setEditor(p)} aria-label={`Editar ${p.name}`}>
                          Editar
                        </button>
                        <button onClick={() => setDeleting(p)} aria-label={`Eliminar ${p.name}`}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length ? <Empty>No hay productos que coincidan con tu búsqueda.</Empty> : null}
        </>
      ) : view === 'Movimientos' ? (
        <>
          <div className="demo-toolbar">
            <p>Un historial de cada entrada y salida registrada.</p>
            <button
              className="demo-button"
              disabled={!products.length}
              onClick={() => setMovement(true)}
            >
              + Registrar movimiento
            </button>
          </div>
          {data.movements.length ? (
            <div className="table-scroll">
              <table className="data-table">
                <caption>Movimientos de inventario</caption>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Motivo</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.movements.map((m: any) => (
                    <tr key={m.id}>
                      <td>{m.product}</td>
                      <td>
                        <span className={`pill ${m.quantity < 0 ? 'warning' : ''}`}>
                          {m.quantity > 0 ? '+' : ''}
                          {m.quantity}
                        </span>
                      </td>
                      <td>{m.reason}</td>
                      <td>{new Date(m.at).toLocaleString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>Aún no hay movimientos. Registra una entrada o una salida.</Empty>
          )}
        </>
      ) : (
        <div className="dashboard-grid">
          <article className="chart-card">
            <h3>Existencias por categoría</h3>
            <p>Unidades disponibles en tus registros actuales.</p>
            {categories.map((c) => {
              const count = products
                .filter((p) => p.category === c)
                .reduce((sum, p) => sum + p.stock, 0);
              const max = Math.max(
                1,
                ...categories.map((cat) =>
                  products.filter((p) => p.category === cat).reduce((sum, p) => sum + p.stock, 0),
                ),
              );
              return (
                <div className="bar-row" key={c}>
                  <div>
                    <span>{c}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="bar-track">
                    <span style={{ width: (count / max) * 100 + '%' }} />
                  </div>
                </div>
              );
            })}
          </article>
          <article className="chart-card">
            <h3>Prioridad de reposición</h3>
            <p>Productos en su mínimo o por debajo.</p>
            {low.length ? (
              low.map((p) => (
                <button
                  className="low-row"
                  key={p.id}
                  onClick={() => {
                    setQuery(p.name);
                    setView('Productos');
                    setLowOnly(false);
                  }}
                >
                  <span>{p.name}</span>
                  <strong>
                    {p.stock} / {p.min} mín.
                  </strong>
                </button>
              ))
            ) : (
              <Empty>Todos los productos están por encima de su mínimo.</Empty>
            )}
          </article>
        </div>
      )}
      {editor ? (
        <Modal
          title={editor.id ? 'Editar producto' : 'Nuevo producto'}
          onClose={() => setEditor(null)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await send({ type: 'product.save', id: editor.id, product: values(e) }))
                setEditor(null);
            }}
          >
            <div className="form-grid">
              <Field label="Nombre *" full>
                <input name="name" defaultValue={editor.name || ''} required maxLength={120} />
              </Field>
              <Field label="Categoría *">
                <input
                  name="category"
                  defaultValue={editor.category || ''}
                  required
                  maxLength={60}
                />
              </Field>
              <Field label="Precio de venta MXN *">
                <input
                  name="price"
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  defaultValue={editor.price ?? 0}
                  required
                />
              </Field>
              <Field label="Existencias *">
                <input
                  name="stock"
                  type="number"
                  min="0"
                  max="100000"
                  step="1"
                  defaultValue={editor.stock ?? 0}
                  required
                />
              </Field>
              <Field label="Mínimo de reposición *">
                <input
                  name="min"
                  type="number"
                  min="0"
                  max="100000"
                  step="1"
                  defaultValue={editor.min ?? 5}
                  required
                />
              </Field>
            </div>
            <p className="demo-caption">
              Para conservar un historial de entradas y salidas, utiliza Registrar movimiento.
            </p>
            <button className="demo-button full-width" type="submit" disabled={busy}>
              Guardar producto
            </button>
          </form>
        </Modal>
      ) : null}
      {movement ? (
        <Modal title="Registrar movimiento" onClose={() => setMovement(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await send({ type: 'stock.move', ...values(e) })) setMovement(false);
            }}
          >
            <div className="form-grid">
              <Field label="Producto *" full>
                <select name="id" required>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.stock} disponibles
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo">
                <select name="direction">
                  <option>Entrada</option>
                  <option>Salida</option>
                </select>
              </Field>
              <Field label="Cantidad *">
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  required
                  defaultValue="1"
                />
              </Field>
              <Field label="Motivo *" full>
                <input
                  name="reason"
                  maxLength={180}
                  placeholder="Ej. Compra a proveedor de ejemplo"
                  required
                />
              </Field>
            </div>
            <button className="demo-button full-width" disabled={busy} type="submit">
              Guardar movimiento
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? (
        <Modal title="Eliminar producto de ejemplo" onClose={() => setDeleting(null)}>
          <p>
            Se eliminará «{deleting.name}». Sus movimientos anteriores se conservan en el historial.
          </p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setDeleting(null)}>
              Cancelar
            </button>
            <button
              className="demo-button danger"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'product.delete', id: deleting.id })) setDeleting(null);
              }}
            >
              Eliminar producto
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
