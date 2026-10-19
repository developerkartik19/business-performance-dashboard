/* Reusable UI building blocks: KPI cards and card wrapper. */
function kpis(d) {
  const m = (x) => ({
    tl: x.L.length,
    ql: cnt(x.L, "qualified"),
    cv: cnt(x.L, "converted"),
    uq: cnt(x.L, "unqualified"),
    cr: pc(cnt(x.L, "converted"), x.L.length),
    qc: x.Q.length,
    dc: x.D.length,
    iv: x.I.length,
  });
  const c = m(d.cur),
    p = m(d.prv);
  const defs = [
    ["Total Leads", "tl", "All leads created"],
    ["Qualified Leads", "ql", "Qualified ÷ total: " + pc(c.ql, c.tl).toFixed(1) + "%"],
    ["Converted Leads", "cv", "Converted ÷ total: " + c.cr.toFixed(1) + "%"],
    ["Unqualified Leads", "uq", "Unqualified ÷ total: " + pc(c.uq, c.tl).toFixed(1) + "%"],
    ["Lead Conversion Rate", "cr", "Converted ÷ total leads"],
    ["Quotations Created", "qc", "Quotes issued"],
    ["Deals Created", "dc", "Accepted quotations"],
    ["Invoices Generated", "iv", "One per deal"],
  ];
  return `<div class="grid k">${defs
    .map(([t, k, n]) => {
      const ch = p[k] ? ((c[k] - p[k]) / p[k]) * 100 : c[k] ? 100 : 0,
        good = k == "uq" ? ch <= 0 : ch >= 0;
      return `<div class="c"><div class="kl">${t}</div><div class="kv">${k == "cr" ? c[k].toFixed(1) + "%" : c[k]}</div><div class="${good ? "up" : "dn"}">${ch >= 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(1)}% <span class="mut">vs previous ${d.p.n} day${d.p.n > 1 ? "s" : ""}</span></div><div class="mut">${n}</div></div>`;
    })
    .join("")}</div>`;
}
function card(t, b, w) {
  return `<div class="c" ${w ? `style="grid-column:span ${w}"` : ""}><h2>${t}</h2>${b}</div>`;
}
