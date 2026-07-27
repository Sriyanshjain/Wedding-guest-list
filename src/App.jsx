import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const rawGuests = [
  // Married Couples
  { id: 1,  name: "Kshitij & Somya",         category: "married", pax: 2 },
  { id: 2,  name: "Nishi & Arpit",            category: "married", pax: 2 },
  { id: 3,  name: "Yash & Rishita",           category: "married", pax: 2 },
  { id: 4,  name: "Muskan & Aniruddh",        category: "married", pax: 2 },
  { id: 5,  name: "Vishal & Purvi",           category: "married", pax: 2 },
  { id: 6,  name: "Abhinav & Disha",          category: "married", pax: 2 },
  { id: 7,  name: "Prashu & Simran",          category: "married", pax: 2 },
  { id: 8,  name: "Subuhani & Wife",          category: "married", pax: 2 },
  { id: 9,  name: "Manish & Bhabhi",          category: "married", pax: 2 },
  { id: 10, name: "Kunal & Pratiksha",        category: "married", pax: 2 },
  { id: 11, name: "Aman & Ritika",            category: "married", pax: 2 },
  { id: 12, name: "Vivek & Bhabhi",           category: "married", pax: 2 },
  { id: 13, name: "Rishabh & Anushka",        category: "married", pax: 2 },
  { id: 14, name: "Sandeep (Pune) & Bhabhi",  category: "married", pax: 2 },
  { id: 42, name: "Sourabh",                  category: "single",  pax: 1 },
  // Couples
  { id: 15, name: "Dev & Raksha",             category: "couple",  pax: 2 },
  { id: 16, name: "Srijan & Leena",           category: "couple",  pax: 2 },
  { id: 17, name: "Abhinav Gautam & Noor",    category: "couple",  pax: 2 },
  // Singles
  { id: 18, name: "Ujjwal",       category: "single", note: "school", local: true, pax: 1 },
  { id: 19, name: "Kavya",        category: "single", note: "school", local: true, pax: 1 },
  { id: 20, name: "Ayush",        category: "single", note: "school", local: true, pax: 1 },
  { id: 21, name: "Guru",         category: "single", note: "school", local: true, pax: 1 },
  { id: 22, name: "Shivam",       category: "single", note: "school", local: true, pax: 1 },
  { id: 23, name: "Angel",        category: "single", note: "school", local: true, pax: 1 },
  { id: 24, name: "Gunjan",       category: "single", pax: 1 },
  { id: 25, name: "Ganga",        category: "single", pax: 1 },
  { id: 26, name: "Kundu",        category: "single", pax: 1 },
  { id: 27, name: "Anjaneya",     category: "single", pax: 1 },
  { id: 28, name: "Sahil Sharma", category: "single", pax: 1 },
  { id: 29, name: "Ditsha",       category: "single", pax: 1 },
  { id: 30, name: "Sam",          category: "single", pax: 1 },
  { id: 31, name: "Neha",         category: "single", pax: 1 },
  { id: 32, name: "Paridhi",      category: "single", pax: 1 },
  { id: 33, name: "Sumangal",     category: "single", pax: 1 },
  { id: 34, name: "Shefali",      category: "single", pax: 1 },
  { id: 35, name: "Monica",       category: "single", pax: 1 },
  { id: 36, name: "Vini",         category: "single", pax: 1 },
  { id: 37, name: "Mitharth",     category: "single", pax: 1 },
  { id: 38, name: "Projit",       category: "single", pax: 1 },
  { id: 39, name: "Mohit",        category: "single", pax: 1 },
  { id: 40, name: "Mithun",       category: "single", pax: 1 },
  { id: 41, name: "Sneha",        category: "single", pax: 1 },
  { id: 43, name: "Ballu",        category: "single", pax: 1 },
  { id: 44, name: "Shankey",      category: "single", pax: 1 },
  { id: 45, name: "Ratna",        category: "single", pax: 1 },
  { id: 46, name: "Rishabh Saxena", category: "single", pax: 1 },
  { id: 47, name: "Dishant",      category: "single", pax: 1 },
];

const STATUS_OPTIONS = ["pending", "invited", "to call", "called", "confirmed", "declined", "standby"];

const STATUS_STYLE = {
  pending:   { bg: "#F5F0E8", color: "#9A8060", dot: "#C8A96E" },
  invited:   { bg: "#EBF0FB", color: "#4A6FA5", dot: "#4A6FA5" },
  "to call": { bg: "#FEF3E2", color: "#C47F17", dot: "#C47F17" },
  called:    { bg: "#FFF8E1", color: "#A07A10", dot: "#F0B429" },
  confirmed: { bg: "#E8F5EE", color: "#2E7D5E", dot: "#2E7D5E" },
  declined:  { bg: "#FBE8E8", color: "#B94040", dot: "#B94040" },
  standby:   { bg: "#F0EBF8", color: "#7B5EA7", dot: "#7B5EA7" },
};

const CAT_LABEL = {
  married: "Married Couples",
  couple:  "Couples",
  single:  "Singles",
};

const confirmedIds = new Set([39, 38, 4, 3, 44, 45, 40, 42]);
const invitedIds   = new Set([1, 5, 7, 24, 16, 15, 26, 27, 25, 6]);
const standbyIds   = new Set([36, 14, 12, 17, 34, 35, 37]);
const declinedIds  = new Set([46, 47, 41]);

const getDefaultStatus = (id) =>
  confirmedIds.has(id) ? "confirmed"
  : invitedIds.has(id) ? "invited"
  : standbyIds.has(id) ? "standby"
  : declinedIds.has(id) ? "declined"
  : "pending";

const FIRESTORE_DOC = { collection: "wedding", doc: "guestStatuses" };

export default function App() {
  const [guests, setGuests] = useState(
    rawGuests.map(g => ({ ...g, status: getDefaultStatus(g.id) }))
  );
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("synced"); // "synced" | "saving" | "error"
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [importMsg, setImportMsg] = useState("");

  // Load from Firestore on mount + subscribe to real-time updates
  useEffect(() => {
    const ref = doc(db, FIRESTORE_DOC.collection, FIRESTORE_DOC.doc);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const statusMap = snap.data();
        setGuests(prev =>
          prev.map(g => ({ ...g, status: statusMap[g.id] ?? getDefaultStatus(g.id) }))
        );
      }
      setLoading(false);
    }, () => {
      setLoading(false);
      setSyncStatus("error");
    });
    return () => unsub();
  }, []);

  // Save a single status change to Firestore
  const updateStatus = async (id, newStatus) => {
    setSyncStatus("saving");
    setGuests(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));
    try {
      const ref = doc(db, FIRESTORE_DOC.collection, FIRESTORE_DOC.doc);
      const snap = await getDoc(ref);
      const existing = snap.exists() ? snap.data() : {};
      await setDoc(ref, { ...existing, [id]: newStatus });
      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  };

  const exportStatus = () => {
    const data = guests.map(g => ({ id: g.id, name: g.name, status: g.status }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding_guest_statuses.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importStatus = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const statusMap = {};
        data.forEach(g => { statusMap[g.id] = g.status; });
        const ref = doc(db, FIRESTORE_DOC.collection, FIRESTORE_DOC.doc);
        await setDoc(ref, statusMap);
        setImportMsg("✓ Imported & synced!");
        setTimeout(() => setImportMsg(""), 3000);
      } catch {
        setImportMsg("✗ Import failed.");
        setTimeout(() => setImportMsg(""), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const filtered = guests.filter(g => {
    const matchCat = filter === "all" || (filter === "local" ? g.local : g.category === filter);
    const matchStatus = statusFilter === "all" || g.status === statusFilter;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const totalPax      = guests.reduce((s, g) => s + g.pax, 0);
  const confirmedPax  = guests.filter(g => g.status === "confirmed").reduce((s, g) => s + g.pax, 0);
  const confirmedCount = guests.filter(g => g.status === "confirmed").length;
  const pendingCount  = guests.filter(g => g.status === "pending").length;
  const declinedCount = guests.filter(g => g.status === "declined").length;

  const syncLabel = syncStatus === "saving" ? "⏳ Saving…"
                  : syncStatus === "error"  ? "⚠️ Sync error"
                  : "✓ Synced";
  const syncColor = syncStatus === "saving" ? "#C47F17"
                  : syncStatus === "error"  ? "#B94040"
                  : "#2E7D5E";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Georgia, serif", color: "#8B5E3C", fontSize: 18 }}>
      Loading guest list…
    </div>
  );

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#FAF7F2", minHeight: "100vh", padding: "0 0 48px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #5C3D2E 0%, #8B5E3C 100%)", padding: "32px 24px 28px", textAlign: "center", color: "#FFF8F0" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7, marginBottom: 8 }}>Sriyansh & Shrishti</div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>Friends Guest List</div>
        <div style={{ fontSize: 13, opacity: 0.65, marginTop: 6 }}>{guests.length} entries · {totalPax} people total</div>
      </div>

      {/* Export / Import / Sync bar */}
      <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#fff", borderBottom: "1px solid #EDE8DF", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={exportStatus} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #8B5E3C", background: "#8B5E3C", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>
          ⬇ Export JSON
        </button>
        <label style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #8B5E3C", background: "#fff", color: "#8B5E3C", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>
          ⬆ Import JSON
          <input type="file" accept=".json" onChange={importStatus} style={{ display: "none" }} />
        </label>
        {importMsg && <span style={{ fontSize: 12, color: importMsg.startsWith("✓") ? "#2E7D5E" : "#B94040", fontWeight: 600 }}>{importMsg}</span>}
        <span style={{ fontSize: 11, fontWeight: 600, color: syncColor, marginLeft: "auto" }}>{syncLabel}</span>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 0, background: "#fff", borderBottom: "1px solid #EDE8DF", overflowX: "auto" }}>
        {[
          { label: "Confirmed", value: confirmedCount, sub: `${confirmedPax} pax`, color: "#2E7D5E" },
          { label: "Pending",   value: pendingCount,   color: "#9A8060" },
          { label: "Declined",  value: declinedCount,  color: "#B94040" },
          { label: "Invited",   value: guests.filter(g => g.status === "invited").length,  color: "#4A6FA5" },
          { label: "To Call",   value: guests.filter(g => g.status === "to call").length,  color: "#C47F17" },
          { label: "Called",    value: guests.filter(g => g.status === "called").length,   color: "#A07A10" },
          { label: "Standby",   value: guests.filter(g => g.status === "standby").length,  color: "#7B5EA7" },
        ].map(s => (
          <div key={s.label} style={{ flex: "1 1 70px", padding: "12px 8px", textAlign: "center", borderRight: "1px solid #EDE8DF" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 9, color: s.color, marginTop: 2 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="Search name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: "1px solid #DDD6CA", borderRadius: 8, padding: "9px 14px", fontSize: 14, background: "#fff", outline: "none", fontFamily: "Georgia, serif", color: "#3A2A1A" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "married", "couple", "single"].map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: filter === c ? "#8B5E3C" : "#DDD6CA", background: filter === c ? "#8B5E3C" : "#fff", color: filter === c ? "#fff" : "#666", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>
              {c === "all" ? "All" : CAT_LABEL[c]}
            </button>
          ))}
          <button onClick={() => setFilter(filter === "local" ? "all" : "local")} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: filter === "local" ? "#2E7D8B" : "#DDD6CA", background: filter === "local" ? "#2E7D8B" : "#fff", color: filter === "local" ? "#fff" : "#666", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            🏠 Localites
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid", borderColor: statusFilter === s ? "#5C3D2E" : "#DDD6CA", background: statusFilter === s ? "#5C3D2E" : "#fff", color: statusFilter === s ? "#fff" : "#888", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", textTransform: "capitalize" }}>
              {s === "all" ? "All Status" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ padding: "4px 20px 10px", fontSize: 12, color: "#999" }}>
        Showing {filtered.length} of {guests.length}
      </div>

      {/* List */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(g => {
          const st = STATUS_STYLE[g.status] || STATUS_STYLE.pending;
          return (
            <div key={g.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #EDE8DF" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9A8060", flexShrink: 0, fontWeight: 600 }}>
                {g.id}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, color: "#2A1A0A", fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>
                  {CAT_LABEL[g.category]}
                  {g.note && <span> · {g.note}</span>}
                  {g.local && <span style={{ color: "#2E7D8B", fontWeight: 600 }}> · 🏠 local</span>}
                  {g.pax > 1 && <span> · {g.pax} pax</span>}
                </div>
              </div>
              <select
                value={g.status}
                onChange={e => updateStatus(g.id, e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 20, background: st.bg, color: st.color, border: `1.5px solid ${st.dot}`, fontSize: 11, fontFamily: "Georgia, serif", fontWeight: 600, textTransform: "capitalize", flexShrink: 0, cursor: "pointer", outline: "none", appearance: "none", paddingRight: 24, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "#CCC" }}>
        Changes sync in real-time across all devices
      </div>
    </div>
  );
}
