/* Table renderer, column definitions and table-based panels. */
function tbl(cols, rows, click) {
  return `<div class="w"><table><thead><tr>${cols.map((c) => `<th>${c[0]}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr class="${click ? "r" : ""}" ${click ? `onclick="detail('${r.id}')" tabindex=0` : ""}>${cols.map((c) => `<td>${c[1](r)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${cols.length}" class="mut">No records for these filters.</td></tr>`}</tbody></table></div>`;
}
const tag = (s) => `<span class="tag">${s}</span>`;
function svcTable(d) {
  const rows = SV.map(([n]) => {
    const q = d.cur.Q.filter((x) => x.svc == n),
      a = q.filter((x) => x.status == "accepted").length;
    return {
      n,
      c: q.length,
      amt: q.reduce((s, x) => s + x.amt, 0),
      a,
      p: q.filter((x) => x.status == "pending").length,
      r: q.filter((x) => x.status == "rejected").length,
    };
  });
  return tbl(
    [
      ["Service", (r) => r.n],
      ["Quotes", (r) => r.c],
      ["Quoted", (r) => inr(r.amt)],
      ["Accepted", (r) => r.a],
      ["Pending", (r) => r.p],
      ["Rejected", (r) => r.r],
      ["Conv.", (r) => pc(r.a, r.c).toFixed(1) + "%"],
    ],
    rows,
  );
}
function prio(d) {
  return tbl(
    [
      ["Priority", (r) => r[0]],
      ["Deals", (r) => r[1]],
      ["Revenue", (r) => inr(r[2])],
      ["%", (r) => r[3]],
    ],
    ["High", "Medium", "Low"].map((p) => {
      const x = d.cur.D.filter((y) => y.pr == p),
        t = d.cur.D.reduce((s, y) => s + y.amt, 0),
        r = x.reduce((s, y) => s + y.amt, 0);
      return [p, x.length, r, pc(r, t).toFixed(1) + "%"];
    }),
  );
}
function team(d, dept) {
  const us = U.filter((u) => u[1] == dept && (!fu.value || u[0] == fu.value));
  if (dept == "Sales")
    return tbl(
      [
        ["User", (r) => r[0]],
        ["Leads", (r) => r.l],
        ["Qualified", (r) => r.q],
        ["Converted", (r) => r.c],
        ["Conv.", (r) => pc(r.c, r.l).toFixed(1) + "%"],
        ["Quotes", (r) => r.qq],
        ["Deals", (r) => r.dd],
        ["Deal value", (r) => inr(r.v)],
      ],
      us.map((u) => {
        const f = (a) => a.filter((x) => x.owner == u[0]),
          l = f(d.cur.L),
          dl = f(d.cur.D);
        return Object.assign([u[0]], {
          l: l.length,
          q: cnt(l, "qualified"),
          c: cnt(l, "converted"),
          qq: f(d.cur.Q).length,
          dd: dl.length,
          v: dl.reduce((s, x) => s + x.amt, 0),
        });
      }),
    );
  return tbl(
    [
      ["User", (r) => r[0]],
      ["Orders", (r) => r.o],
      ["Completed", (r) => r.c],
      ["Pending", (r) => r.p],
      ["On hold", (r) => r.h],
    ],
    us.map((u) => {
      const o = d.cur.I.filter((x) => x.owner == u[0]);
      return Object.assign([u[0]], {
        o: o.length,
        c: o.filter((x) => x.stage == "Completed").length,
        p: o.filter((x) => x.stage == "Pending").length,
        h: o.filter((x) => x.stage == "On Hold").length,
      });
    }),
  );
}
const lc = [
  ["ID", (r) => r.id],
  ["Date", (r) => r.date],
  ["Service", (r) => r.svc],
  ["Source", (r) => r.src],
  ["Status", (r) => tag(r.status)],
  ["Owner", (r) => r.owner],
];
const qc = [
  ["ID", (r) => r.id],
  ["Date", (r) => r.date],
  ["Service", (r) => r.svc],
  ["Amount", (r) => inr(r.amt)],
  ["Status", (r) => tag(r.status)],
  ["Owner", (r) => r.owner],
];
const dc = [
  ["ID", (r) => r.id],
  ["Date", (r) => r.date],
  ["Service", (r) => r.svc],
  ["Revenue", (r) => inr(r.amt)],
  ["Priority", (r) => tag(r.pr)],
  ["Owner", (r) => r.owner],
];
const oc = [
  ["Order", (r) => r.id],
  ["Date", (r) => r.date],
  ["Service", (r) => r.svc],
  ["Amount", (r) => inr(r.amt)],
  ["Stage", (r) => tag(r.stage)],
  ["Payment", (r) => tag(r.paid ? "collected" : "outstanding")],
  ["Owner", (r) => r.owner],
];
