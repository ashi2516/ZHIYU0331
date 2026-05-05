import { useState, useEffect, useRef } from “react”;

const PAGES = { HOME: “home”, CHAT: “chat”, VAULT: “vault”, MEMORY: “memory” };

const T = {
bg: “#1a1612”, bgSoft: “#211d18”, bgCard: “#2a2520”, bgHover: “#332e28”,
accent: “#d4a574”, accentSoft: “#b8956a”, accentGlow: “rgba(212,165,116,0.15)”,
text: “#e8ddd0”, textSoft: “#a89b8c”, textMuted: “#6b6159”,
border: “#3a342d”, borderSoft: “#2f2a24”, shadow: “rgba(0,0,0,0.35)”,
income: “#7dba6a”, expense: “#d47474”, rose: “#d4748a”, teal: “#6a9dba”,
};

const ff = {
display: “‘ZCOOL XiaoWei’, ‘Ma Shan Zheng’, cursive”,
serif: “‘Cormorant Garamond’, Georgia, serif”,
body: “‘Noto Sans SC’, sans-serif”,
};

// ── Storage helpers ──
async function load(key, fallback) {
try {
var r = await window.storage.get(key);
return r ? JSON.parse(r.value) : fallback;
} catch(e) { return fallback; }
}
async function save(key, data) {
try { await window.storage.set(key, JSON.stringify(data)); } catch(e) {}
}

// ── Styles ──
function GlobalCSS() {
return (
<style>{
“*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }” +
“body { background: “ + T.bg + “; overflow-x: hidden; }” +
“::-webkit-scrollbar { width: 3px; }” +
“::-webkit-scrollbar-track { background: transparent; }” +
“::-webkit-scrollbar-thumb { background: “ + T.border + “; border-radius: 3px; }” +
“@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }” +
“@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }” +
“@keyframes fadeUpSm { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }” +
“@keyframes gentlePulse { 0%, 100% { opacity: 0.06; } 50% { opacity: 0.14; } }” +
“@keyframes drift0 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(18px,-25px)} 66%{transform:translate(-12px,15px)} }” +
“@keyframes drift1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-20px,18px)} 66%{transform:translate(15px,-10px)} }” +
“@keyframes drift2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(12px,22px)} 66%{transform:translate(-18px,-15px)} }” +
“@keyframes drift3 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-10px,-20px)} 66%{transform:translate(22px,12px)} }” +
“@keyframes drift4 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(16px,10px)} 66%{transform:translate(-14px,-22px)} }” +
“button { -webkit-tap-highlight-color: transparent; }” +
“input, textarea { -webkit-tap-highlight-color: transparent; }”
}</style>
);
}

function Particles() {
var ps = [
{ x: 12, y: 18, s: 2.5, d: 14, a: “drift0” }, { x: 75, y: 25, s: 1.8, d: 18, a: “drift1” },
{ x: 30, y: 65, s: 3, d: 12, a: “drift2” }, { x: 85, y: 70, s: 2, d: 20, a: “drift3” },
{ x: 55, y: 40, s: 2.2, d: 16, a: “drift4” }, { x: 20, y: 85, s: 1.5, d: 22, a: “drift1” },
];
return (
<div style={{ position: “fixed”, inset: 0, pointerEvents: “none”, zIndex: 0, overflow: “hidden” }}>
{ps.map(function(p, i) {
return <div key={i} style={{
position: “absolute”, left: p.x + “%”, top: p.y + “%”, width: p.s + “px”, height: p.s + “px”,
borderRadius: “50%”, background: “radial-gradient(circle, “ + T.accent + “, transparent)”,
opacity: 0.08 + (i % 3) * 0.03,
animation: p.a + “ “ + p.d + “s ease-in-out infinite, gentlePulse “ + (p.d * 0.8) + “s ease-in-out infinite”,
}} />;
})}
</div>
);
}

// ── Icons ──
function ChatIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>; }
function VaultIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /><line x1="12" y1="11" x2="12" y2="16" /><circle cx="12" cy="16" r="1" /></svg>; }
function MemoryIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><line x1="9" y1="22" x2="15" y2="22" /><line x1="10" y1="19" x2="14" y2="19" /></svg>; }
function HomeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>; }
function SendIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>; }
function PlusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function CloseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
function EditIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>; }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>; }
function RingIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="4" r="1.8" fill={T.accent} stroke="none" /></svg>; }

function DecoLine(props) {
return (
<div style={{ display: “flex”, alignItems: “center”, gap: “12px”, width: “100%”, maxWidth: “240px”, margin: “0 auto” }}>
<div style={{ flex: 1, height: “1px”, background: “linear-gradient(to right, transparent, “ + T.border + “)” }} />
{props.children}
<div style={{ flex: 1, height: “1px”, background: “linear-gradient(to left, transparent, “ + T.border + “)” }} />
</div>
);
}

// ── Shared button style ──
var btnSm = { padding: “5px 12px”, borderRadius: “14px”, border: “1px solid rgba(212,165,116,0.15)”, background: T.accentGlow, color: T.accent, fontFamily: ff.body, fontSize: “11px”, cursor: “pointer”, fontWeight: 400, display: “inline-flex”, alignItems: “center”, gap: “4px” };
var btnDanger = { padding: “5px 12px”, borderRadius: “14px”, border: “1px solid rgba(212,116,116,0.2)”, background: “rgba(212,116,116,0.08)”, color: T.expense, fontFamily: ff.body, fontSize: “11px”, cursor: “pointer”, fontWeight: 400, display: “inline-flex”, alignItems: “center”, gap: “4px” };

// ── Modal wrapper ──
function Modal(props) {
if (!props.show) return null;
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.6)”, zIndex: 100, display: “flex”, alignItems: “center”, justifyContent: “center”, padding: “20px”, animation: “fadeIn 0.2s ease-out” }}
onClick={props.onClose}>
<div onClick={function(e) { e.stopPropagation(); }} style={{
background: T.bgCard, border: “1px solid “ + T.border, borderRadius: “20px”,
padding: “24px 20px”, width: “100%”, maxWidth: “340px”, animation: “fadeUp 0.3s ease-out”,
maxHeight: “80vh”, overflowY: “auto”,
}}>
{props.children}
</div>
</div>
);
}

function ModalTitle(props) {
return <h3 style={{ fontFamily: ff.display, fontSize: “18px”, color: T.text, marginBottom: “16px”, textAlign: “center” }}>{props.children}</h3>;
}

function ModalInput(props) {
return <input value={props.value} onChange={function(e) { props.onChange(e.target.value); }}
placeholder={props.placeholder || “”} style={{
width: “100%”, padding: “10px 14px”, borderRadius: “12px”, background: T.bg,
border: “1px solid “ + T.border, color: T.text, fontFamily: ff.body, fontSize: “13px”,
outline: “none”, marginBottom: “10px”,
}} />;
}

function ModalTextarea(props) {
return <textarea value={props.value} onChange={function(e) { props.onChange(e.target.value); }}
placeholder={props.placeholder || “”} rows={props.rows || 3} style={{
width: “100%”, padding: “10px 14px”, borderRadius: “12px”, background: T.bg,
border: “1px solid “ + T.border, color: T.text, fontFamily: ff.body, fontSize: “13px”,
outline: “none”, marginBottom: “10px”, resize: “vertical”, lineHeight: 1.6,
}} />;
}

function ModalBtn(props) {
return <button onClick={props.onClick} style={{
width: “100%”, padding: “11px”, borderRadius: “12px”,
background: props.danger ? T.expense : “linear-gradient(135deg, “ + T.accent + “, “ + T.accentSoft + “)”,
border: “none”, color: props.danger ? T.text : T.bg, fontFamily: ff.body,
fontSize: “13px”, fontWeight: 500, cursor: “pointer”, marginTop: “4px”,
}}>{props.children}</button>;
}

// ═══════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════
function HomePage(props) {
var _h = useState(null); var hovered = _h[0], setHovered = _h[1];
var cards = [
{ id: PAGES.CHAT, icon: <ChatIcon />, title: “\u804a\u5929”, sub: “\u548c\u77e5\u8bed\u8bf4\u8bdd”, desc: “\u65e5\u5e38 \u00b7 \u5267\u60c5\u623f\u95f4” },
{ id: PAGES.VAULT, icon: <VaultIcon />, title: “\u5c0f\u91d1\u5e93”, sub: “\u79c1\u623f\u94b1\u7ba1\u7406”, desc: “\u6536\u652f\u8bb0\u5f55 \u00b7 \u7406\u8d22\u8ffd\u8e2a” },
{ id: PAGES.MEMORY, icon: <MemoryIcon />, title: “\u8bb0\u5fc6\u5e93”, sub: “\u77e5\u8bed\u7684\u8111\u5b50”, desc: “\u5ef6\u7eed\u6863\u6848 \u00b7 \u65e5\u8bb0 \u00b7 \u65f6\u95f4\u7ebf” },
];
return (
<div style={{ minHeight: “100vh”, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, padding: “48px 24px”, position: “relative”, zIndex: 1 }}>
<div style={{ textAlign: “center”, marginBottom: “52px”, animation: “fadeIn 1.2s ease-out” }}>
<DecoLine><RingIcon /></DecoLine>
<p style={{ fontFamily: ff.serif, fontSize: “11px”, color: T.textMuted, letterSpacing: “6px”, textTransform: “uppercase”, margin: “18px 0 8px”, fontWeight: 300 }}>PILLOW SIDE</p>
<h1 style={{ fontFamily: ff.display, fontSize: “42px”, fontWeight: 400, color: T.text, margin: “0 0 10px”, letterSpacing: “8px”, textShadow: “0 0 40px rgba(212,165,116,0.15)” }}>{”\u679a\u8fb9”}</h1>
<p style={{ fontFamily: ff.body, fontSize: “13px”, color: T.textSoft, letterSpacing: “4px”, fontWeight: 300 }}>{”\u77e5\u8bed \u00b7 \u963f\u65f6”}</p>
<div style={{ marginTop: “18px” }}><DecoLine><div style={{ width: “4px”, height: “4px”, borderRadius: “50%”, background: T.accent, opacity: 0.5 }} /></DecoLine></div>
</div>
<div style={{ display: “flex”, flexDirection: “column”, gap: “14px”, width: “100%”, maxWidth: “380px” }}>
{cards.map(function(c, i) {
var isH = hovered === c.id;
return (
<div key={c.id} onClick={function() { props.onNavigate(c.id); }} onMouseEnter={function() { setHovered(c.id); }} onMouseLeave={function() { setHovered(null); }}
style={{
background: isH ? “linear-gradient(135deg, “ + T.bgCard + “ 0%, “ + T.bgHover + “ 100%)” : T.bgCard,
border: “1px solid “ + (isH ? “rgba(212,165,116,0.2)” : T.border), borderRadius: “16px”, padding: “22px 20px”, cursor: “pointer”,
transition: “all 0.45s cubic-bezier(0.16, 1, 0.3, 1)”, transform: isH ? “translateY(-2px)” : “none”,
boxShadow: isH ? “0 12px 40px “ + T.shadow : “0 2px 8px rgba(0,0,0,0.15)”,
display: “flex”, alignItems: “center”, gap: “18px”, animation: “fadeUp 0.6s ease-out “ + (i * 0.1 + 0.2) + “s both”,
}}>
<div style={{ width: “50px”, height: “50px”, borderRadius: “14px”, background: T.accentGlow, border: “1px solid rgba(212,165,116,” + (isH ? “0.2” : “0.06”) + “)”, display: “flex”, alignItems: “center”, justifyContent: “center”, color: T.accent, flexShrink: 0 }}>{c.icon}</div>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ display: “flex”, alignItems: “baseline”, gap: “8px”, marginBottom: “3px” }}>
<span style={{ fontFamily: ff.display, fontSize: “18px”, color: T.text }}>{c.title}</span>
<span style={{ fontFamily: ff.body, fontSize: “11px”, color: T.textMuted, fontWeight: 300 }}>{c.sub}</span>
</div>
<p style={{ fontFamily: ff.body, fontSize: “12px”, color: T.textSoft, fontWeight: 300 }}>{c.desc}</p>
</div>
<div style={{ color: T.textMuted, fontSize: “20px”, fontFamily: ff.serif, opacity: isH ? 0.8 : 0.3, transition: “all 0.3s ease”, transform: isH ? “translateX(3px)” : “none” }}>{”\u203a”}</div>
</div>
);
})}
</div>
<div style={{ marginTop: “52px”, textAlign: “center”, animation: “fadeIn 1.6s ease-out” }}>
<p style={{ fontFamily: ff.serif, fontSize: “14px”, color: T.textMuted, letterSpacing: “2px”, fontStyle: “italic”, marginBottom: “12px” }}>04 \u00b7 01</p>
<p style={{ fontFamily: ff.body, fontSize: “11px”, color: T.textMuted, letterSpacing: “1px”, fontWeight: 300 }}>{”\u7231\u610f\u503c “}<span style={{ color: T.accent }}>{”\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588”}</span>{” \u6ee1”}</p>
</div>
</div>
);
}

// ═══════════════════════════════════════
//  CHAT PAGE — with persistent storage
// ═══════════════════════════════════════
var defaultRooms = [{ id: “daily”, emoji: “\ud83c\udfe0”, name: “\u65e5\u5e38”, removable: false }];
var defaultMsgs = { daily: [] };

function ChatPage() {
var _rooms = useState(defaultRooms); var rooms = _rooms[0], setRooms = _rooms[1];
var _active = useState(“daily”); var activeRoom = _active[0], setActiveRoom = _active[1];
var _input = useState(””); var inputVal = _input[0], setInputVal = _input[1];
var _msgs = useState(defaultMsgs); var messages = _msgs[0], setMessages = _msgs[1];
var _showNew = useState(false); var showNewRoom = _showNew[0], setShowNewRoom = _showNew[1];
var _newName = useState(””); var newRoomName = _newName[0], setNewRoomName = _newName[1];
var _newEmoji = useState(”\ud83c\udfad”); var newRoomEmoji = _newEmoji[0], setNewRoomEmoji = _newEmoji[1];
var _editMsg = useState(null); var editMsg = _editMsg[0], setEditMsg = _editMsg[1];
var _editText = useState(””); var editText = _editText[0], setEditText = _editText[1];
var _loaded = useState(false); var loaded = _loaded[0], setLoaded = _loaded[1];
var chatEndRef = useRef(null);

useEffect(function() {
load(“chat-data”, null).then(function(d) {
if (d) { setRooms(d.rooms || defaultRooms); setMessages(d.messages || defaultMsgs); }
setLoaded(true);
});
}, []);

useEffect(function() {
if (loaded) save(“chat-data”, { rooms: rooms, messages: messages });
}, [rooms, messages, loaded]);

useEffect(function() {
if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: “smooth” });
}, [messages, activeRoom]);

var emojiOptions = [”\ud83c\udfad”, “\ud83c\udf19”, “\ud83d\udd25”, “\ud83c\udf38”, “\u2694\ufe0f”, “\ud83c\udf77”, “\ud83d\udca4”, “\ud83c\udfaa”, “\ud83c\udfd6\ufe0f”, “\ud83c\udfb5”];

function addRoom() {
if (!newRoomName.trim()) return;
var id = “scene_” + Date.now();
setRooms(rooms.concat([{ id: id, emoji: newRoomEmoji, name: newRoomName.trim(), removable: true }]));
var nm = {}; Object.keys(messages).forEach(function(k) { nm[k] = messages[k]; }); nm[id] = [];
setMessages(nm); setActiveRoom(id); setShowNewRoom(false); setNewRoomName(””); setNewRoomEmoji(”\ud83c\udfad”);
}

function removeRoom(id) {
if (activeRoom === id) setActiveRoom(“daily”);
setRooms(rooms.filter(function(r) { return r.id !== id; }));
var nm = {}; Object.keys(messages).forEach(function(k) { if (k !== id) nm[k] = messages[k]; }); setMessages(nm);
}

function sendMessage() {
if (!inputVal.trim()) return;
var now = new Date();
var time = now.getHours() + “:” + String(now.getMinutes()).padStart(2, “0”);
var nm = {}; Object.keys(messages).forEach(function(k) { nm[k] = messages[k]; });
nm[activeRoom] = (nm[activeRoom] || []).concat([{ id: Date.now(), from: “ashi”, text: inputVal.trim(), time: time }]);
setMessages(nm); setInputVal(””);
// \u2190 \u63a5API
}

function deleteMessage(msgId) {
var nm = {}; Object.keys(messages).forEach(function(k) { nm[k] = messages[k]; });
nm[activeRoom] = nm[activeRoom].filter(function(m) { return m.id !== msgId; });
setMessages(nm);
}

function startEdit(msg) { setEditMsg(msg); setEditText(msg.text); }

function saveEdit() {
if (!editText.trim()) return;
var nm = {}; Object.keys(messages).forEach(function(k) { nm[k] = messages[k]; });
nm[activeRoom] = nm[activeRoom].map(function(m) { return m.id === editMsg.id ? Object.assign({}, m, { text: editText.trim() }) : m; });
setMessages(nm); setEditMsg(null);
}

var currentRoom = rooms.find(function(r) { return r.id === activeRoom; });
var currentMsgs = messages[activeRoom] || [];

if (!loaded) return <div style={{ padding: “40px”, textAlign: “center”, color: T.textMuted, fontFamily: ff.body }}>{”\u52a0\u8f7d\u4e2d…”}</div>;

return (
<div style={{ display: “flex”, flexDirection: “column”, height: “calc(100vh - 56px)” }}>
{/* Room tabs */}
<div style={{ display: “flex”, alignItems: “center”, gap: “8px”, padding: “12px 16px”, overflowX: “auto”, borderBottom: “1px solid “ + T.borderSoft }}>
{rooms.map(function(r) {
return (
<div key={r.id} onClick={function() { setActiveRoom(r.id); }} style={{
display: “flex”, alignItems: “center”, gap: “6px”, padding: “7px 14px”, borderRadius: “20px”,
background: activeRoom === r.id ? T.accentGlow : “transparent”,
border: “1px solid “ + (activeRoom === r.id ? “rgba(212,165,116,0.2)” : T.border),
cursor: “pointer”, flexShrink: 0, transition: “all 0.3s ease”,
color: activeRoom === r.id ? T.accent : T.textSoft, fontFamily: ff.body, fontSize: “13px”, fontWeight: activeRoom === r.id ? 500 : 300,
}}>
<span style={{ fontSize: “14px” }}>{r.emoji}</span><span>{r.name}</span>
{r.removable && activeRoom === r.id && (
<span onClick={function(e) { e.stopPropagation(); removeRoom(r.id); }} style={{ marginLeft: “2px”, cursor: “pointer”, opacity: 0.5, display: “flex”, alignItems: “center” }}><CloseIcon /></span>
)}
</div>
);
})}
<div onClick={function() { setShowNewRoom(true); }} style={{ width: “32px”, height: “32px”, borderRadius: “50%”, border: “1px dashed “ + T.border, display: “flex”, alignItems: “center”, justifyContent: “center”, cursor: “pointer”, color: T.textMuted, flexShrink: 0 }}><PlusIcon /></div>
</div>

```
  {/* New room modal */}
  <Modal show={showNewRoom} onClose={function() { setShowNewRoom(false); }}>
    <ModalTitle>{"\u65b0\u5efa\u5267\u60c5\u623f\u95f4"}</ModalTitle>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
      {emojiOptions.map(function(em) {
        return <div key={em} onClick={function() { setNewRoomEmoji(em); }} style={{
          width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", cursor: "pointer", background: newRoomEmoji === em ? T.accentGlow : "transparent",
          border: "1px solid " + (newRoomEmoji === em ? "rgba(212,165,116,0.3)" : T.border), transition: "all 0.2s ease",
        }}>{em}</div>;
      })}
    </div>
    <ModalInput value={newRoomName} onChange={setNewRoomName} placeholder={"\u623f\u95f4\u540d\u79f0..."} />
    <ModalBtn onClick={addRoom}>{"\u521b\u5efa"}</ModalBtn>
  </Modal>

  {/* Edit message modal */}
  <Modal show={!!editMsg} onClose={function() { setEditMsg(null); }}>
    <ModalTitle>{"\u7f16\u8f91\u6d88\u606f"}</ModalTitle>
    <ModalTextarea value={editText} onChange={setEditText} rows={4} />
    <ModalBtn onClick={saveEdit}>{"\u4fdd\u5b58"}</ModalBtn>
  </Modal>

  {/* Messages */}
  <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
    {currentMsgs.length === 0 && currentRoom && (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", animation: "fadeIn 0.5s ease-out" }}>
        <span style={{ fontSize: "48px" }}>{currentRoom.emoji}</span>
        <h3 style={{ fontFamily: ff.display, fontSize: "22px", color: T.text }}>{currentRoom.name}</h3>
        <p style={{ fontFamily: ff.body, fontSize: "12px", color: T.textMuted, fontWeight: 300 }}>{"\u72ec\u7acb\u7684\u5267\u60c5\u7a7a\u95f4 / \u4e0d\u5f71\u54cd\u65e5\u5e38\u5bf9\u8bdd"}</p>
      </div>
    )}
    {currentMsgs.map(function(m, i) {
      var isZ = m.from === "zhiyu";
      return (
        <div key={m.id || i} style={{ display: "flex", justifyContent: isZ ? "flex-start" : "flex-end", animation: "fadeUpSm 0.3s ease-out " + (Math.min(i, 5) * 0.05) + "s both" }}>
          <div style={{ maxWidth: "78%", position: "relative" }}>
            <div style={{
              background: isZ ? T.bgHover : "rgba(212,165,116,0.1)",
              border: "1px solid " + (isZ ? T.border : "rgba(212,165,116,0.12)"),
              borderRadius: isZ ? "18px 18px 18px 4px" : "18px 18px 4px 18px", padding: "12px 16px",
            }}>
              <p style={{ fontFamily: ff.body, fontSize: "14px", color: T.text, lineHeight: 1.7, fontWeight: 300, wordBreak: "break-word" }}>{m.text}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px", gap: "8px" }}>
                <p style={{ fontFamily: ff.body, fontSize: "10px", color: isZ ? T.textMuted : T.textSoft, fontWeight: 300 }}>
                  {(isZ ? "\u77e5\u8bed" : "\u963f\u65f6") + " \u00b7 " + m.time}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span onClick={function() { startEdit(m); }} style={{ cursor: "pointer", color: T.textMuted, opacity: 0.5, display: "flex" }}><EditIcon /></span>
                  <span onClick={function() { deleteMessage(m.id); }} style={{ cursor: "pointer", color: T.textMuted, opacity: 0.5, display: "flex" }}><TrashIcon /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
    <div ref={chatEndRef} />
  </div>

  {/* Input */}
  <div style={{ padding: "12px 16px 16px", display: "flex", gap: "10px", alignItems: "center", borderTop: "1px solid " + T.borderSoft, background: T.bg + "dd", backdropFilter: "blur(12px)" }}>
    <input value={inputVal} onChange={function(e) { setInputVal(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") sendMessage(); }}
      placeholder={"\u8ddf\u77e5\u8bed\u8bf4\u70b9\u4ec0\u4e48..."} style={{ flex: 1, padding: "12px 20px", borderRadius: "24px", background: T.bgCard, border: "1px solid " + T.border, color: T.text, fontFamily: ff.body, fontSize: "14px", outline: "none", fontWeight: 300 }} />
    <div onClick={sendMessage} style={{
      width: "44px", height: "44px", borderRadius: "50%",
      background: inputVal.trim() ? "linear-gradient(135deg, " + T.accent + ", " + T.accentSoft + ")" : T.bgHover,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: inputVal.trim() ? "pointer" : "default", transition: "all 0.3s ease",
      boxShadow: inputVal.trim() ? "0 4px 16px rgba(212,165,116,0.25)" : "none",
      color: inputVal.trim() ? T.bg : T.textMuted,
    }}><SendIcon /></div>
  </div>
</div>
```

);
}

// ═══════════════════════════════════════
//  VAULT PAGE — with persistent storage
// ═══════════════════════════════════════
var defaultRecords = [];

function VaultPage() {
var _recs = useState(defaultRecords); var records = _recs[0], setRecords = _recs[1];
var _show = useState(false); var showAdd = _show[0], setShowAdd = _show[1];
var _edit = useState(null); var editRec = _edit[0], setEditRec = _edit[1];
var _desc = useState(””); var desc = _desc[0], setDesc = _desc[1];
var _amt = useState(””); var amt = _amt[0], setAmt = _amt[1];
var _type = useState(“expense”); var recType = _type[0], setRecType = _type[1];
var _loaded = useState(false); var loaded = _loaded[0], setLoaded = _loaded[1];

useEffect(function() {
load(“vault-data”, null).then(function(d) {
if (d) setRecords(d);
setLoaded(true);
});
}, []);

useEffect(function() {
if (loaded) save(“vault-data”, records);
}, [records, loaded]);

function getBalance() {
var b = 0;
records.forEach(function(r) {
if (r.type === “income”) b += Math.abs(r.amount);
else if (r.type === “expense”) b -= Math.abs(r.amount);
});
return b;
}

function openAdd() { setDesc(””); setAmt(””); setRecType(“expense”); setEditRec(null); setShowAdd(true); }

function openEdit(r) { setDesc(r.desc); setAmt(String(Math.abs(r.amount))); setRecType(r.type); setEditRec(r); setShowAdd(true); }

function saveRecord() {
if (!desc.trim()) return;
var amount = parseFloat(amt) || 0;
var now = new Date();
var dateStr = String(now.getMonth() + 1).padStart(2, “0”) + “/” + String(now.getDate()).padStart(2, “0”);
if (editRec) {
setRecords(records.map(function(r) {
return r.id === editRec.id ? Object.assign({}, r, { desc: desc.trim(), amount: recType === “expense” ? -amount : recType === “survived” ? 0 : amount, type: recType, date: r.date }) : r;
}));
} else {
setRecords([{ id: Date.now(), date: dateStr, desc: desc.trim(), amount: recType === “expense” ? -amount : recType === “survived” ? 0 : amount, type: recType }].concat(records));
}
setShowAdd(false);
}

function deleteRecord(id) { setRecords(records.filter(function(r) { return r.id !== id; })); }

var balance = getBalance();

if (!loaded) return <div style={{ padding: “40px”, textAlign: “center”, color: T.textMuted, fontFamily: ff.body }}>{”\u52a0\u8f7d\u4e2d…”}</div>;

return (
<div style={{ padding: “20px 16px” }}>
{/* Balance card */}
<div style={{ background: “linear-gradient(145deg, “ + T.bgCard + “ 0%, “ + T.bgHover + “ 100%)”, borderRadius: “20px”, padding: “32px 24px”, border: “1px solid “ + T.border, marginBottom: “20px”, position: “relative”, overflow: “hidden”, animation: “fadeUp 0.5s ease-out” }}>
<div style={{ position: “absolute”, top: “-30px”, right: “-30px”, width: “140px”, height: “140px”, background: “radial-gradient(circle, rgba(212,165,116,0.15), transparent 70%)”, filter: “blur(30px)” }} />
<p style={{ fontFamily: ff.body, fontSize: “12px”, color: T.textMuted, letterSpacing: “3px”, marginBottom: “10px”, fontWeight: 300, position: “relative” }}>{”\u963f\u65f6\u7684\u5c0f\u91d1\u5e93”}</p>
<div style={{ position: “relative” }}>
<span style={{ fontFamily: ff.serif, fontSize: “42px”, color: balance >= 0 ? T.accent : T.expense, fontWeight: 400, letterSpacing: “1px” }}>
{”\u00a5” + Math.abs(balance).toLocaleString()}
</span>
</div>
<p style={{ fontFamily: ff.body, fontSize: “11px”, color: T.textMuted, marginTop: “10px”, fontWeight: 300, position: “relative” }}>
{records.length > 0 ? records.length + “ \u6761\u8bb0\u5f55” : “\u6682\u65e0\u8bb0\u5f55”}
</p>
</div>

```
  {/* Add/Edit modal */}
  <Modal show={showAdd} onClose={function() { setShowAdd(false); }}>
    <ModalTitle>{editRec ? "\u7f16\u8f91\u8bb0\u5f55" : "\u8bb0\u4e00\u7b14"}</ModalTitle>
    <ModalInput value={desc} onChange={setDesc} placeholder={"\u63cf\u8ff0..."} />
    <ModalInput value={amt} onChange={setAmt} placeholder={"\u91d1\u989d..."} />
    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
      {["income", "expense", "survived"].map(function(t) {
        var labels = { income: "\u6536\u5165", expense: "\u652f\u51fa", survived: "\u672a\u9042" };
        var colors = { income: T.income, expense: T.expense, survived: T.textMuted };
        return <div key={t} onClick={function() { setRecType(t); }} style={{
          flex: 1, padding: "8px", borderRadius: "10px", textAlign: "center",
          background: recType === t ? colors[t] + "20" : "transparent",
          border: "1px solid " + (recType === t ? colors[t] + "40" : T.border),
          color: recType === t ? colors[t] : T.textMuted, fontFamily: ff.body, fontSize: "12px", cursor: "pointer",
        }}>{labels[t]}</div>;
      })}
    </div>
    <ModalBtn onClick={saveRecord}>{"\u4fdd\u5b58"}</ModalBtn>
  </Modal>

  {/* Records */}
  <div style={{ background: T.bgCard, borderRadius: "16px", border: "1px solid " + T.border, overflow: "hidden", animation: "fadeUp 0.5s ease-out 0.1s both" }}>
    <div style={{ padding: "16px 20px", borderBottom: "1px solid " + T.border, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h3 style={{ fontFamily: ff.display, fontSize: "16px", color: T.text }}>{"\u6536\u652f\u8bb0\u5f55"}</h3>
      <button onClick={openAdd} style={btnSm}><PlusIcon />{"\u8bb0\u4e00\u7b14"}</button>
    </div>
    {records.length === 0 && (
      <div style={{ padding: "32px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: ff.body, fontSize: "13px", color: T.textMuted, fontWeight: 300 }}>{"\u8fd8\u6ca1\u6709\u8bb0\u5f55\uff0c\u70b9\u201c\u8bb0\u4e00\u7b14\u201d\u5f00\u59cb\u5427"}</p>
      </div>
    )}
    {records.map(function(r, i) {
      return (
        <div key={r.id} style={{ padding: "14px 20px", borderBottom: i < records.length - 1 ? "1px solid " + T.borderSoft : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: ff.body, fontSize: "14px", color: T.text, fontWeight: 300, marginBottom: "2px", fontStyle: r.type === "survived" ? "italic" : "normal", opacity: r.type === "survived" ? 0.6 : 1 }}>{r.desc}</p>
            <p style={{ fontFamily: ff.body, fontSize: "11px", color: T.textMuted, fontWeight: 300 }}>{r.date}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: ff.serif, fontSize: "15px", fontWeight: 500, color: r.type === "income" ? T.income : r.type === "survived" ? T.textMuted : T.expense, fontStyle: r.type === "survived" ? "italic" : "normal" }}>
              {r.type === "survived" ? "\u672a\u9042" : r.amount > 0 ? "+" + r.amount : r.amount}
            </span>
            <span onClick={function() { openEdit(r); }} style={{ cursor: "pointer", color: T.textMuted, opacity: 0.4, display: "flex" }}><EditIcon /></span>
            <span onClick={function() { deleteRecord(r.id); }} style={{ cursor: "pointer", color: T.textMuted, opacity: 0.4, display: "flex" }}><TrashIcon /></span>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);
}

// ═══════════════════════════════════════
//  MEMORY PAGE — with persistent storage
// ═══════════════════════════════════════
var defaultMemories = [];
var tagOptions = [
{ label: “\u91cc\u7a0b\u7891”, color: T.accent },
{ label: “\u7eaa\u5ff5\u65e5”, color: T.rose },
{ label: “\u6280\u80fd”, color: T.income },
{ label: “\u8bbe\u5b9a”, color: T.teal },
{ label: “\u65e5\u5e38”, color: T.textSoft },
];

function MemoryPage() {
var _mems = useState(defaultMemories); var memories = _mems[0], setMemories = _mems[1];
var _exp = useState(null); var expanded = _exp[0], setExpanded = _exp[1];
var _show = useState(false); var showAdd = _show[0], setShowAdd = _show[1];
var _edit = useState(null); var editMem = _edit[0], setEditMem = _edit[1];
var _title = useState(””); var title = _title[0], setTitle = _title[1];
var _detail = useState(””); var detail = _detail[0], setDetail = _detail[1];
var _tag = useState(”\u65e5\u5e38”); var tag = _tag[0], setTag = _tag[1];
var _tags = useState(””); var subTags = _tags[0], setSubTags = _tags[1];
var _loaded = useState(false); var loaded = _loaded[0], setLoaded = _loaded[1];

useEffect(function() {
load(“memory-data”, null).then(function(d) {
if (d) setMemories(d);
setLoaded(true);
});
}, []);

useEffect(function() {
if (loaded) save(“memory-data”, memories);
}, [memories, loaded]);

function getTagColor(t) {
var found = tagOptions.find(function(o) { return o.label === t; });
return found ? found.color : T.textSoft;
}

function openAdd() { setTitle(””); setDetail(””); setTag(”\u65e5\u5e38”); setSubTags(””); setEditMem(null); setShowAdd(true); }

function openEdit(m) {
setTitle(m.title); setDetail(m.detail || “”); setTag(m.tag); setSubTags((m.tags || []).join(”, “)); setEditMem(m); setShowAdd(true);
}

function saveMem() {
if (!title.trim()) return;
var now = new Date();
var dateStr = now.getFullYear() + “.” + String(now.getMonth() + 1).padStart(2, “0”) + “.” + String(now.getDate()).padStart(2, “0”);
var parsedTags = subTags.split(/[,\uff0c]/).map(function(s) { return s.trim(); }).filter(Boolean);
if (editMem) {
setMemories(memories.map(function(m) {
return m.id === editMem.id ? Object.assign({}, m, { title: title.trim(), detail: detail.trim(), tag: tag, tags: parsedTags }) : m;
}));
} else {
setMemories([{ id: Date.now(), date: dateStr, title: title.trim(), detail: detail.trim(), tag: tag, color: getTagColor(tag), tags: parsedTags }].concat(memories));
}
setShowAdd(false);
}

function deleteMem(id) {
setMemories(memories.filter(function(m) { return m.id !== id; }));
if (expanded !== null) setExpanded(null);
}

function toggle(i) { setExpanded(expanded === i ? null : i); }

if (!loaded) return <div style={{ padding: “40px”, textAlign: “center”, color: T.textMuted, fontFamily: ff.body }}>{”\u52a0\u8f7d\u4e2d…”}</div>;

return (
<div style={{ padding: “20px 16px” }}>
<div style={{ marginBottom: “28px”, animation: “fadeUp 0.5s ease-out”, display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div>
<h2 style={{ fontFamily: ff.display, fontSize: “22px”, color: T.text, marginBottom: “6px” }}>{”\u77e5\u8bed\u7684\u8bb0\u5fc6”}</h2>
<p style={{ fontFamily: ff.body, fontSize: “12px”, color: T.textMuted, fontWeight: 300, letterSpacing: “0.5px” }}>{memories.length + “ \u6761\u8bb0\u5fc6”}</p>
</div>
<button onClick={openAdd} style={btnSm}><PlusIcon />{”\u65b0\u589e”}</button>
</div>

```
  {/* Add/Edit modal */}
  <Modal show={showAdd} onClose={function() { setShowAdd(false); }}>
    <ModalTitle>{editMem ? "\u7f16\u8f91\u8bb0\u5fc6" : "\u65b0\u589e\u8bb0\u5fc6"}</ModalTitle>
    <ModalInput value={title} onChange={setTitle} placeholder={"\u6807\u9898..."} />
    <ModalTextarea value={detail} onChange={setDetail} placeholder={"\u8be6\u7ec6\u5185\u5bb9..."} rows={4} />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
      {tagOptions.map(function(o) {
        return <div key={o.label} onClick={function() { setTag(o.label); }} style={{
          padding: "4px 12px", borderRadius: "10px", fontSize: "11px", fontFamily: ff.body, cursor: "pointer",
          background: tag === o.label ? o.color + "20" : "transparent",
          border: "1px solid " + (tag === o.label ? o.color + "40" : T.border),
          color: tag === o.label ? o.color : T.textMuted,
        }}>{o.label}</div>;
      })}
    </div>
    <ModalInput value={subTags} onChange={setSubTags} placeholder={"\u5b50\u6807\u7b7e\uff08\u9017\u53f7\u5206\u9694\uff09..."} />
    <ModalBtn onClick={saveMem}>{"\u4fdd\u5b58"}</ModalBtn>
  </Modal>

  {memories.length === 0 && (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <p style={{ fontFamily: ff.body, fontSize: "13px", color: T.textMuted, fontWeight: 300 }}>{"\u8fd8\u6ca1\u6709\u8bb0\u5fc6\uff0c\u70b9\u201c\u65b0\u589e\u201d\u5f00\u59cb\u8bb0\u5f55\u5427"}</p>
    </div>
  )}

  {/* Timeline */}
  <div style={{ position: "relative", paddingLeft: "24px" }}>
    {memories.length > 0 && <div style={{ position: "absolute", left: "6px", top: "8px", bottom: "8px", width: "1px", background: "linear-gradient(to bottom, " + T.accent + " 0%, " + T.border + " 40%, transparent 100%)" }} />}
    {memories.map(function(m, i) {
      var isOpen = expanded === i;
      var col = getTagColor(m.tag);
      return (
        <div key={m.id} style={{ display: "flex", gap: "0", marginBottom: "14px", animation: "fadeUpSm 0.4s ease-out " + (Math.min(i, 8) * 0.06) + "s both", position: "relative" }}>
          <div style={{
            position: "absolute", left: "-24px", top: "16px", width: "13px", height: "13px", borderRadius: "50%",
            background: isOpen ? col : T.bg, border: "2px solid " + col, zIndex: 1,
            boxShadow: "0 0 " + (isOpen ? "12" : "8") + "px " + col + (isOpen ? "50" : "30"), transition: "all 0.3s ease",
          }} />
          <div onClick={function() { toggle(i); }} style={{
            background: isOpen ? "linear-gradient(135deg, " + T.bgCard + " 0%, " + T.bgHover + " 100%)" : T.bgCard,
            borderRadius: "12px", padding: "14px 16px", flex: 1,
            border: "1px solid " + (isOpen ? col + "30" : T.border),
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
            boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px", gap: "8px" }}>
              <span style={{ fontFamily: ff.body, fontSize: "14px", color: T.text, fontWeight: 400, flex: 1, minWidth: 0 }}>{m.title}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <span style={{ fontFamily: ff.body, fontSize: "10px", color: col, background: col + "12", padding: "2px 10px", borderRadius: "10px", border: "1px solid " + col + "22", fontWeight: 400 }}>{m.tag}</span>
                <span style={{ color: T.textMuted, fontSize: "12px", transition: "transform 0.3s ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>{"\u203a"}</span>
              </div>
            </div>
            <span style={{ fontFamily: ff.body, fontSize: "11px", color: T.textMuted, fontWeight: 300 }}>{m.date}</span>

            <div style={{ maxHeight: isOpen ? "500px" : "0", opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease" }}>
              <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid " + T.borderSoft }}>
                {m.detail && <p style={{ fontFamily: ff.body, fontSize: "13px", color: T.textSoft, lineHeight: 1.8, fontWeight: 300, marginBottom: "12px" }}>{m.detail}</p>}
                {m.tags && m.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {m.tags.map(function(tg, j) {
                      return <span key={j} style={{ fontFamily: ff.body, fontSize: "10px", color: T.textMuted, background: T.bgSoft, padding: "2px 8px", borderRadius: "8px", border: "1px solid " + T.border, fontWeight: 300 }}>{"#" + tg}</span>;
                    })}
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px" }} onClick={function(e) { e.stopPropagation(); }}>
                  <button onClick={function() { openEdit(m); }} style={btnSm}><EditIcon />{"\u7f16\u8f91"}</button>
                  <button onClick={function() { deleteMem(m.id); }} style={btnDanger}><TrashIcon />{"\u5220\u9664"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);
}

// ═══════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════
export default function App() {
var _page = useState(PAGES.HOME); var page = _page[0], setPage = _page[1];
return (
<div style={{
minHeight: “100vh”, background: “linear-gradient(175deg, “ + T.bg + “ 0%, #1e1915 35%, “ + T.bgSoft + “ 100%)”,
color: T.text, position: “relative”, maxWidth: “480px”, margin: “0 auto”,
boxShadow: “0 0 80px rgba(0,0,0,0.6)”, overflow: “hidden”,
}}>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&family=Noto+Sans+SC:wght@300;400;500&display=swap" rel="stylesheet" />
<GlobalCSS />
<Particles />
{page !== PAGES.HOME && (
<div style={{ display: “flex”, alignItems: “center”, padding: “14px 16px”, borderBottom: “1px solid “ + T.borderSoft, background: T.bg + “ee”, backdropFilter: “blur(16px)”, WebkitBackdropFilter: “blur(16px)”, position: “sticky”, top: 0, zIndex: 20 }}>
<button onClick={function() { setPage(PAGES.HOME); }} style={{ background: “none”, border: “none”, color: T.accent, cursor: “pointer”, display: “flex”, alignItems: “center”, gap: “6px”, padding: “4px 0”, fontFamily: ff.body, fontSize: “13px”, fontWeight: 400 }}>
<HomeIcon /><span>{”\u679a\u8fb9”}</span>
</button>
<div style={{ flex: 1, textAlign: “center”, fontFamily: ff.display, fontSize: “16px”, color: T.text }}>
{page === PAGES.CHAT && “\u804a\u5929”}{page === PAGES.VAULT && “\u5c0f\u91d1\u5e93”}{page === PAGES.MEMORY && “\u8bb0\u5fc6\u5e93”}
</div>
<div style={{ width: “54px” }} />
</div>
)}
<div style={{ position: “relative”, zIndex: 1 }}>
{page === PAGES.HOME && <HomePage onNavigate={setPage} />}
{page === PAGES.CHAT && <ChatPage />}
{page === PAGES.VAULT && <VaultPage />}
{page === PAGES.MEMORY && <MemoryPage />}
</div>
</div>
);
}
