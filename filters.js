/* Date-range, previous-period and user/department filtering. */
function period() {
  let a, b;
  if (state.rg == "1") {
    a = b = TODAY;
  } else if (state.rg == "c" && d1.value && d2.value) {
    a = new Date(d1.value);
    b = new Date(d2.value);
  } else {
    const n = state.rg == "c" ? 30 : +state.rg;
    b = TODAY;
    a = dayAgo(n - 1);
  }
  const n = Math.round((b - a) / DAY) + 1,
    pb = new Date(a - DAY),
    pa = new Date(pb - (n - 1) * DAY);
  return { a: fmtD(a), b: fmtD(b), pa: fmtD(pa), pb: fmtD(pb), n };
}
const sel = (arr, a, b) =>
  arr.filter(
    (r) =>
      r.date >= a &&
      r.date <= b &&
      (!fu.value || r.owner == fu.value) &&
      (!fd.value || r.dept == fd.value),
  );
function data() {
  const p = period();
  const g = (x, a, b) => sel(x, a, b);
  return {
    p,
    cur: { L: g(L, p.a, p.b), Q: g(Q, p.a, p.b), D: g(D, p.a, p.b), I: g(I, p.a, p.b) },
    prv: { L: g(L, p.pa, p.pb), Q: g(Q, p.pa, p.pb), D: g(D, p.pa, p.pb), I: g(I, p.pa, p.pb) },
  };
}
const cnt = (l, st) => l.filter((x) => x.status == st).length;
