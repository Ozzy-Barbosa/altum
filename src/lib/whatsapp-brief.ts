import { CONTACT } from '../data/contact.ts';

export interface WhatsAppBrief {
  name: string;
  business?: string;
  project: string;
  goal: string;
  consent: boolean;
}

/** Builds a draft only: the visitor must send it inside WhatsApp. */
export function buildWhatsAppBrief(data: WhatsAppBrief) {
  const name = data.name.trim();
  const business = data.business?.trim() || '';
  const project = data.project.trim();
  const goal = data.goal.trim();
  if (!name || name.length > 80) throw new Error('Escribe tu nombre (máximo 80 caracteres).');
  if (!project || project.length > 150) throw new Error('Elige un tipo de proyecto.');
  if (business.length > 100)
    throw new Error('El nombre de tu negocio debe tener hasta 100 caracteres.');
  if (goal.length < 15 || goal.length > 1000)
    throw new Error('Describe tu idea entre 15 y 1,000 caracteres.');
  if (!data.consent) throw new Error('Confirma el consentimiento para atender tu solicitud.');
  const message = [
    'Hola, Altum. Me gustaría conversar sobre un proyecto.',
    '',
    `Nombre: ${name}`,
    ...(business ? [`Negocio o marca: ${business}`] : []),
    `Tipo de proyecto: ${project}`,
    '',
    'Mi idea:',
    goal,
    '',
    'Acepto que Altum use estos datos para responder mi solicitud y dar seguimiento a mi proyecto.',
    'Aviso de privacidad: https://www.altumlapaz.com/privacidad/#contacto',
    'Origen: formulario de WhatsApp de Altum. No solicito una suscripción al newsletter.',
  ].join('\n');
  const url = new URL(CONTACT.whatsapp);
  url.searchParams.set('text', message);
  return { message, url: url.href };
}
