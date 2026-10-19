/* Page views (one per sidebar item) and the render loop. */
const V = {
  Overview: (d) => {
    const t = d.cur.D.reduce((s, x) => s + x.amt, 0),
      col = d.cur.I.filter((x) => x.paid).reduce((s, x) => s + x.amt, 0);
    return (
      kpis(d) +
      `<div class="grid g3">${card("Lead funnel", funnel(d))}${card("Daily lead trend", line(d), 2)}${card("Lead sources", sources(d))}${card("Quote to deal conversion", `<div class="kv">${pc(d.cur.D.length, d.cur.Q.length).toFixed(1)}%</div><div class="mut">${d.cur.D.length} deals from ${d.cur.Q.length} quotations</div>`)}${card("Revenue: deal value vs collected", revChart(d), 2)}${card("Totals", `<div class="mut">Total deal value</div><div class="kv">${inr(t)}</div><div class="mut">Collected</div><div class="kv up">${inr(col)}</div>`)}</div>`
    );
  },
  "Lead Management": (d) => kpis(d) + card("Leads", tbl(lc, d.cur.L, 1)),
  Quotations: (d) =>
    `<div class="grid g3">${card("Service-wise quotation details", svcTable(d), 2)}${card(
      "Quotation value by service",
      bars(
        SV.map(([n]) => [n, d.cur.Q.filter((x) => x.svc == n).reduce((s, x) => s + x.amt, 0)]),
        inr,
      ),
    )}</div>` + card("Quotations", tbl(qc, d.cur.Q, 1)),
  "Deals & Revenue": (d) =>
    `<div class="grid g3">${card("Priority breakdown", prio(d))}${card("Daily revenue", revChart(d), 2)}${card(
      "Revenue by service",
      bars(
        SV.map(([n]) => [n, d.cur.D.filter((x) => x.svc == n).reduce((s, x) => s + x.amt, 0)]),
        inr,
      ),
    )}</div>` + card("Deals", tbl(dc, d.cur.D, 1)),
  "Orders & Payments": (d) =>
    `<div class="grid g3">${card("Orders by stage", bars(["Pending", "In Progress", "Completed", "On Hold"].map((k) => [k, d.cur.I.filter((x) => x.stage == k).length])))}${card(
      "Collection",
      bars(
        [
          ["Collected", d.cur.I.filter((x) => x.paid).reduce((s, x) => s + x.amt, 0)],
          ["Outstanding", d.cur.I.filter((x) => !x.paid).reduce((s, x) => s + x.amt, 0)],
        ],
        inr,
      ),
    )}</div>` + card("Orders", tbl(oc, d.cur.I, 1)),
  "Team Performance": (d) =>
    `<div class="grid g3">${card("Sales team", team(d, "Sales"), 2)}${card("Operations team", team(d, "Operations"))}</div>`,
  "Activity Log": (d) => {
    const a = []
      .concat(d.cur.L, d.cur.Q, d.cur.D, d.cur.I)
      .sort((x, y) => y.date.localeCompare(x.date) || y.id.localeCompare(x.id))
      .slice(0, 60);
    return card(
      "Recent CRM activity",
      tbl(
        [
          ["Date", (r) => r.date],
          ["Employee", (r) => r.owner],
          ["Action", (r) => r.type + " created"],
          ["Record", (r) => r.id],
        ],
        a,
        1,
      ),
    );
  },
};
function render() {
  const d = data();
  ttl.textContent = state.view;
  v.innerHTML = V[state.view](d);
  nav
    .querySelectorAll("button")
    .forEach((b) => b.classList.toggle("on", b.dataset.v == state.view));
}
