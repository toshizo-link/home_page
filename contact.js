document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitButton = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !status || !submitButton) {
    return;
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.style.display = message ? 'block' : 'none';
    status.classList.toggle('is-error', Boolean(isError));
  }

  const url = new URL(window.location.href);
  const initialMessage = url.searchParams.get('contact_message');
  const initialStatus = url.searchParams.get('contact_status');

  if (initialMessage) {
    setStatus(initialMessage, initialStatus === 'error');
    url.searchParams.delete('contact_message');
    url.searchParams.delete('contact_status');
    const cleanQuery = url.searchParams.toString();
    window.history.replaceState({}, '', url.pathname + (cleanQuery ? '?' + cleanQuery : '') + url.hash);
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      setStatus('未入力の項目があります。内容をご確認ください。', true);
      return;
    }

    const formData = new FormData(form);
    setStatus('送信中です...', false);
    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const payload = await response.json().catch(function () {
        return {
          ok: false,
          message: 'サーバーからの応答を読み取れませんでした。'
        };
      });

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || '送信に失敗しました。');
      }

      setStatus(payload.message || '送信が完了しました。', false);
      form.reset();
    } catch (error) {
      setStatus((error && error.message)
        ? error.message
        : '送信に失敗しました。general@toshizo.link へ直接ご連絡ください。', true);
    } finally {
      submitButton.disabled = false;
    }
  });
});
