import { solutions, services } from './catalog';

/** Shared choices keep email and WhatsApp briefs consistent. */
export const projectTypes = [
  { value: 'web', label: 'Página web profesional' },
  { value: 'app-web', label: 'Aplicación web / sistema a medida' },
  ...solutions.map((s) => ({ value: s.slug, label: s.label })),
  ...services.slice(6).map((s) => ({ value: s.slug, label: s.short })),
  { value: 'other', label: 'Otro proyecto / necesito orientación' },
];
