/* App bootstrap: sidebar, filters and event wiring. */
U.forEach((u) => fu.add(new Option(u[0], u[0])));
fu.insertBefore(new Option("All Users", ""), fu.firstChild);
fu.value = "";
nav.innerHTML = Object.keys(V)
  .map((k) => `<button data-v="${k}"><b></b><span class="lbl">${k}</span></button>`)
  .join("");
nav.onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    state.view = b.dataset.v;
    sb.classList.remove("open");
    render();
  }
};
tg.onclick = () => (innerWidth < 760 ? sb.classList.toggle("open") : sb.classList.toggle("min"));
rg.innerHTML = [
  ["1", "Today"],
  ["7", "Last 7 Days"],
  ["30", "Last 30 Days"],
  ["c", "Custom"],
]
  .map(([k, t]) => `<button class="btn" data-r="${k}">${t}</button>`)
  .join(" ");
function mark() {
  rg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.r == state.rg));
  cr.classList.toggle("hide", state.rg != "c");
}
rg.onclick = (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.rg = b.dataset.r;
  if (state.rg == "c" && !d1.value) {
    d1.value = fmtD(dayAgo(13));
    d2.value = fmtD(TODAY);
  }
  mark();
  render();
};
[d1, d2, fu, fd].forEach((e) => (e.onchange = render));
d1.max = d2.max = fmtD(TODAY);
mark();
render();
