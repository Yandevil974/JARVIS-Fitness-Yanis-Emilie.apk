const app = document.querySelector('#app');
const explanation = document.querySelector('#explanation');
const buttons = [...document.querySelectorAll('.switcher button')];
buttons.forEach(button => button.addEventListener('click', () => {
  const full = button.dataset.mode === 'full';
  app.className = `app-shell ${full ? 'full' : 'colors'}`;
  buttons.forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  explanation.textContent = full ? 'Habillage JARVIS complet, cadres rectangulaires et case « Charge de la série » en jaune.' : 'La disposition actuelle est conservée. Seules les couleurs s’inspirent de ta référence : bleu nuit, cyan, or et rouge.';
}));
let timeout;
const toast = document.querySelector('.toast');
document.querySelectorAll('.app-shell button').forEach(button => button.addEventListener('click', () => {
  toast.textContent = 'Maquette uniquement : aucune séance ni donnée n’est modifiée.';
  toast.classList.add('show'); clearTimeout(timeout); timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}));
