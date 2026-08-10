export function mount(container, zone) {
  const tagLine = zone.tag ? `<div class="stub-tag">→ Tag ${zone.tag} im ursprünglichen 10-Tage-Plan</div>` : "";
  container.innerHTML = `
    <div class="stub-teaser">
      <span class="stub-status">Bald verfügbar</span>
      <p>${zone.teaser || "Inhalt für dieses Gebiet folgt."}</p>
      ${tagLine}
    </div>
  `;
}
