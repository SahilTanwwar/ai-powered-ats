import { useMemo, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

const INITIAL_CONVERSATIONS = [
  { id: 1, name: "Priya Singh", online: true, unread: 2, lastMessage: "Can we schedule the interview?", timestamp: "10:24" },
  { id: 2, name: "Aarav Sharma", online: false, unread: 0, lastMessage: "Thanks for the update.", timestamp: "09:10" },
];

const INITIAL_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Hi! I’m available this week.", time: "10:12" },
    { id: 2, from: "me", text: "Great, please share your preferred slots.", time: "10:15" },
  ],
  2: [{ id: 1, from: "them", text: "Thanks for the update.", time: "09:10" }],
};

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [messagesByConversation, setMessagesByConversation] = useState(INITIAL_MESSAGES);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const fileRef = useRef(null);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => conversation.name.toLowerCase().includes(query));
  }, [conversations, search]);

  const activeConversation = conversations.find((conversation) => conversation.id === activeId);
  const activeMessages = messagesByConversation[activeId] || [];

  const openConversation = (id) => {
    setActiveId(id);
    setConversations((prev) => prev.map((conversation) => (conversation.id === id ? { ...conversation, unread: 0 } : conversation)));
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = { id: Date.now(), from: "me", text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessagesByConversation((prev) => ({ ...prev, [activeId]: [...(prev[activeId] || []), payload] }));
    setConversations((prev) => prev.map((conversation) => (conversation.id === activeId ? { ...conversation, lastMessage: payload.text, timestamp: payload.time } : conversation)));
    setText("");
  };

  const onAttach = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const payload = { id: Date.now(), from: "me", text: `Attached: ${file.name}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessagesByConversation((prev) => ({ ...prev, [activeId]: [...(prev[activeId] || []), payload] }));
    setConversations((prev) => prev.map((conversation) => (conversation.id === activeId ? { ...conversation, lastMessage: payload.text, timestamp: payload.time } : conversation)));
    event.target.value = "";
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-inner">
        <div className="card-modern overflow-hidden grid lg:grid-cols-[320px_1fr] min-h-[70vh] p-0">
          <aside className="border-r border-border/70 p-4 space-y-3 bg-white/30 dark:bg-slate-900/30">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" className="modern-input w-full" />
            <div className="space-y-1.5">
              {filteredConversations.map((conversation) => (
                <button key={conversation.id} type="button" onClick={() => openConversation(conversation.id)} className={`w-full text-left p-3 rounded-lg border transition-colors ${conversation.id === activeId ? "bg-primary-light border-primary-light" : "border-border hover:bg-white/70 dark:hover:bg-slate-800/70"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-dark">{conversation.name}</p>
                    <span className="text-xs text-text-muted">{conversation.timestamp}</span>
                  </div>
                  <p className="text-xs text-secondary mt-1 truncate">{conversation.lastMessage}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] ${conversation.online ? "text-success" : "text-text-muted"}`}>{conversation.online ? "Online" : "Offline"}</span>
                    {conversation.unread > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-white">{conversation.unread}</span>}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex flex-col bg-white/40 dark:bg-slate-950/20">
            <div className="border-b border-border/70 px-4 py-3 flex items-center justify-between bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
              <div>
                <p className="font-medium text-dark">{activeConversation?.name || "Conversation"}</p>
                <p className="text-xs text-secondary">{activeConversation?.online ? "Online" : "Offline"}</p>
              </div>
              <button type="button" onClick={() => navigate("/candidates-public")} className="text-primary text-sm hover:underline">View Profile</button>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-transparent">
              {activeMessages.map((message) => (
                <div key={message.id} className={`max-w-[75%] ${message.from === "me" ? "ml-auto" : "mr-auto"}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm ${message.from === "me" ? "bg-primary text-white" : "bg-white/85 dark:bg-slate-800/90 text-dark"}`}>
                    {message.text}
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">{message.time}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border/70 p-3 flex items-center gap-2 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
              <input ref={fileRef} type="file" className="hidden" onChange={onAttach} />
              <button type="button" onClick={() => fileRef.current?.click()} className="p-2 rounded-md border border-border text-secondary hover:bg-white/70 dark:hover:bg-slate-800/70">
                <Paperclip size={16} />
              </button>
              <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Write a message..." className="modern-input flex-1" />
              <button type="button" onClick={() => setText((prev) => `${prev}🙂`)} className="p-2 rounded-md border border-border text-secondary hover:bg-white/70 dark:hover:bg-slate-800/70">
                <Smile size={16} />
              </button>
              <button type="button" onClick={sendMessage} className="btn btn-primary px-3 py-2">
                <Send size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
