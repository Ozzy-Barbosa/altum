import { ui } from '../../i18n/messages.mjs';
import { useState } from 'react';
import { searchDocuments } from '../../lib/demo-domain.mjs';
import { Empty, Field, Modal, values, type DemoProps } from './Shared';
export default function SearchDemo({ data, send, busy }: DemoProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [selected, setSelected] = useState<any>(null);
  const [editor, setEditor] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const results = searchDocuments(data.documents, query, category);
  return (
    <>
      <div className="demo-heading">
        <div>
          <span className="demo-eyebrow">{ui('BIBLIOTECA DE EJEMPLO')}</span>
          <h2>
            {ui('La respuesta ')}
            <br />
            {ui('está más cerca. ')}
          </h2>
          <p>{ui('Encuentra información en documentos y guías del negocio.')}</p>
        </div>
        <button className="demo-button" onClick={() => setEditor({})}>
          {ui('+ Nuevo documento ')}
        </button>
      </div>
      <label className="search-field large-search">
        <span aria-hidden="true">⌕</span>
        <input
          aria-label={ui('Buscar documentos')}
          placeholder={ui('Prueba con “envíos”, “cita” o “inventario”')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button aria-label={ui('Limpiar búsqueda')} onClick={() => setQuery('')}>
            ×
          </button>
        ) : null}
      </label>
      <div className="category-chips">
        {['Todas', ...new Set<string>(data.documents.map((d: any) => d.category))].map((c, index) => (
          <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {index === 0 ? ui(c) : c}
          </button>
        ))}
      </div>
      <p className="results-count" role="status">
        {results.length} {results.length === 1 ? ui('documento') : ui('documentos')} ·{' '}
        {query ? ui('Ordenados por relevancia') : ui('Explora la biblioteca')}
      </p>
      <div className="search-results">
        {results.map((d: any) => (
          <article key={d.id}>
            <div className="document-symbol" aria-hidden="true">
              ▤
            </div>
            <div className="result-main">
              <span className="pill">{d.category}</span>
              <h3>
                <button onClick={() => setSelected(d)}>{d.title}</button>
              </h3>
              <p>{d.body.length > 170 ? d.body.slice(0, 170) + '…' : d.body}</p>
              <div className="inline-actions">
                <button onClick={() => setSelected(d)}>{ui('Leer documento →')}</button>
                <button
                  aria-label={ui('Editar {value0}', undefined, { value0: d.title })}
                  onClick={() => setEditor(d)}
                >
                  {ui('Editar ')}
                </button>
                <button
                  aria-label={ui('Eliminar {value0}', undefined, { value0: d.title })}
                  onClick={() => setDeleting(d)}
                >
                  {ui('Eliminar ')}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!results.length ? (
        <Empty>
          {ui('No encontramos resultados. Prueba con menos palabras o cambia la categoría.')}
        </Empty>
      ) : null}
      {selected ? (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <span className="pill">{selected.category}</span>
          <p className="document-body">{selected.body}</p>
        </Modal>
      ) : null}
      {editor ? (
        <Modal
          title={editor.id ? ui('Editar documento') : ui('Nuevo documento')}
          onClose={() => setEditor(null)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await send({ type: 'document.save', id: editor.id, document: values(e) }))
                setEditor(null);
            }}
          >
            <div className="form-grid">
              <Field label={ui('Título *')} full>
                <input name="title" defaultValue={editor.title || ''} required maxLength={120} />
              </Field>
              <Field label={ui('Categoría *')} full>
                <input
                  name="category"
                  defaultValue={editor.category || 'Operación'}
                  required
                  maxLength={60}
                />
              </Field>
              <Field label={ui('Contenido de ejemplo *')} full>
                <textarea
                  name="body"
                  defaultValue={editor.body || ''}
                  required
                  maxLength={4000}
                  rows={7}
                />
              </Field>
            </div>
            <p className="demo-caption">
              {ui('Usa información ficticia; evita documentos privados.')}
            </p>
            <button className="demo-button full-width" disabled={busy} type="submit">
              {ui('Guardar documento ')}
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? (
        <Modal title={ui('Eliminar documento de ejemplo')} onClose={() => setDeleting(null)}>
          <p>
            {ui('Se eliminará «')}
            {deleting.title}
            {ui('» de la biblioteca de tu demo.')}
          </p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setDeleting(null)}>
              {ui('Cancelar ')}
            </button>
            <button
              className="demo-button danger"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'document.delete', id: deleting.id })) setDeleting(null);
              }}
            >
              {ui('Eliminar documento ')}
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
