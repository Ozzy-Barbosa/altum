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
          <span className="demo-eyebrow">BIBLIOTECA DE EJEMPLO</span>
          <h2>
            La respuesta
            <br />
            está más cerca.
          </h2>
          <p>Encuentra información en documentos y guías del negocio.</p>
        </div>
        <button className="demo-button" onClick={() => setEditor({})}>
          + Nuevo documento
        </button>
      </div>
      <label className="search-field large-search">
        <span aria-hidden="true">⌕</span>
        <input
          aria-label="Buscar documentos"
          placeholder="Prueba con “envíos”, “cita” o “inventario”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}>
            ×
          </button>
        ) : null}
      </label>
      <div className="category-chips">
        {['Todas', ...new Set<string>(data.documents.map((d: any) => d.category))].map((c) => (
          <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="results-count" role="status">
        {results.length} {results.length === 1 ? 'documento' : 'documentos'} ·{' '}
        {query ? 'Ordenados por relevancia' : 'Explora la biblioteca'}
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
                <button onClick={() => setSelected(d)}>Leer documento →</button>
                <button aria-label={`Editar ${d.title}`} onClick={() => setEditor(d)}>
                  Editar
                </button>
                <button aria-label={`Eliminar ${d.title}`} onClick={() => setDeleting(d)}>
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!results.length ? (
        <Empty>No encontramos resultados. Prueba con menos palabras o cambia la categoría.</Empty>
      ) : null}
      {selected ? (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <span className="pill">{selected.category}</span>
          <p className="document-body">{selected.body}</p>
        </Modal>
      ) : null}
      {editor ? (
        <Modal
          title={editor.id ? 'Editar documento' : 'Nuevo documento'}
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
              <Field label="Título *" full>
                <input name="title" defaultValue={editor.title || ''} required maxLength={120} />
              </Field>
              <Field label="Categoría *" full>
                <input
                  name="category"
                  defaultValue={editor.category || 'Operación'}
                  required
                  maxLength={60}
                />
              </Field>
              <Field label="Contenido de ejemplo *" full>
                <textarea
                  name="body"
                  defaultValue={editor.body || ''}
                  required
                  maxLength={4000}
                  rows={7}
                />
              </Field>
            </div>
            <p className="demo-caption">Usa información ficticia; evita documentos privados.</p>
            <button className="demo-button full-width" disabled={busy} type="submit">
              Guardar documento
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? (
        <Modal title="Eliminar documento de ejemplo" onClose={() => setDeleting(null)}>
          <p>Se eliminará «{deleting.title}» de la biblioteca de tu demo.</p>
          <div className="modal-actions">
            <button className="demo-button secondary" onClick={() => setDeleting(null)}>
              Cancelar
            </button>
            <button
              className="demo-button danger"
              disabled={busy}
              onClick={async () => {
                if (await send({ type: 'document.delete', id: deleting.id })) setDeleting(null);
              }}
            >
              Eliminar documento
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
