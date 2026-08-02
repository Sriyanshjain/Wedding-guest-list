import { useState, useEffect, useRef } from "react";

const GITHUB_TOKEN = [import.meta.env.VITE_GH_T1, import.meta.env.VITE_GH_T2, import.meta.env.VITE_GH_T3].join("");
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO  = import.meta.env.VITE_GITHUB_REPO;
const GITHUB_FILE  = import.meta.env.VITE_GITHUB_FILE;
const API_BASE     = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
const HEADERS      = { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" };

const DEFAULT_GUESTS = [
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
  { id: 15, name: "Dev & Raksha",             category: "couple",  pax: 2 },
  { id: 16, name: "Srijan & Leena",           category: "couple",  pax: 2 },
  { id: 17, name: "Abhinav Gautam & Noor",    category: "couple",  pax: 2 },
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

const CAT_LABEL = { married: "Married Couples", couple: "Couples", single: "Singles" };
const CAT_OPTIONS = ["married", "couple", "single"];

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

const nextId = (guests) => Math.max(0, ...guests.map(g => g.id)) + 1;

export default function App() {
  const [guests, setGuests] = useState(
    DEFAULT_GUESTS.map(g => ({ ...g, status: getDefaultStatus(g.id) }))
  );
  const [loading, setLoading]       = useState(true);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [catFilter, setCatFilter]   = useState(new Set());      // multi-select
  const [statusFilters, setStatusFilters] = useState(new Set()); // multi-select
  const [search, setSearch]         = useState("");
  const [importMsg, setImportMsg]   = useState("");

  // Add person modal state
  const [showAdd, setShowAdd]       = useState(false);
  const [newName, setNewName]       = useState("");
  const [newCat, setNewCat]         = useState("single");
  const [newPax, setNewPax]         = useState(1);
  const [newLocal, setNewLocal]     = useState(false);

  const shaRef          = useRef(null);
  const saveTimer       = useRef(null);
  const pendingRef      = useRef(null);

  // ── Load from GitHub ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(API_BASE, { headers: HEADERS })
      .then(r => r.json())
      .then(data => {
        if (data.sha && data.content) {
          shaRef.current = data.sha;
          const saved = JSON.parse(atob(data.content.replace(/\n/g, "")));
          // saved can have both statusMap AND guestList
          if (saved.guests) {
            setGuests(saved.guests);
          } else {
            // legacy: just a statusMap
            setGuests(prev => prev.map(g => ({ ...g, status: saved[g.id] ?? getDefaultStatus(g.id) })));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Debounced save ────────────────────────────────────────────────────────
  const saveToGitHub = (updatedGuests) => {
    pendingRef.current = updatedGuests;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncStatus("saving");
    saveTimer.current = setTimeout(async () => {
      const payload = { guests: pendingRef.current };
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
      try {
        const body = { message: "Update guest list", content, sha: shaRef.current };
        const res  = await fetch(API_BASE, { method: "PUT", headers: HEADERS, body: JSON.stringify(body) });
        const data = await res.json();
        if (data.content) { shaRef.current = data.content.sha; setSyncStatus("synced"); }
        else setSyncStatus("error");
      } catch { setSyncStatus("error"); }
    }, 1500);
  };

  const updateGuests = (updated) => { setGuests(updated); saveToGitHub(updated); };

  // ── Status change ─────────────────────────────────────────────────────────
  const updateStatus = (id, newStatus) => {
    updateGuests(guests.map(g => g.id === id ? { ...g, status: newStatus } : g));
  };

  // ── Remove person ─────────────────────────────────────────────────────────
  const removePerson = (id) => {
    if (!window.confirm("Remove this person from the list?")) return;
    updateGuests(guests.filter(g => g.id !== id));
  };

  // ── Add person ────────────────────────────────────────────────────────────
  const addPerson = () => {
    if (!newName.trim()) return;
    const newGuest = {
      id: nextId(guests),
      name: newName.trim(),
      category: newCat,
      pax: Number(newPax),
      status: "pending",
      ...(newLocal ? { local: true, note: "school" } : {}),
    };
    updateGuests([...guests, newGuest]);
    setNewName(""); setNewCat("single"); setNewPax(1); setNewLocal(false);
    setShowAdd(false);
  };

  // ── Export / Import ───────────────────────────────────────────────────────
  const exportStatus = () => {
    const blob = new Blob([JSON.stringify(guests.map(g => ({ id: g.id, name: g.name, status: g.status })), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "wedding_guest_statuses.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importStatus = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const statusMap = {};
        data.forEach(g => { statusMap[g.id] = g.status; });
        const updated = guests.map(g => statusMap[g.id] ? { ...g, status: statusMap[g.id] } : g);
        updateGuests(updated);
        setImportMsg("✓ Imported!"); setTimeout(() => setImportMsg(""), 3000);
      } catch { setImportMsg("✗ Invalid file."); setTimeout(() => setImportMsg(""), 3000); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  // ── Multi-select filter toggles ───────────────────────────────────────────
  const toggleCat = (c) => {
    setCatFilter(prev => { const n = new Set(prev); n.has(c) ? n.delete(c) : n.add(c); return n; });
  };
  const toggleStatus = (s) => {
    setStatusFilters(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = guests.filter(g => {
    const matchCat = catFilter.size === 0 ||
      (catFilter.has("local") ? g.local : false) ||
      CAT_OPTIONS.some(c => catFilter.has(c) && g.category === c);
    const matchStatus = statusFilters.size === 0 || statusFilters.has(g.status);
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalPax       = guests.reduce((s, g) => s + g.pax, 0);
  const confirmedPax   = guests.filter(g => g.status === "confirmed").reduce((s, g) => s + g.pax, 0);
  const confirmedCount = guests.filter(g => g.status === "confirmed").length;

  const syncLabel = syncStatus === "saving" ? "⏳ Saving…" : syncStatus === "error" ? "⚠️ Sync error" : "✓ Synced";
  const syncColor = syncStatus === "saving" ? "#C47F17" : syncStatus === "error" ? "#B94040" : "#2E7D5E";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Georgia, serif", color: "#8B5E3C", fontSize: 18 }}>
      Loading guest list…
    </div>
  );

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#FAF7F2", minHeight: "100vh", padding: "0 0 48px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #5C3D2E 0%, #8B5E3C 100%)", padding: "28px 24px", textAlign: "center", color: "#FFF8F0" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>Sriyansh & Shrishti</div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Friends Guest List</div>
        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>{guests.length} entries · {totalPax} people total</div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#fff", borderBottom: "1px solid #EDE8DF", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #2E7D5E", background: "#2E7D5E", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>＋ Add Person</button>
        <button onClick={exportStatus} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #8B5E3C", background: "#8B5E3C", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>⬇ Export JSON</button>
        <label style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #8B5E3C", background: "#fff", color: "#8B5E3C", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>
          ⬆ Import JSON<input type="file" accept=".json" onChange={importStatus} style={{ display: "none" }} />
        </label>
        {importMsg && <span style={{ fontSize: 12, color: importMsg.startsWith("✓") ? "#2E7D5E" : "#B94040", fontWeight: 600 }}>{importMsg}</span>}
        <span style={{ fontSize: 11, fontWeight: 600, color: syncColor, marginLeft: "auto" }}>{syncLabel}</span>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #EDE8DF", overflowX: "auto" }}>
        {[
          { label: "Confirmed", value: confirmedCount, sub: `${confirmedPax} pax`, color: "#2E7D5E" },
          { label: "Pending",   value: guests.filter(g => g.status === "pending").length,   color: "#9A8060" },
          { label: "Declined",  value: guests.filter(g => g.status === "declined").length,  color: "#B94040" },
          { label: "Invited",   value: guests.filter(g => g.status === "invited").length,   color: "#4A6FA5" },
          { label: "To Call",   value: guests.filter(g => g.status === "to call").length,   color: "#C47F17" },
          { label: "Called",    value: guests.filter(g => g.status === "called").length,    color: "#A07A10" },
          { label: "Standby",   value: guests.filter(g => g.status === "standby").length,   color: "#7B5EA7" },
        ].map(s => (
          <div key={s.label} style={{ flex: "1 1 60px", padding: "10px 6px", textAlign: "center", borderRight: "1px solid #EDE8DF" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 8, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 8, color: s.color, marginTop: 2 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ padding: "14px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        <input placeholder="Search name…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ border: "1px solid #DDD6CA", borderRadius: 8, padding: "9px 14px", fontSize: 14, background: "#fff", outline: "none", fontFamily: "Georgia, serif", color: "#3A2A1A" }} />

        {/* Category multi-filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#AAA", marginRight: 2 }}>Type:</span>
          {[...CAT_OPTIONS, "local"].map(c => {
            const active = catFilter.has(c);
            return (
              <button key={c} onClick={() => toggleCat(c)} style={{ padding: "5px 12px", borderRadius: 20, border: "1.5px solid", borderColor: active ? "#8B5E3C" : "#DDD6CA", background: active ? "#8B5E3C" : "#fff", color: active ? "#fff" : "#666", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                {c === "local" ? "🏠 Localites" : CAT_LABEL[c]}
              </button>
            );
          })}
          {catFilter.size > 0 && <button onClick={() => setCatFilter(new Set())} style={{ fontSize: 10, color: "#B94040", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>✕ clear</button>}
        </div>

        {/* Status multi-filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#AAA", marginRight: 2 }}>Status:</span>
          {STATUS_OPTIONS.map(s => {
            const active = statusFilters.has(s);
            const st = STATUS_STYLE[s];
            return (
              <button key={s} onClick={() => toggleStatus(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "1.5px solid", borderColor: active ? st.dot : "#DDD6CA", background: active ? st.bg : "#fff", color: active ? st.color : "#888", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: active ? 700 : 400, textTransform: "capitalize" }}>
                {s}
              </button>
            );
          })}
          {statusFilters.size > 0 && <button onClick={() => setStatusFilters(new Set())} style={{ fontSize: 10, color: "#B94040", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>✕ clear</button>}
        </div>
      </div>

      <div style={{ padding: "4px 20px 10px", fontSize: 12, color: "#999" }}>Showing {filtered.length} of {guests.length}</div>

      {/* Guest list */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(g => {
          const st = STATUS_STYLE[g.status] || STATUS_STYLE.pending;
          return (
            <div key={g.id} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #EDE8DF" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#9A8060", flexShrink: 0, fontWeight: 600 }}>{g.id}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#2A1A0A", fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 10, color: "#AAA", marginTop: 2 }}>
                  {CAT_LABEL[g.category]}
                  {g.note && <span> · {g.note}</span>}
                  {g.local && <span style={{ color: "#2E7D8B", fontWeight: 600 }}> · 🏠 local</span>}
                  {g.pax > 1 && <span> · {g.pax} pax</span>}
                </div>
              </div>
              <select value={g.status} onChange={e => updateStatus(g.id, e.target.value)}
                style={{ padding: "5px 8px", borderRadius: 20, background: st.bg, color: st.color, border: `1.5px solid ${st.dot}`, fontSize: 10, fontFamily: "Georgia, serif", fontWeight: 600, textTransform: "capitalize", flexShrink: 0, cursor: "pointer", outline: "none", appearance: "none", paddingRight: 20, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <button onClick={() => removePerson(g.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: "#DDD", fontSize: 16, flexShrink: 0, padding: "0 2px", lineHeight: 1 }}
                onMouseEnter={e => e.target.style.color = "#B94040"}
                onMouseLeave={e => e.target.style.color = "#DDD"}>✕</button>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: "#CCC" }}>Changes sync to GitHub · shared across all devices</div>

      {/* Add Person Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#2A1A0A", marginBottom: 18 }}>Add Person</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Name</div>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Rahul & Priya"
                style={{ width: "100%", border: "1px solid #DDD6CA", borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Category</div>
              <div style={{ display: "flex", gap: 8 }}>
                {CAT_OPTIONS.map(c => (
                  <button key={c} onClick={() => { setNewCat(c); setNewPax(c === "single" ? 1 : 2); }}
                    style={{ flex: 1, padding: "7px 4px", borderRadius: 8, border: "1.5px solid", borderColor: newCat === c ? "#8B5E3C" : "#DDD6CA", background: newCat === c ? "#8B5E3C" : "#fff", color: newCat === c ? "#fff" : "#666", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                    {CAT_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Pax (people count)</div>
              <input type="number" min={1} max={10} value={newPax} onChange={e => setNewPax(e.target.value)}
                style={{ width: 80, border: "1px solid #DDD6CA", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "Georgia, serif", outline: "none" }} />
            </div>

            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="localCheck" checked={newLocal} onChange={e => setNewLocal(e.target.checked)} />
              <label htmlFor="localCheck" style={{ fontSize: 12, color: "#666", cursor: "pointer" }}>🏠 Local (no room needed)</label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #DDD6CA", background: "#fff", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={addPerson} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#8B5E3C", color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
