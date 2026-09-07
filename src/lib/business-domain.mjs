export const businessModules = ['finanzas', 'crm', 'cotizaciones', 'servicios'];
export const expenseCategories = [
  'Materiales',
  'Renta',
  'Servicios',
  'Marketing',
  'Equipo',
  'Otros',
];
export const leadStages = ['Nuevo', 'Contactado', 'Propuesta', 'Ganado', 'Perdido'];
export const quoteStages = ['Borrador', 'Enviada', 'Aceptada', 'Rechazada'];
export const jobStages = ['Recibida', 'Diagnóstico', 'En reparación', 'Lista', 'Entregada'];
const text = (v, label, max = 120) => {
  const value = String(v ?? '').trim();
  if (!value || value.length > max)
    throw new Error(`${label}: escribe entre 1 y ${max} caracteres.`);
  return value;
};
const optional = (v, max = 500) =>
  String(v ?? '')
    .trim()
    .slice(0, max);
const choice = (v, options) => {
  if (!options.includes(v)) throw new Error('Selecciona una opción válida.');
  return v;
};
export const cents = (v) => {
  if (
    String(v).trim() === '' ||
    !Number.isFinite(Number(v)) ||
    Number(v) < 0 ||
    Number(v) > 10000000
  )
    throw new Error('Importe: utiliza un número entre 0 y 10,000,000.');
  return Math.round((Number(v) + Number.EPSILON) * 100);
};
const date = (v) => {
  const value = String(v ?? '');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    throw new Error('Utiliza una fecha válida.');
  return value;
};
export function quoteTotals(lines, discount = 0) {
  if (!Array.isArray(lines) || !lines.length || lines.length > 30)
    throw new Error('Agrega de 1 a 30 conceptos.');
  const rate = Number(discount);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100)
    throw new Error('Descuento: utiliza un porcentaje entre 0 y 100.');
  const subtotal = lines.reduce((sum, line) => {
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000)
      throw new Error('Cantidad: utiliza un entero entre 1 y 10,000.');
    return sum + cents(line.price) * quantity;
  }, 0);
  if (subtotal > 1000000000) throw new Error('El total excede el límite de esta demo.');
  const reduction = Math.round((subtotal * rate) / 100);
  return {
    subtotal: subtotal / 100,
    discount: reduction / 100,
    total: (subtotal - reduction) / 100,
  };
}
export function financeSummary(transactions, month) {
  const filtered = transactions.filter((t) => t.date.slice(0, 7) === month);
  const income = filtered
    .filter((t) => t.kind === 'Ingreso')
    .reduce((sum, t) => sum + cents(t.amount), 0);
  const expense = filtered
    .filter((t) => t.kind === 'Gasto')
    .reduce((sum, t) => sum + cents(t.amount), 0);
  return { income: income / 100, expense: expense / 100, net: (income - expense) / 100 };
}
export function businessSeed(module, today) {
  const month = today.slice(0, 7),
    d = (n) => `${month}-${String(n).padStart(2, '0')}`;
  if (module === 'finanzas')
    return {
      transactions: [
        {
          id: 'f1',
          concept: 'Servicios de mantenimiento',
          kind: 'Ingreso',
          category: 'Servicios',
          amount: 12800,
          date: d(1),
        },
        {
          id: 'f2',
          concept: 'Renta del taller',
          kind: 'Gasto',
          category: 'Renta',
          amount: 4200,
          date: d(1),
        },
        {
          id: 'f3',
          concept: 'Materiales de instalación',
          kind: 'Gasto',
          category: 'Materiales',
          amount: 1860.5,
          date: d(2),
        },
        {
          id: 'f4',
          concept: 'Instalación de equipo',
          kind: 'Ingreso',
          category: 'Servicios',
          amount: 6400,
          date: d(3),
        },
        {
          id: 'f5',
          concept: 'Campaña de temporada',
          kind: 'Gasto',
          category: 'Marketing',
          amount: 950,
          date: d(4),
        },
        {
          id: 'f6',
          concept: 'Conexión de internet',
          kind: 'Gasto',
          category: 'Servicios',
          amount: 599,
          date: d(5),
        },
      ],
      budgets: {
        Materiales: 4000,
        Renta: 4200,
        Servicios: 1500,
        Marketing: 1500,
        Equipo: 2500,
        Otros: 1000,
      },
    };
  if (module === 'crm')
    return {
      leads: [
        {
          id: 'l1',
          company: 'Café Horizonte · ejemplo',
          contact: 'Marina',
          interest: 'Menú digital',
          value: 4500,
          stage: 'Propuesta',
          followup: today,
          notes: 'Mostrar categorías y actualización de precios.',
        },
        {
          id: 'l2',
          company: 'Estudio Nube · ejemplo',
          contact: 'Daniel',
          interest: 'Agenda de servicios',
          value: 8900,
          stage: 'Contactado',
          followup: today,
          notes: 'Preparar demostración de reservas.',
        },
        {
          id: 'l3',
          company: 'Taller Norte · ejemplo',
          contact: 'Alex',
          interest: 'Control de inventario',
          value: 12500,
          stage: 'Nuevo',
          followup: today,
          notes: 'Conocer su proceso de entradas y salidas.',
        },
        {
          id: 'l4',
          company: 'Casa Lino · ejemplo',
          contact: 'Sofía',
          interest: 'Tienda digital',
          value: 16000,
          stage: 'Ganado',
          followup: '',
          notes: 'Proyecto simulado para explorar el flujo comercial.',
        },
      ],
    };
  if (module === 'cotizaciones')
    return {
      nextNumber: 3,
      quotes: [
        {
          id: 'q1',
          number: 1,
          customer: 'Café Horizonte · ejemplo',
          title: 'Mantenimiento de equipos',
          date: today,
          validUntil: '',
          status: 'Borrador',
          discount: 0,
          notes: 'Incluye revisión y limpieza. Refacciones por separado.',
          lines: [
            { description: 'Servicio preventivo', quantity: 2, price: 850 },
            { description: 'Materiales de limpieza', quantity: 1, price: 280 },
          ],
        },
        {
          id: 'q2',
          number: 2,
          customer: 'Estudio Nube · ejemplo',
          title: 'Instalación de red',
          date: today,
          validUntil: '',
          status: 'Aceptada',
          discount: 5,
          notes: 'Documento de demostración. No válido como comprobante fiscal.',
          lines: [
            { description: 'Instalación y configuración', quantity: 1, price: 2400 },
            { description: 'Punto de red', quantity: 3, price: 450 },
          ],
        },
      ],
    };
  if (module === 'servicios')
    return {
      nextNumber: 4,
      jobs: [
        {
          id: 'j1',
          number: 1,
          customer: 'Café Horizonte · ejemplo',
          equipment: 'Equipo de refrigeración',
          issue: 'Revisión preventiva y limpieza de filtros.',
          assignee: 'Alex',
          date: today,
          priority: 'Normal',
          status: 'Diagnóstico',
          notes: '',
          history: [
            { status: 'Recibida', at: today, note: 'Equipo recibido.' },
            { status: 'Diagnóstico', at: today, note: 'Revisión inicial.' },
          ],
        },
        {
          id: 'j2',
          number: 2,
          customer: 'Oficina Marea · ejemplo',
          equipment: 'Red de oficina',
          issue: 'Conexión intermitente en recepción.',
          assignee: 'Marina',
          date: today,
          priority: 'Alta',
          status: 'Recibida',
          notes: '',
          history: [{ status: 'Recibida', at: today, note: 'Visita programada.' }],
        },
        {
          id: 'j3',
          number: 3,
          customer: 'Casa Lino · ejemplo',
          equipment: 'Impresora de etiquetas',
          issue: 'Calibración y prueba de impresión.',
          assignee: 'Alex',
          date: today,
          priority: 'Normal',
          status: 'Lista',
          notes: '',
          history: [
            { status: 'Recibida', at: today, note: 'Equipo recibido.' },
            { status: 'Lista', at: today, note: 'Prueba satisfactoria. Pendiente de entrega.' },
          ],
        },
      ],
    };
  throw new Error('Módulo desconocido.');
}
export function businessTransition(module, current, action, today) {
  if (action.type === 'reset') return businessSeed(module, today);
  const state = structuredClone(current);
  const definition = {
    finanzas: ['transactions', 'transaction'],
    crm: ['leads', 'lead'],
    cotizaciones: ['quotes', 'quote'],
    servicios: ['jobs', 'job'],
  }[module];
  if (!definition) throw new Error('Módulo desconocido.');
  const [collection, entity] = definition;
  const items = state[collection];
  const index = items.findIndex((item) => item.id === action.id);
  if (module === 'finanzas' && action.type === 'budget.save') {
    state.budgets[choice(action.category, expenseCategories)] = cents(action.amount) / 100;
  } else if (action.type === `${entity}.delete`) {
    if (index < 0) throw new Error('Este registro ya no existe.');
    items.splice(index, 1);
  } else if (action.type === `${entity}.save`) {
    if (action.id && index < 0) throw new Error('Este registro ya no existe.');
    const raw = action.record || {};
    let item;
    if (module === 'finanzas') {
      const amount = cents(raw.amount) / 100;
      if (amount <= 0) throw new Error('El importe debe ser mayor a cero.');
      item = {
        concept: text(raw.concept, 'Concepto'),
        kind: choice(raw.kind, ['Ingreso', 'Gasto']),
        category: choice(raw.category, expenseCategories),
        amount,
        date: date(raw.date),
      };
    } else if (module === 'crm') {
      item = {
        company: text(raw.company, 'Negocio'),
        contact: text(raw.contact, 'Contacto', 80),
        interest: text(raw.interest, 'Interés'),
        value: cents(raw.value) / 100,
        stage: choice(raw.stage, leadStages),
        followup: raw.followup ? date(raw.followup) : '',
        notes: optional(raw.notes),
      };
    } else if (module === 'cotizaciones') {
      quoteTotals(raw.lines, raw.discount);
      const created = date(raw.date),
        expires = raw.validUntil ? date(raw.validUntil) : '';
      if (expires && expires < created)
        throw new Error('La vigencia debe ser igual o posterior a la fecha de emisión.');
      item = {
        number: index >= 0 ? items[index].number : state.nextNumber++,
        customer: text(raw.customer, 'Cliente'),
        title: text(raw.title, 'Proyecto'),
        date: created,
        validUntil: expires,
        status: choice(raw.status, quoteStages),
        discount: Number(raw.discount),
        notes: optional(raw.notes),
        lines: raw.lines.map((line) => ({
          description: text(line.description, 'Descripción', 180),
          quantity: Number(line.quantity),
          price: cents(line.price) / 100,
        })),
      };
    } else {
      item = {
        number: index >= 0 ? items[index].number : state.nextNumber++,
        customer: text(raw.customer, 'Cliente'),
        equipment: text(raw.equipment, 'Equipo o servicio'),
        issue: text(raw.issue, 'Trabajo solicitado', 500),
        assignee: text(raw.assignee, 'Responsable', 80),
        date: date(raw.date),
        priority: choice(raw.priority, ['Normal', 'Alta', 'Urgente']),
        status: index >= 0 ? items[index].status : 'Recibida',
        notes: optional(raw.notes),
        history:
          index >= 0
            ? items[index].history
            : [{ status: 'Recibida', at: today, note: 'Orden creada.' }],
      };
    }
    item.id = action.id || crypto.randomUUID();
    if (index >= 0) items[index] = item;
    else {
      if (items.length >= 150)
        throw new Error('Esta demo admite hasta 150 registros. Elimina ejemplos o restablécela.');
      items.unshift(item);
    }
  } else if (action.type === `${entity}.stage` && module !== 'finanzas') {
    if (index < 0) throw new Error('Este registro ya no existe.');
    const stage = choice(
      action.stage,
      module === 'crm' ? leadStages : module === 'cotizaciones' ? quoteStages : jobStages,
    );
    if (module === 'crm') items[index].stage = stage;
    else if (module === 'servicios' && stage !== items[index].status) {
      if (items[index].history.length >= 60)
        throw new Error('Esta orden alcanzó el límite de actualizaciones de la demo.');
      items[index].history.push({
        status: stage,
        at: today,
        note: optional(action.note, 250) || 'Estado actualizado.',
      });
      items[index].status = stage;
    } else items[index].status = stage;
  } else throw new Error('Acción no disponible.');
  if (JSON.stringify(state).length > 60000)
    throw new Error('La demo alcanzó su límite de espacio. Elimina ejemplos o restablécela.');
  return state;
}
