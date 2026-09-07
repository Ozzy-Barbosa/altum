import { Field, Modal, values, type Dispatch } from './Shared';
export type RecordData = Record<string, any>;
export type FieldSpec = {
  name: string;
  label: string;
  type?: string;
  options?: readonly string[];
  required?: boolean;
  full?: boolean;
  maxLength?: number;
};
export function RecordEditor({
  title,
  record,
  fields,
  entity,
  send,
  busy,
  close,
}: {
  title: string;
  record: RecordData;
  fields: FieldSpec[];
  entity: string;
  send: Dispatch;
  busy: boolean;
  close: () => void;
}) {
  return (
    <Modal title={title} onClose={close}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (await send({ type: `${entity}.save`, id: record.id, record: values(e) })) close();
        }}
      >
        <div className="form-grid">
          {fields.map((f) => (
            <Field key={f.name} label={f.label} full={f.full}>
              {f.options ? (
                <select name={f.name} defaultValue={record[f.name] ?? f.options[0]}>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  name={f.name}
                  defaultValue={record[f.name] ?? ''}
                  maxLength={f.maxLength ?? 500}
                  required={f.required !== false}
                  rows={3}
                />
              ) : (
                <input
                  name={f.name}
                  type={f.type ?? 'text'}
                  defaultValue={record[f.name] ?? ''}
                  required={f.required !== false}
                  maxLength={f.maxLength ?? 120}
                  min={f.type === 'number' ? '0' : undefined}
                  max={f.type === 'number' ? '10000000' : undefined}
                  step={f.type === 'number' ? '.01' : undefined}
                />
              )}
            </Field>
          ))}
        </div>
        <div className="modal-actions">
          <button className="demo-button secondary" type="button" onClick={close}>
            Cancelar
          </button>
          <button className="demo-button" disabled={busy}>
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function DeleteRecord({
  name,
  entity,
  record,
  send,
  busy,
  close,
}: {
  name: string;
  entity: string;
  record: RecordData;
  send: Dispatch;
  busy: boolean;
  close: () => void;
}) {
  return (
    <Modal title="Eliminar registro" onClose={close}>
      <p>Se eliminará «{name}» de esta demostración. Esta acción no se puede deshacer.</p>
      <div className="modal-actions">
        <button className="demo-button secondary" onClick={close}>
          Conservar
        </button>
        <button
          className="demo-button"
          disabled={busy}
          onClick={async () => {
            if (await send({ type: `${entity}.delete`, id: record.id })) close();
          }}
        >
          Eliminar registro
        </button>
      </div>
    </Modal>
  );
}
export const folio = (prefix: string, number: number) =>
  `${prefix}-${String(number).padStart(4, '0')}`;
