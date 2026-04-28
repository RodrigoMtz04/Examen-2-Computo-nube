const form = document.getElementById('form');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const buySection = document.getElementById('buySection');
const buyForm = document.getElementById('buyForm');
const buyMsg = document.getElementById('buyMsg');

let lastRecommendation = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  buyMsg.textContent = '';

  const data = Object.fromEntries(new FormData(form).entries());

  const resp = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await resp.json();
  if (!resp.ok) {
    result.hidden = false;
    buySection.hidden = true;
    resultText.innerHTML = `<p class="error">Error: ${json.error ?? 'Solicitud inválida'}</p>`;
    return;
  }

  lastRecommendation = json;
  const p100 = (json.probabilities.i100 * 100).toFixed(2);
  const p500 = (json.probabilities.i500 * 100).toFixed(2);

  result.hidden = false;
  buySection.hidden = false;
  resultText.innerHTML = `
    <p>Recomendación: <b>${json.recommended}</b></p>
    <p>Prob(i100): <b>${p100}%</b> — Prob(i500): <b>${p500}%</b></p>
  `;
});

buyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!lastRecommendation) return;

  const cust = Object.fromEntries(new FormData(buyForm).entries());

  const payload = {
    customer: {
      nombre: cust.nombre,
      email: cust.email,
      telefono: cust.telefono || null,
    },
    answers: lastRecommendation.input,
    recommended: lastRecommendation.recommended,
  };

  const resp = await fetch('/api/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await resp.json();
  if (!resp.ok) {
    buyMsg.textContent = `Error: ${json.error ?? 'No se pudo comprar'}`;
    return;
  }

  buyMsg.textContent = `Compra guardada. ID = ${json.purchaseId}`;
  buyForm.reset();
});

