/* Shared state and formatting helpers. */
const state = { rg: "30", view: "Overview" };
const $ = (id) => document.getElementById(id),
  inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN"),
  pc = (a, b) => (b ? (a / b) * 100 : 0);
