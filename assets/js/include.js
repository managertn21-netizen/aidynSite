
document.addEventListener("DOMContentLoaded", async () => {
  const slots = document.querySelectorAll("[data-include]");
  for (const el of slots) {
    const name = el.getAttribute("data-include");
    try{
      const res = await fetch(`/partials/${name}.html`);
      const html = await res.text();
      el.innerHTML = html;
    }catch(e){
      el.innerHTML = `<div style="padding:10px;background:#fee2e2;border:1px solid #fecaca;color:#7f1d1d;border-radius:10px">Не удалось загрузить ${name}.html</div>`;
    }
  }
});
