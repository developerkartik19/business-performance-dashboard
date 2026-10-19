/* Search, detail dialog and CSV export. */
const all = () => [].concat(L, Q, D, I);
function detail(id) {
  const r = all().find((x) => x.id == id);
  dgc.innerHTML = `<h2>${r.id} · ${r.type}</h2><table>${Object.entries(r)
    .map(
      ([k, x]) => `<tr><td class="mut">${k}</td><td>${typeof x == "number" ? inr(x) : x}</td></tr>`,
    )
    .join("")}</table>`;
  dg.showModal();
}
q.oninput = () => {
  const t = q.value.trim().toLowerCase();
  if (t.length < 2) {
    res.classList.add("hide");
    return;
  }
  const m = all()
    .filter((r) => (r.id + " " + r.owner + " " + (r.svc || "")).toLowerCase().includes(t))
    .slice(0, 8);
  res.innerHTML =
    m
      .map(
        (r) =>
          `<div onclick="detail('${r.id}');res.classList.add('hide')">${r.id} <small>${r.type} · ${r.svc || r.src} · ${r.owner}</small></div>`,
      )
      .join("") || '<div class="mut">No matches</div>';
  res.classList.remove("hide");
};
ex.onclick = () => {
  const d = data(),
    rows =
      {
        Overview: d.cur.L,
        "Lead Management": d.cur.L,
        Quotations: d.cur.Q,
        "Deals & Revenue": d.cur.D,
        "Orders & Payments": d.cur.I,
      }[state.view] || d.cur.L;
  const ks = Object.keys(rows[0] || { id: 1 });
  const csv = [ks.join(",")]
    .concat(rows.map((r) => ks.map((k) => JSON.stringify(r[k] ?? "")).join(",")))
    .join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = "kartiks-dashboard-" + state.view.replace(/\W+/g, "-").toLowerCase() + ".csv";
  a.click();
};
