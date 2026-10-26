const campaign = document.querySelector('#campaign');
const tone = document.querySelector('#tone');
const promptBox = document.querySelector('#prompt');
const results = document.querySelector('#results');
const errorBox = document.querySelector('#error');
const generateBtn = document.querySelector('#generate');

function selectedText(container) {
  return container.querySelector('.selected')?.textContent.trim() || '';
}
function setupPills(container) {
  container.addEventListener('click', event => {
    const button = event.target.closest('.pill');
    if (!button) return;
    container.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
    button.classList.add('selected');
  });
}
setupPills(campaign); setupPills(tone);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function renderVariants(variants) {
  results.innerHTML = `<div class="variant-grid">${variants.map((v, i) => `
    <article class="variant-card">
      <div class="variant-head"><h2>${escapeHtml(v.title)}</h2><span class="number">${i + 1}</span></div>
      <span class="angle">${escapeHtml(v.angle)}</span>
      <div class="variant-copy">${escapeHtml(v.content)}</div>
      <button class="copy-btn" data-copy="${i}">▢ Copy text</button>
    </article>`).join('')}<p class="footer-note">Choose a variant and copy it to your clipboard.</p></div>`;
  results.querySelectorAll('.copy-btn').forEach((button, i) => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(variants[i].content);
      button.textContent = '✓ Copied';
      setTimeout(() => button.textContent = '▢ Copy text', 1400);
    } catch {
      const area = document.createElement('textarea'); area.value = variants[i].content;
      document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
      button.textContent = '✓ Copied';
    }
  }));
}

generateBtn.addEventListener('click', async () => {
  errorBox.textContent = '';
  const prompt = promptBox.value.trim();
  if (!prompt) { errorBox.textContent = 'Please enter a prompt first.'; promptBox.focus(); return; }
  generateBtn.disabled = true; generateBtn.innerHTML = '<span>✦</span> Generating…';
  try {
    const response = await fetch('/api/generate', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        campaignType: selectedText(campaign), tone: selectedText(tone),
        limitSegments: document.querySelector('#limit').checked,
        includeEmoji: document.querySelector('#emoji').checked, prompt
      })
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Unable to generate variants.');
    renderVariants(data.variants);
  } catch (error) {
    errorBox.textContent = error.message || 'Could not connect to the server. Is Spring Boot running?';
  } finally {
    generateBtn.disabled = false; generateBtn.innerHTML = '<span>✦</span> Generate 3 variants';
  }
});
document.querySelector('#reset').addEventListener('click', () => {
  document.querySelectorAll('.pills').forEach((container, index) => {
    container.querySelectorAll('.pill').forEach((p, i) => p.classList.toggle('selected', i === 0));
  });
  document.querySelector('#limit').checked = true;
  document.querySelector('#emoji').checked = true;
  promptBox.value = '';
  errorBox.textContent = '';
  results.innerHTML = '<div class="empty"><div class="big-sparkle">✦</div><p>Set your options and prompt, then<br> generate 3 variants to compare side<br> by side.</p></div>';
});
