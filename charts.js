/* SVG chart and bar-list renderers. */
function days(d) {
  const a = [];
  for (let t = new Date(d.p.a); fmtD(t) <= d.p.b; t = new Date(+t + DAY)) a.push(fmtD(t));
  return a;
}
function line(d) {
  const ds = days(d),
    ser = [
      ["New", "var(--pri)", () => true],
      ["Qualified", "var(--pos)", (x) => x.status == "qualified"],
      ["Converted", "var(--amb)", (x) => x.status == "converted"],
    ];
  const vals = ser.map(([, , f]) =>
    ds.map((k) => d.cur.L.filter((x) => x.date == k && f(x)).length),
  );
  const mx = Math.max(1, ...vals.flat()),
    W = 420,
    H = 150,
    x = (i) => 30 + (i * (W - 40)) / Math.max(1, ds.length - 1),
    y = (v) => H - 20 - (v / mx) * (H - 35);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Daily lead trend">${[0, 0.5, 1].map((f) => `<line x1="30" x2="${W - 10}" y1="${y(mx * f)}" y2="${y(mx * f)}" stroke="var(--bd)"/><text x="2" y="${y(mx * f) + 3}">${Math.round(mx * f)}</text>`).join("")}${vals.map((v, i) => `<polyline fill="none" stroke="${ser[i][1]}" stroke-width="2" points="${v.map((n, j) => x(j) + "," + y(n)).join(" ")}"/>`).join("")}<text x="30" y="${H - 4}">${ds[0]}</text><text x="${W - 70}" y="${H - 4}">${ds[ds.length - 1]}</text></svg><div class="mut"><span style="color:var(--pri)">●</span> New <span style="color:var(--pos)">●</span> Qualified <span style="color:var(--amb)">●</span> Converted</div>`;
}
function bars(items, fmt) {
  const mx = Math.max(1, ...items.map((i) => i[1]));
  return (
    items
      .map(
        ([n, v, e]) =>
          `<div class="row"><span>${n}</span><div class="bar"><i style="width:${(v / mx) * 100}%"></i></div><span style="text-align:right">${fmt ? fmt(v) : v}${e || ""}</span></div>`,
      )
      .join("") || '<p class="mut">No records in this selection.</p>'
  );
}
function funnel(d) {
  const L = d.cur.L;
  return (
    bars([
      ["New (all)", L.length],
      ["Qualified", cnt(L, "qualified") + cnt(L, "converted")],
      ["Converted", cnt(L, "converted")],
      ["Unqualified", cnt(L, "unqualified")],
    ]).replace(/<\/div>/, "</div>") +
    '<p class="mut">Funnel counts qualified as qualified plus converted.</p>'
  );
}
function sources(d) {
  return bars(SRC.map((k) => [k, d.cur.L.filter((x) => x.src == k).length]));
}
function revChart(d) {
  const ds = days(d),
    v = ds.map((k) => d.cur.D.filter((x) => x.date == k).reduce((s, x) => s + x.amt, 0)),
    c = ds.map((k) => d.cur.I.filter((x) => x.date == k && x.paid).reduce((s, x) => s + x.amt, 0)),
    mx = Math.max(1, ...v),
    W = 420,
    H = 150,
    bw = (W - 40) / ds.length;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Daily revenue">${v.map((n, i) => `<rect x="${30 + i * bw}" width="${Math.max(1, bw * 0.4)}" y="${H - 20 - (n / mx) * (H - 35)}" height="${(n / mx) * (H - 35)}" fill="var(--pri)"><title>${ds[i]} deal value ${inr(n)}</title></rect><rect x="${30 + i * bw + bw * 0.42}" width="${Math.max(1, bw * 0.4)}" y="${H - 20 - (c[i] / mx) * (H - 35)}" height="${(c[i] / mx) * (H - 35)}" fill="var(--pos)"><title>${ds[i]} collected ${inr(c[i])}</title></rect>`).join("")}<text x="2" y="14">${inr(mx)}</text><text x="30" y="${H - 4}">${ds[0]}</text><text x="${W - 70}" y="${H - 4}">${ds[ds.length - 1]}</text></svg><div class="mut"><span style="color:var(--pri)">●</span> Deal value <span style="color:var(--pos)">●</span> Collected</div>`;
}
