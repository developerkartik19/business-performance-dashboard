/* Seeded dummy data: leads -> quotations -> deals -> orders/invoices, all interlinked. */
const TODAY = new Date(2026, 9, 18),
  DAY = 864e5,
  fmtD = (d) => d.toISOString().slice(0, 10);
let s = 7;
const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296,
  pick = (a) => a[Math.floor(rnd() * a.length)];
const U = [
  ["Nancy Singh", "Sales"],
  ["Sneha Choudhary", "Sales"],
  ["Tannu Kumar", "Sales"],
  ["Gaurav Pant", "Operations"],
  ["Srishti Upadhyay", "Operations"],
];
const SV = [
  ["Private Limited Company", 24e3],
  ["LLP Registration", 9e3],
  ["GST Registration", 6e3],
  ["Trademark", 14e3],
  ["FSSAI License", 9e3],
  ["Annual Compliance", 11e3],
];
const SRC = ["Google Ads", "Website", "Just Dial", "Referral"];
const dayAgo = (n) => new Date(TODAY.getTime() - n * DAY);
const L = [],
  Q = [],
  D = [],
  I = [];
for (let i = 0; i < 460; i++) {
  const ow = pick(U),
    st = pick(["new", "new", "qualified", "qualified", "converted", "unqualified", "unqualified"]);
  const l = {
    id: "L-" + (209000 + i),
    type: "Lead",
    date: fmtD(dayAgo(Math.floor(rnd() * 64))),
    src: pick(SRC),
    status: st,
    owner: ow[0],
    dept: ow[1],
    svc: pick(SV)[0],
  };
  L.push(l);
  if ((st == "qualified" || st == "converted") && rnd() < 0.85) {
    const sv = pick(SV),
      dd = Math.min(Math.floor(rnd() * 4), (TODAY - new Date(l.date)) / DAY),
      d0 = fmtD(new Date(new Date(l.date).getTime() + dd * DAY));
    const qs =
        st == "converted"
          ? rnd() < 0.8
            ? "accepted"
            : "pending"
          : pick(["pending", "pending", "rejected"]),
      q = {
        id: "Q-" + (10400 + Q.length),
        type: "Quotation",
        date: d0,
        svc: sv[0],
        amt: Math.round((sv[1] * (0.6 + rnd() * 0.9)) / 100) * 100,
        status: qs,
        owner: l.owner,
        dept: l.dept,
        lead: l.id,
      };
    Q.push(q);
    if (qs == "accepted") {
      const pr = pick(["High", "High", "Medium", "Low"]),
        dl = {
          id: "D-" + (800 + D.length),
          type: "Deal",
          date: d0,
          svc: sv[0],
          amt: q.amt,
          pr,
          owner: l.owner,
          dept: l.dept,
          quote: q.id,
        };
      D.push(dl);
      const dv = fmtD(
        new Date(Math.min(+TODAY, new Date(d0).getTime() + (1 + Math.floor(rnd() * 4)) * DAY)),
      );
      I.push({
        id: "INV-" + (1000 + I.length),
        type: "Order",
        date: dv,
        svc: sv[0],
        amt: q.amt,
        paid: rnd() < 0.62,
        stage: pick(["Pending", "In Progress", "Completed", "On Hold"]),
        owner: pick(U.slice(3))[0],
        dept: "Operations",
        deal: dl.id,
      });
    }
  }
}
