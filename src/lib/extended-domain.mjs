import { cents } from './business-domain.mjs';
export const ticketStages = ['Abierto', 'En atención', 'En espera', 'Resuelto'];
export const ticketCategories = ['Red y Wi-Fi', 'Software', 'Accesos', 'Equipo', 'Consulta'];
const text = (v, max = 120, optional = false) => {
  const s = String(v ?? '').trim();
  if ((!s && !optional) || s.length > max)
    throw Error(`Revisa el texto: máximo ${max} caracteres.`);
  return s;
};
const amount = (v, positive = false) => {
  const n = cents(v);
  if (n < 0 || n > 1000000000 || (positive && n === 0)) throw Error('Revisa el importe indicado.');
  return n / 100;
};
const date = (v) => {
  const s = String(v ?? '');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(s) ||
    !Number.isFinite(Date.parse(s)) ||
    new Date(s).toISOString().slice(0, 10) !== s
  )
    throw Error('Selecciona una fecha válida.');
  return s;
};
const choice = (v, values) => {
  if (!values.includes(v)) throw Error('Selecciona una opción válida.');
  return v;
};
const entity = (list, id) => {
  const item = list.find((i) => i.id === id);
  if (!item) throw Error('El registro ya no existe.');
  return item;
};
export function personalSummary(budget) {
  const income = cents(budget.income),
    expense = ['fixed', 'variable', 'debt'].reduce((sum, k) => sum + cents(budget[k]), 0);
  return { income: income / 100, expense: expense / 100, available: (income - expense) / 100 };
}
export function goalSummary(goal) {
  const saved = goal.contributions.reduce((n, c) => n + cents(c.amount), 0),
    target = cents(goal.target);
  return {
    saved: saved / 100,
    remaining: Math.max(0, target - saved) / 100,
    percent: Math.min(100, Math.round((saved / target) * 100)),
  };
}
export function extendedSeed(module, today) {
  if (module === 'personal')
    return {
      budget: { income: 24000, fixed: 11000, variable: 4500, debt: 1500 },
      goals: [
        {
          id: 'g1',
          name: 'Renovar mi equipo',
          target: 18000,
          monthly: 2000,
          date: `${Number(today.slice(0, 4)) + 1}-06-01`,
          contributions: [{ id: 'a1', amount: 3000, date: today, note: 'Aportación de ejemplo' }],
        },
        {
          id: 'g2',
          name: 'Proyecto personal',
          target: 10000,
          monthly: 1000,
          date: `${Number(today.slice(0, 4)) + 1}-04-01`,
          contributions: [
            { id: 'a2', amount: 1500, date: today, note: 'Primer ahorro de ejemplo' },
          ],
        },
      ],
    };
  if (module === 'soporte')
    return {
      nextNumber: 4,
      tickets: [
        {
          id: 't1',
          number: 1,
          subject: 'Señal débil en recepción',
          customer: 'Oficina Horizonte',
          category: 'Red y Wi-Fi',
          priority: 'Alta',
          assignee: 'Alex',
          due: today,
          status: 'Abierto',
          description: 'La conexión se interrumpe en la zona de recepción.',
          history: [
            { id: 'h1', date: today, status: 'Abierto', note: 'Solicitud registrada en la demo.' },
          ],
        },
        {
          id: 't2',
          number: 2,
          subject: 'Acceso al catálogo',
          customer: 'Comercial Brisa',
          category: 'Accesos',
          priority: 'Media',
          assignee: 'Sam',
          due: today,
          status: 'En atención',
          description: 'Revisar el acceso del equipo al catálogo interno.',
          history: [
            {
              id: 'h2',
              date: today,
              status: 'En atención',
              note: 'Se revisan los permisos de ejemplo.',
            },
          ],
        },
        {
          id: 't3',
          number: 3,
          subject: 'Actualizar datos de contacto',
          customer: 'Estudio Marea',
          category: 'Consulta',
          priority: 'Baja',
          assignee: 'Alex',
          due: today,
          status: 'Resuelto',
          description: 'Orientación para actualizar información del negocio.',
          history: [
            {
              id: 'h3',
              date: today,
              status: 'Resuelto',
              note: 'Se explicó el recorrido de edición.',
            },
          ],
        },
      ],
    };
  throw Error('Módulo desconocido.');
}
export function extendedTransition(module, current, action, today) {
  if (action.type === 'reset') return extendedSeed(module, today);
  const next = structuredClone(current),
    r = action.record ?? {};
  if (module === 'personal') {
    if (action.type === 'budget.save')
      next.budget = Object.fromEntries(
        ['income', 'fixed', 'variable', 'debt'].map((k) => [k, amount(r[k])]),
      );
    else if (action.type === 'goal.save') {
      const old = action.id ? entity(next.goals, action.id) : null;
      const goal = {
        id: old?.id ?? crypto.randomUUID(),
        name: text(r.name),
        target: amount(r.target, true),
        monthly: amount(r.monthly),
        date: date(r.date),
        contributions: old?.contributions ?? [],
      };
      if (goalSummary(goal).saved > goal.target)
        throw Error('La meta no puede ser menor que las aportaciones registradas.');
      if (old) next.goals[next.goals.indexOf(old)] = goal;
      else {
        if (next.goals.length >= 20) throw Error('La demo admite hasta 20 metas.');
        next.goals.push(goal);
      }
    } else if (action.type === 'goal.delete') {
      entity(next.goals, action.id);
      next.goals = next.goals.filter((g) => g.id !== action.id);
    } else if (action.type === 'contribution.save') {
      const goal = entity(next.goals, action.id),
        value = amount(r.amount, true);
      if (cents(value) > cents(goalSummary(goal).remaining))
        throw Error('La aportación supera el importe pendiente de la meta.');
      if (goal.contributions.length >= 50) throw Error('Límite de 50 aportaciones por meta.');
      goal.contributions.push({
        id: crypto.randomUUID(),
        amount: value,
        date: date(r.date),
        note: text(r.note, 250, true),
      });
    } else if (action.type === 'contribution.delete') {
      const goal = entity(next.goals, action.id);
      entity(goal.contributions, action.contributionId);
      goal.contributions = goal.contributions.filter((c) => c.id !== action.contributionId);
    } else throw Error('Acción no disponible.');
  } else if (module === 'soporte') {
    if (action.type === 'ticket.save') {
      const old = action.id ? entity(next.tickets, action.id) : null;
      const ticket = {
        id: old?.id ?? crypto.randomUUID(),
        number: old?.number ?? next.nextNumber++,
        subject: text(r.subject),
        customer: text(r.customer),
        category: choice(r.category, ticketCategories),
        priority: choice(r.priority, ['Alta', 'Media', 'Baja']),
        assignee: text(r.assignee),
        due: date(r.due),
        description: text(r.description, 1000),
        status: old?.status ?? 'Abierto',
        history: old?.history ?? [
          {
            id: crypto.randomUUID(),
            date: today,
            status: 'Abierto',
            note: 'Solicitud registrada.',
          },
        ],
      };
      if (old) next.tickets[next.tickets.indexOf(old)] = ticket;
      else {
        if (next.tickets.length >= 100) throw Error('La demo admite hasta 100 tickets.');
        next.tickets.unshift(ticket);
      }
    } else if (action.type === 'ticket.reply') {
      const ticket = entity(next.tickets, action.id);
      if (ticket.history.length >= 50) throw Error('Límite de 50 respuestas por ticket.');
      ticket.status = choice(r.status, ticketStages);
      ticket.history.push({
        id: crypto.randomUUID(),
        date: today,
        status: ticket.status,
        note: text(r.note, 1000),
      });
    } else if (action.type === 'ticket.delete') {
      entity(next.tickets, action.id);
      next.tickets = next.tickets.filter((t) => t.id !== action.id);
    } else throw Error('Acción no disponible.');
  } else throw Error('Módulo desconocido.');
  if (JSON.stringify(next).length > 60000)
    throw Error('La demo alcanzó su límite. Exporta y elimina algunos registros.');
  return next;
}
