export const money = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(value);
export const normalize = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
export const localDate = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mazatlan',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
export const id = () => crypto.randomUUID();
const product = (id, name, category, price, stock, min, description = '', symbol = '◇') => ({
  id,
  name,
  category,
  price,
  stock,
  min,
  description,
  symbol,
  active: true,
});
export function seed(module) {
  switch (module) {
    case 'menu':
      return {
        brand: 'Brisa Café',
        subtitle: 'Cocina de día · Café de especialidad',
        products: [
          product(
            'm1',
            'Toast de aguacate',
            'Desayunos',
            135,
            20,
            5,
            'Pan de masa madre, aguacate y tomate.',
            '🥑',
          ),
          product(
            'm2',
            'Chilaquiles de la casa',
            'Desayunos',
            165,
            15,
            5,
            'Salsa verde, crema y queso fresco.',
            '🍳',
          ),
          product(
            'm3',
            'Bowl de temporada',
            'Desayunos',
            125,
            12,
            4,
            'Fruta, yogur natural y granola.',
            '🥣',
          ),
          product(
            'm4',
            'Sándwich de pollo',
            'Comida',
            155,
            18,
            5,
            'Pollo, hojas verdes y aderezo de la casa.',
            '🥪',
          ),
          product(
            'm5',
            'Ensalada del jardín',
            'Comida',
            145,
            12,
            4,
            'Hojas verdes, tomate, semillas y vinagreta.',
            '🥗',
          ),
          product(
            'm6',
            'Latte de la casa',
            'Bebidas',
            65,
            50,
            10,
            'Espresso y leche, servido caliente.',
            '☕',
          ),
          product('m7', 'Matcha frío', 'Bebidas', 85, 30, 8, 'Té matcha con leche y hielo.', '🍵'),
          product(
            'm8',
            'Pan de chocolate',
            'Panadería',
            60,
            8,
            4,
            'Recién hecho para acompañar tu café.',
            '🥐',
          ),
        ],
        orders: [],
      };
    case 'commerce':
      return {
        brand: 'Costa Objetos',
        products: [
          product(
            'c1',
            'Bolsa Costa',
            'Accesorios',
            390,
            12,
            3,
            'Tela resistente, un básico para todos los días.',
            '◒',
          ),
          product(
            'c2',
            'Taza Arena',
            'Hogar',
            280,
            8,
            3,
            'Cerámica de acabado mate. Capacidad de 300 ml.',
            '◡',
          ),
          product(
            'c3',
            'Libreta Horizonte',
            'Papelería',
            190,
            20,
            5,
            '80 hojas sin rayas para nuevas ideas.',
            '▤',
          ),
          product(
            'c4',
            'Botella Marea',
            'Accesorios',
            450,
            6,
            2,
            'Acero inoxidable. Capacidad de 600 ml.',
            '◧',
          ),
          product(
            'c5',
            'Vela Brisa',
            'Hogar',
            320,
            10,
            3,
            'Aroma suave para acompañar tus espacios.',
            '▥',
          ),
          product(
            'c6',
            'Estuche Nube',
            'Accesorios',
            210,
            14,
            4,
            'Compacto y ligero, con cierre superior.',
            '▰',
          ),
        ],
        orders: [],
      };
    case 'agenda':
      return {
        brand: 'Estudio Serena',
        services: [
          { id: 's1', name: 'Corte y estilo', price: 280, duration: 60 },
          { id: 's2', name: 'Diseño de barba', price: 180, duration: 30 },
          { id: 's3', name: 'Ritual de cuidado', price: 420, duration: 90 },
        ],
        professionals: ['Alex', 'Daniela'],
        bookings: [],
      };
    case 'inventario':
      return {
        products: [
          product('i1', 'Café de especialidad 250 g', 'Café', 180, 24, 8),
          product('i2', 'Vaso térmico 350 ml', 'Accesorios', 290, 4, 6),
          product('i3', 'Filtro de papel · 40 pzas', 'Insumos', 95, 18, 5),
          product('i4', 'Jarabe de vainilla 750 ml', 'Insumos', 210, 3, 5),
          product('i5', 'Prensa francesa', 'Accesorios', 420, 9, 3),
          product('i6', 'Café descafeinado 250 g', 'Café', 195, 12, 4),
        ],
        movements: [],
      };
    case 'proyectos':
      return {
        tasks: [
          {
            id: 't1',
            title: 'Confirmar fotografías del catálogo',
            project: 'Lanzamiento Costa',
            assignee: 'Marina',
            due: '',
            status: 'Pendiente',
          },
          {
            id: 't2',
            title: 'Revisar propuesta de portada',
            project: 'Lanzamiento Costa',
            assignee: 'Alex',
            due: '',
            status: 'En proceso',
          },
          {
            id: 't3',
            title: 'Organizar los servicios',
            project: 'Estudio Serena',
            assignee: 'Daniela',
            due: '',
            status: 'Terminado',
          },
          {
            id: 't4',
            title: 'Preparar primera presentación',
            project: 'Estudio Serena',
            assignee: 'Alex',
            due: '',
            status: 'Pendiente',
          },
        ],
      };
    case 'search':
      return {
        documents: [
          {
            id: 'd1',
            title: 'Cómo reservar una cita',
            category: 'Servicios',
            body: 'Selecciona el servicio, un profesional y un horario disponible. Confirma tu cita y conserva el folio. En esta demostración puedes cancelar desde Mis citas.',
          },
          {
            id: 'd2',
            title: 'Cambios y devoluciones',
            category: 'Políticas',
            body: 'Política ficticia de la tienda de ejemplo: se aceptan solicitudes de cambio dentro de los primeros 15 días. Presenta el folio del pedido y conserva el producto en su empaque.',
          },
          {
            id: 'd3',
            title: 'Envíos y entregas en La Paz',
            category: 'Operación',
            body: 'En la tienda de muestra puedes elegir entrega local o recoger en sucursal. El envío demostrativo cuesta 80 pesos y es gratuito a partir de 1000 pesos. No se realizan entregas reales.',
          },
          {
            id: 'd4',
            title: 'Actualizar un precio en el menú',
            category: 'Operación',
            body: 'Abre la vista Administrar del menú digital. Selecciona el producto y edita su nombre, categoría y precio. También puedes cambiar su disponibilidad.',
          },
          {
            id: 'd5',
            title: 'Registrar entradas de inventario',
            category: 'Operación',
            body: 'En Inventario selecciona Movimiento, el producto y Entrada. Escribe la cantidad y un motivo. El sistema actualiza las existencias y conserva un historial de los movimientos.',
          },
          {
            id: 'd6',
            title: 'Servicios de Altum',
            category: 'Servicios',
            body: 'Altum desarrolla páginas web, tiendas en línea, aplicaciones, menús digitales, agendas y sistemas de inventario para negocios de La Paz, Baja California Sur.',
          },
        ],
      };
    default:
      throw new Error('Módulo no válido');
  }
}
const text = (v, label, max = 120) => {
  const s = String(v ?? '').trim();
  if (!s || s.length > max) throw new Error(`${label}: escribe entre 1 y ${max} caracteres.`);
  return s;
};
const num = (v, label, min = 0, max = 1000000) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max)
    throw new Error(`${label}: utiliza un número entre ${min} y ${max}.`);
  return n;
};
const integer = (v, label, min = 0) => {
  const n = num(v, label, min, 100000);
  if (!Number.isInteger(n)) throw new Error(`${label}: utiliza un número entero.`);
  return n;
};
export function productInput(raw) {
  return {
    name: text(raw.name, 'Nombre'),
    category: text(raw.category, 'Categoría', 60),
    price: Math.round(num(raw.price, 'Precio') * 100) / 100,
    stock: integer(raw.stock, 'Existencias'),
    min: integer(raw.min, 'Mínimo'),
    description: String(raw.description ?? '')
      .trim()
      .slice(0, 250),
    active: raw.active !== false,
    symbol: raw.symbol || '◇',
  };
}
export function totals(products, cart, delivery = 'recoger') {
  const lines = Object.entries(cart)
    .filter(([, q]) => Number(q) > 0)
    .map(([pid, q]) => {
      const p = products.find((p) => p.id === pid);
      if (!p || !p.active)
        throw new Error('Un producto ya no está disponible. Actualiza tu selección.');
      const quantity = integer(q, 'Cantidad', 1);
      if (quantity > p.stock) throw new Error(`Solo hay ${p.stock} unidades de ${p.name}.`);
      return { id: p.id, name: p.name, price: p.price, quantity };
    });
  const subtotal = Math.round(lines.reduce((sum, p) => sum + p.price * p.quantity, 0) * 100) / 100;
  const shipping = delivery === 'envio' && subtotal > 0 && subtotal < 1000 ? 80 : 0;
  return { lines, subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 };
}
export function overlaps(bookings, professional, date, time, duration) {
  const start = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  return bookings.some(
    (b) =>
      b.status !== 'Cancelada' &&
      b.professional === professional &&
      b.date === date &&
      start < b.start + b.duration &&
      start + duration > b.start,
  );
}
export function slots(state, serviceId, professional, date) {
  const service = state.services.find((s) => s.id === serviceId);
  if (!service || !date || date < localDate()) return [];
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Mazatlan',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
  const nowMinutes = Number(parts.slice(0, 2)) * 60 + Number(parts.slice(3));
  return Array.from({ length: 18 }, (_, i) => 540 + i * 30)
    .filter(
      (start) => start + service.duration <= 1080 && (date !== localDate() || start > nowMinutes),
    )
    .map(
      (start) =>
        `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`,
    )
    .filter((time) => !overlaps(state.bookings, professional, date, time, service.duration));
}
export function searchDocuments(documents, query, category = 'Todas') {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return documents
    .filter((d) => category === 'Todas' || d.category === category)
    .map((d) => {
      const title = normalize(d.title),
        body = normalize(d.body);
      const matches = words.every((w) => title.includes(w) || body.includes(w));
      return {
        ...d,
        score: words.reduce(
          (score, w) => score + (title.includes(w) ? 4 : 0) + (body.includes(w) ? 1 : 0),
          0,
        ),
        matches,
      };
    })
    .filter((d) => !words.length || d.matches)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'));
}
export function transition(module, current, action) {
  const state = structuredClone(current),
    a = action;
  if (a.type === 'reset') return seed(module);
  if (a.type === 'product.save') {
    const p = productInput(a.product);
    if (!state.products) throw new Error('Este módulo no tiene productos.');
    if (a.id) {
      const index = state.products.findIndex((p) => p.id === a.id);
      if (index < 0) throw new Error('Producto no encontrado.');
      state.products[index] = { ...state.products[index], ...p };
    } else {
      if (state.products.length >= 100) throw new Error('La demo admite hasta 100 productos.');
      state.products.push({ ...p, id: a.newId || id() });
    }
  } else if (a.type === 'product.delete') {
    state.products = state.products.filter((p) => p.id !== a.id);
  } else if (a.type === 'stock.move') {
    const p = state.products.find((p) => p.id === a.id);
    if (!p) throw new Error('Producto no encontrado.');
    const quantity = integer(a.quantity, 'Cantidad', 1);
    if (!['Entrada', 'Salida'].includes(a.direction)) throw new Error('Movimiento no válido.');
    const change = a.direction === 'Salida' ? -quantity : quantity;
    if (p.stock + change < 0) throw new Error('No hay existencias suficientes para esa salida.');
    p.stock += change;
    state.movements.unshift({
      id: a.newId || id(),
      product: p.name,
      quantity: change,
      reason: text(a.reason, 'Motivo', 180),
      at: a.at || new Date().toISOString(),
    });
    state.movements = state.movements.slice(0, 100);
  } else if (a.type === 'order.create') {
    const order = totals(state.products, a.cart, a.delivery);
    if (!order.lines.length) throw new Error('Agrega al menos un producto.');
    for (const line of order.lines)
      state.products.find((p) => p.id === line.id).stock -= line.quantity;
    state.orders.unshift({
      ...order,
      id: a.newId || id(),
      delivery: a.delivery === 'envio' ? 'Entrega local' : 'Recoger',
      at: a.at || new Date().toISOString(),
      status: 'Simulado',
    });
    state.orders = state.orders.slice(0, 50);
  } else if (a.type === 'booking.create') {
    const service = state.services.find((s) => s.id === a.serviceId);
    if (!service || !state.professionals.includes(a.professional))
      throw new Error('Elige un servicio y un profesional.');
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(a.date) ||
      !slots(state, a.serviceId, a.professional, a.date).includes(a.time)
    )
      throw new Error('El horario ya no está disponible. Elige otro.');
    if (state.bookings.length >= 100) throw new Error('La demo admite hasta 100 citas.');
    const start = Number(a.time.slice(0, 2)) * 60 + Number(a.time.slice(3));
    state.bookings.unshift({
      id: a.newId || id(),
      service: service.name,
      professional: a.professional,
      date: a.date,
      time: a.time,
      start,
      duration: service.duration,
      price: service.price,
      name: text(a.name, 'Nombre de ejemplo', 80),
      status: 'Confirmada',
    });
  } else if (a.type === 'booking.cancel') {
    const b = state.bookings.find((b) => b.id === a.id);
    if (!b) throw new Error('Cita no encontrada.');
    b.status = 'Cancelada';
  } else if (a.type === 'task.save') {
    const task = {
      title: text(a.task.title, 'Tarea'),
      project: text(a.task.project, 'Proyecto', 80),
      assignee: text(a.task.assignee, 'Responsable', 80),
      due: String(a.task.due || ''),
      status: a.task.status || 'Pendiente',
    };
    if (!['Pendiente', 'En proceso', 'Terminado'].includes(task.status))
      throw new Error('Estado no válido.');
    if (task.due && !/^\d{4}-\d{2}-\d{2}$/.test(task.due)) throw new Error('Fecha no válida.');
    if (a.id) {
      const index = state.tasks.findIndex((t) => t.id === a.id);
      if (index < 0) throw new Error('Tarea no encontrada.');
      state.tasks[index] = { id: a.id, ...task };
    } else {
      if (state.tasks.length >= 100) throw new Error('La demo admite hasta 100 tareas.');
      state.tasks.push({ id: a.newId || id(), ...task });
    }
  } else if (a.type === 'task.move') {
    const task = state.tasks.find((t) => t.id === a.id);
    if (!task || !['Pendiente', 'En proceso', 'Terminado'].includes(a.status))
      throw new Error('Tarea o estado no válido.');
    task.status = a.status;
  } else if (a.type === 'task.delete') {
    state.tasks = state.tasks.filter((t) => t.id !== a.id);
  } else if (a.type === 'document.save') {
    const doc = {
      title: text(a.document.title, 'Título'),
      category: text(a.document.category, 'Categoría', 60),
      body: text(a.document.body, 'Contenido', 4000),
    };
    if (a.id) {
      const index = state.documents.findIndex((d) => d.id === a.id);
      if (index < 0) throw new Error('Documento no encontrado.');
      state.documents[index] = { id: a.id, ...doc };
    } else {
      if (state.documents.length >= 50) throw new Error('La demo admite hasta 50 documentos.');
      state.documents.push({ id: a.newId || id(), ...doc });
    }
  } else if (a.type === 'document.delete') {
    state.documents = state.documents.filter((d) => d.id !== a.id);
  } else throw new Error('Acción no válida.');
  if (JSON.stringify(state).length > 60000)
    throw new Error(
      'Esta demo alcanzó su espacio disponible. Elimina algunos registros o restablécela.',
    );
  return state;
}
