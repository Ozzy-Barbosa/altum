import { ui, languageTag } from '../../i18n/messages.mjs';
import { useState } from 'react';
import { normalize } from '../../lib/demo-domain.mjs';
import { formatMoney as money } from '../../i18n/messages.mjs';
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
          <span className="demo-eyebrow">{ui('BODEGA BRISA · DATOS DE EJEMPLO')}</span>
          <h2>
            {ui('Todo tu inventario, ')}
            <br />
            {ui('a la vista. ')}
          </h2>
          <p>{ui('Productos, movimientos y reposición.')}</p>
        </div>
        <button className="demo-button" onClick={() => setEditor({})}>
          {ui('+ Nuevo producto ')}
        </button>
      </div>
      <Stats
        items={[
          { label: ui('Productos'), value: products.length, detail: ui('Referencias registradas') },
          {
            label: ui('Unidades disponibles'),
            value: products.reduce((sum, p) => sum + p.stock, 0),
            detail: ui('Suma de existencias'),
          },
          { label: ui('Por reponer'), value: low.length, detail: ui('En el mínimo o por debajo') },
          {
            label: ui('Valor a precio de venta'),
            value: money(products.reduce((sum, p) => sum + p.stock * p.price, 0)),
            detail: ui('No representa utilidad'),
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
                aria-label={ui('Buscar en inventario')}
                placeholder={ui('Buscar nombre o categoría...')}
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
              {ui('Solo por reponer ')}
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
              <caption>{ui('Productos de ejemplo')}</caption>
              <thead>
                <tr>
                  <th>{ui('Producto')}</th>
                  <th>{ui('Precio MXN')}</th>
                  <th>{ui('Existencias')}</th>
                  <th>{ui('Estado')}</th>
                  <th>{ui('Acciones')}</th>
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
                      <small>
                        {ui('Mínimo ')}
                        {p.min}
                      </small>
                    </td>
                    <td>
                      <span className={`pill ${p.stock <= p.min ? 'warning' : ''}`}>
                        {p.stock === 0
                          ? ui('Agotado')
                          : p.stock <= p.min
                            ? ui('Por reponer')
                            : ui('Disponible')}
                      </span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button
                          onClick={() => setEditor(p)}
                          aria-label={ui('Editar {value0}', undefined, { value0: p.name })}
                        >
                          {ui('Editar ')}
                        </button>
                        <button
                          onClick={() => setDeleting(p)}
                          aria-label={ui('Eliminar {value0}', undefined, { value0: p.name })}
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
          {!visible.length ? (
            <Empty>{ui('No hay productos que coincidan con tu búsqueda.')}</Empty>
          ) : null}
        </>
      ) : view === 'Movimientos' ? (
        <>
          <div className="demo-toolbar">
            <p>{ui('Un historial de cada entrada y salida registrada.')}</p>
            <button
              className="demo-button"
              disabled={!products.length}
              onClick={() => setMovement(true)}
            >
              {ui('+ Registrar movimiento ')}
            </button>
          </div>
          {data.movements.length ? (
            <div className="table-scroll">
              <table className="data-table">
                <caption>{ui('Movimientos de inventario')}</caption>
                <thead>
                  <tr>
                    <th>{ui('Producto')}</th>
                    <th>{ui('Cantidad')}</th>
                    <th>{ui('Motivo')}</th>
                    <th>{ui('Fecha')}</th>
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
                      <td>{new Date(m.at).toLocaleString(languageTag())}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>{ui('Aún no hay movimientos. Registra una entrada o una salida.')}</Empty>
          )}
        </>
      ) : (
        <div className="dashboard-grid">
          <article className="chart-card">
            <h3>{ui('Existencias por categoría')}</h3>
            <p>{ui('Unidades disponibles en tus registros actuales.')}</p>
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
            <h3>{ui('Prioridad de reposición')}</h3>
            <p>{ui('Productos en su mínimo o por debajo.')}</p>
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
                    {p.stock} / {p.min} {ui(' mín. ')}
                  </strong>
                </button>
              ))
            ) : (
              <Empty>{ui('Todos los productos están por encima de su mínimo.')}</Empty>
            )}
          </article>
        </div>
      )}
      {editor ? (
        <Modal
          title={editor.id ? ui('Editar producto') : ui('Nuevo producto')}
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
              <Field label={ui('Nombre *')} full>
                <input name="name" defaultValue={editor.name || ''} required maxLength={120} />
              </Field>
              <Field label={ui('Categoría *')}>
                <input
                  name="category"
                  defaultValue={editor.category || ''}
                  required
                  maxLength={60}
                />
              </Field>
              <Field label={ui('Precio de venta MXN *')}>
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
              <Field label={ui('Existencias *')}>
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
              <Field label={ui('Mínimo de reposición *')}>
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
              {ui(
                'Para conservar un historial de entradas y salidas, utiliza Registrar movimiento. ',
              )}
            </p>
            <button className="demo-button full-width" type="submit" disabled={busy}>
              {ui('Guardar producto ')}
            </button>
          </form>
        </Modal>
      ) : null}
      {movement ? (
        <Modal title={ui('Registrar movimiento')} onClose={() => setMovement(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await send({ type: 'stock.move', ...values(e) })) setMovement(false);
            }}
          >
            <div className="form-grid">
              <Field label={ui('Producto *')} full>
                <select name="id" required>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.stock} {ui(' disponibles ')}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={ui('Tipo')}>
                <select name="direction">
                  <option value={'Entrada'}>{ui('Entrada')}</option>
                  <option value={'Salida'}>{ui('Salida')}</option>
                </select>
              </Field>
              <Field label={ui('Cantidad *')}>
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
              <Field label={ui('Motivo *')} full>
                <input
                  name="reason"
                  maxLength={180}
                  placeholder={ui('Ej. Compra a proveedor de ejemplo')}
                  required
                />
              </Field>
            </div>
            <button className="demo-button full-width" disabled={busy} type="submit">
              {ui('Guardar movimiento ')}
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? (
        <Modal title={ui('Eliminar producto de ejemplo')} onClose={() => setDeleting(null)}>
          <p>
            {ui('Se eliminará «')}
            {deleting.name}
            {ui('». Sus movimientos anteriores se conservan en el historial. ')}
          </p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setDeleting(null)}>
              {ui('Cancelar ')}
            </button>
            <button
              className="demo-button danger"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'product.delete', id: deleting.id })) setDeleting(null);
              }}
            >
              {ui('Eliminar producto ')}
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
