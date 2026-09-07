import { useState } from 'react';
import { money, normalize, totals } from '../../lib/demo-domain.mjs';
import { Empty, Field, Modal, Stats, Tabs, values, type DemoProps } from './Shared';
export default function CatalogDemo({
  data,
  send,
  busy,
  kind,
}: { kind: 'menu' | 'commerce' } & DemoProps) {
  const [tab, setTab] = useState('Catálogo');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [delivery, setDelivery] = useState('recoger');
  const [editor, setEditor] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [deleting, setDeleting] = useState<any>(null);
  const products = data.products as any[];
  const categories = ['Todos', ...new Set(products.map((p) => p.category))];
  const visible = products.filter(
    (p) =>
      (tab === 'Administrar' || p.active) &&
      (category === 'Todos' || p.category === category) &&
      normalize(p.name + ' ' + p.description).includes(normalize(query)),
  );
  const validCart = Object.fromEntries(
    Object.entries(cart)
      .filter(([pid]) => products.some((p) => p.id === pid && p.active && p.stock > 0))
      .map(([pid, q]) => [pid, Math.min(q, products.find((p) => p.id === pid).stock)]),
  );
  const total = totals(products, validCart, kind === 'commerce' ? delivery : 'recoger');
  const units = total.lines.reduce((sum, p) => sum + p.quantity, 0);
  const change = (pid: string, amount: number) =>
    setCart((previous) => ({
      ...previous,
      [pid]: Math.max(
        0,
        Math.min(products.find((p) => p.id === pid)?.stock || 0, (previous[pid] || 0) + amount),
      ),
    }));
  async function order() {
    const ok = await send({
      type: 'order.create',
      cart: validCart,
      delivery: kind === 'commerce' ? delivery : 'recoger',
    });
    if (ok) {
      setReceipt(total);
      setCart({});
      setCartOpen(false);
    }
  }
  const cartPanel = (
    <>
      <h3>
        {kind === 'menu' ? 'Tu pedido' : 'Tu carrito'} <span className="count">{units}</span>
      </h3>
      {total.lines.length ? (
        total.lines.map((p) => (
          <div className="cart-line" key={p.id}>
            <div>
              <strong>{p.name}</strong>
              <small>{money(p.price)}</small>
            </div>
            <div className="quantity">
              <button onClick={() => change(p.id, -1)} aria-label={`Quitar uno de ${p.name}`}>
                −
              </button>
              <span>{p.quantity}</span>
              <button
                onClick={() => change(p.id, 1)}
                disabled={p.quantity >= products.find((x) => x.id === p.id).stock}
                aria-label={`Agregar uno de ${p.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))
      ) : (
        <Empty>Agrega productos para preparar tu {kind === 'menu' ? 'pedido' : 'compra'}.</Empty>
      )}
      {kind === 'commerce' ? (
        <Field label="Forma de entrega">
          <select value={delivery} onChange={(e) => setDelivery(e.target.value)}>
            <option value="recoger">Recoger · sin costo</option>
            <option value="envio">Entrega local · $80 / gratis desde $1,000</option>
          </select>
        </Field>
      ) : null}
      <div className="cart-totals">
        <div>
          <span>Subtotal</span>
          <span>{money(total.subtotal)}</span>
        </div>
        {kind === 'commerce' ? (
          <div>
            <span>Envío de ejemplo</span>
            <span>{money(total.shipping)}</span>
          </div>
        ) : null}
        <div className="total">
          <strong>Total MXN</strong>
          <strong>{money(total.total)}</strong>
        </div>
      </div>
      <button className="demo-button full-width" disabled={busy || !units} onClick={order}>
        {kind === 'menu' ? 'Simular pedido' : 'Simular compra'} →
      </button>
      <p className="demo-caption">Demostración sin cobros, envíos ni pedidos reales.</p>
    </>
  );
  return (
    <div className={`catalog-demo ${kind}`}>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">
            {kind === 'menu' ? 'CAFETERÍA DE EJEMPLO' : 'TIENDA DE EJEMPLO'}
          </span>
          <h2>{data.brand}</h2>
          <p>{kind === 'menu' ? data.subtitle : 'Objetos para acompañar tu día.'}</p>
        </div>
        <button className="demo-button" onClick={() => setCartOpen(true)}>
          Ver {kind === 'menu' ? 'pedido' : 'carrito'} ({units})
        </button>
      </div>
      <Tabs values={['Catálogo', 'Administrar', 'Pedidos']} value={tab} onChange={setTab} />
      {kind === 'menu' && tab === 'Catálogo' ? (
        <div className="cafe-banner">
          <img
            src="/assets/brisa-cafe-demo.webp"
            width="1280"
            height="853"
            alt="Composición ilustrativa de café y desayunos para Brisa Café"
          />
          <div>
            <span>HECHO PARA DISFRUTAR</span>
            <strong>
              Un buen día
              <br />
              empieza aquí.
            </strong>
            <small>Imagen creada para esta demostración.</small>
          </div>
        </div>
      ) : null}
      {tab === 'Pedidos' ? (
        <>
          <Stats
            items={[
              { label: 'Pedidos simulados', value: data.orders.length },
              {
                label: 'Importe de ejemplo',
                value: money(data.orders.reduce((sum: number, o: any) => sum + o.total, 0)),
              },
            ]}
          />
          {data.orders.length ? (
            <div className="order-list">
              {data.orders.map((o: any) => (
                <article key={o.id}>
                  <div>
                    <strong>Pedido {o.id.slice(0, 8).toUpperCase()}</strong>
                    <small>
                      {new Date(o.at).toLocaleString('es-MX')} · {o.delivery}
                    </small>
                  </div>
                  <ul>
                    {o.lines.map((p: any) => (
                      <li key={p.id}>
                        {p.quantity} × {p.name}
                      </li>
                    ))}
                  </ul>
                  <strong>{money(o.total)}</strong>
                  <span className="pill">Simulado</span>
                </article>
              ))}
            </div>
          ) : (
            <Empty>Todavía no hay pedidos. Completa uno desde el catálogo.</Empty>
          )}
        </>
      ) : (
        <>
          <div className="demo-toolbar">
            <label className="search-field">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Buscar productos"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {tab === 'Administrar' ? (
              <button className="demo-button" onClick={() => setEditor({})}>
                + Nuevo producto
              </button>
            ) : null}
          </div>
          <div className="category-chips">
            {categories.map((c) => (
              <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="catalog-layout">
            <div className="product-grid">
              {visible.map((p) => (
                <article className="demo-product" key={p.id}>
                  <div className={`product-art art-${p.id.slice(-1)}`} aria-hidden="true">
                    <span>{p.symbol}</span>
                    <small>{p.category}</small>
                  </div>
                  <div className="product-content">
                    <div className="product-title">
                      <h3>{p.name}</h3>
                      <strong>{money(p.price)}</strong>
                    </div>
                    <p>{p.description || p.category}</p>
                    <div className="product-actions">
                      <small>
                        {!p.active
                          ? 'Oculto'
                          : p.stock === 0
                            ? 'Agotado'
                            : `${p.stock} disponibles`}
                      </small>
                      {tab === 'Administrar' ? (
                        <div className="inline-actions">
                          <button onClick={() => setEditor(p)} aria-label={`Editar ${p.name}`}>
                            Editar
                          </button>
                          <button onClick={() => setDeleting(p)} aria-label={`Eliminar ${p.name}`}>
                            Eliminar
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-button"
                          disabled={!p.stock || (validCart[p.id] || 0) >= p.stock}
                          onClick={() => change(p.id, 1)}
                          aria-label={`Agregar ${p.name}`}
                        >
                          + Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
              {!visible.length ? <Empty>No hay productos con esos filtros.</Empty> : null}
            </div>
            <aside className="cart-panel">{cartPanel}</aside>
          </div>
        </>
      )}
      {cartOpen ? (
        <Modal
          title={kind === 'menu' ? 'Tu pedido de ejemplo' : 'Tu compra de ejemplo'}
          onClose={() => setCartOpen(false)}
        >
          <div className="cart-panel modal-cart">{cartPanel}</div>
        </Modal>
      ) : null}
      {receipt ? (
        <Modal
          title={kind === 'menu' ? 'Pedido de ejemplo preparado' : 'Compra simulada completada'}
          onClose={() => setReceipt(null)}
        >
          <div className="success-mark">✓</div>
          <p className="receipt-text">
            Así se vería una confirmación para tu negocio. No se realizó ningún cobro ni se envió
            una orden real.
          </p>
          <div className="receipt-total">{money(receipt.total)}</div>
          <button
            className="demo-button full-width"
            onClick={() => {
              setReceipt(null);
              setTab('Pedidos');
            }}
          >
            Ver pedidos simulados →
          </button>
        </Modal>
      ) : null}
      {editor ? (
        <Modal
          title={editor.id ? 'Editar producto' : 'Nuevo producto'}
          onClose={() => setEditor(null)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const raw = values(e);
              if (
                await send({
                  type: 'product.save',
                  id: editor.id,
                  product: { ...raw, active: raw.active === 'on', symbol: editor.symbol || '◇' },
                })
              )
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
              <Field label="Precio MXN *">
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
              <Field label="Disponibles *">
                <input
                  name="stock"
                  type="number"
                  min="0"
                  max="100000"
                  step="1"
                  defaultValue={editor.stock ?? 20}
                  required
                />
              </Field>
              <input type="hidden" name="min" value="0" />
              <Field label="Descripción" full>
                <textarea
                  name="description"
                  defaultValue={editor.description || ''}
                  maxLength={250}
                />
              </Field>
              <label className="check-field">
                <input name="active" type="checkbox" defaultChecked={editor.active !== false} />{' '}
                Visible en el catálogo
              </label>
            </div>
            <button className="demo-button full-width" disabled={busy} type="submit">
              Guardar producto
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? (
        <Modal title="Eliminar producto de ejemplo" onClose={() => setDeleting(null)}>
          <p>
            Se eliminará «{deleting.name}» de tu demo. Puedes recuperar los ejemplos originales con
            Restablecer demo.
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
    </div>
  );
}
