import { CONTACT } from '../data/contact.ts';
import { ui, browserLocale } from '../i18n/messages.mjs';

export interface WhatsAppBrief {
  name: string;
  business?: string;
  project: string;
  goal: string;
  consent: boolean;
}

/** Builds a draft only: the visitor must send it inside WhatsApp. */
export function buildWhatsAppBrief(data: WhatsAppBrief, locale = browserLocale()) {
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
    ui('Hola, Altum. Me gustaría conversar sobre un proyecto.', locale),
    '',
    `${ui('Nombre:', locale)} ${name}`,
    ...(business ? [`${ui('Negocio o marca:', locale)} ${business}`] : []),
    `${ui('Tipo de proyecto:', locale)} ${project}`,
    '',
    ui('Mi idea:', locale),
    goal,
    '',
    ui('Acepto que Altum use estos datos para responder mi solicitud y dar seguimiento a mi proyecto.', locale),
    `${ui('Aviso de privacidad:', locale)} https://www.altumlapaz.com/${locale === 'en' ? 'en/' : ''}privacidad/#contacto`,
    ui('Origen: formulario de WhatsApp de Altum. No solicito una suscripción al newsletter.', locale),
  ].join('\n');
  const url = new URL(CONTACT.whatsapp);
  url.searchParams.set('text', message);
  return { message, url: url.href };
}
