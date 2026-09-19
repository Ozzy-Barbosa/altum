/** Native POST and provider verification remain available without JavaScript. */
export function enhanceEmailForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-email-form]').forEach((form) => {
    if (form.dataset.enhanced) return;
    form.dataset.enhanced = 'true';
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    let submitting = false;
    let recovery: ReturnType<typeof setTimeout> | undefined;
    const restore = () => {
      submitting = false;
      if (button) button.disabled = false;
      form.removeAttribute('aria-busy');
      if (status) status.textContent = '';
      if (recovery) clearTimeout(recovery);
    };
    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input:not([type="hidden"]), textarea',
      )
      .forEach((input) => {
        if (['checkbox', 'radio'].includes(input.type)) return;
        input.addEventListener('input', () => input.setCustomValidity(''));
      });
    form.addEventListener('submit', (event) => {
      if (submitting) {
        event.preventDefault();
        return;
      }
      form
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'input[type="email"], input[type="text"], input:not([type]), textarea',
        )
        .forEach((input) => {
          input.value = input.value.trim();
          input.setCustomValidity(input.required && !input.value ? 'Completa este campo.' : '');
          if (input.minLength > 0 && input.value.length < input.minLength)
            input.setCustomValidity(`Escribe al menos ${input.minLength} caracteres.`);
        });
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }
      form.querySelectorAll<HTMLInputElement>('[data-submission-date]').forEach((input) => {
        input.value = new Date().toISOString();
      });
      submitting = true;
      if (button) button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      if (status) status.textContent = 'Abriendo la verificación de envío…';
      // Recover if interrupted navigation prevents the native POST.
      recovery = setTimeout(restore, 15000);
    });
    window.addEventListener('pageshow', restore);
  });
}
