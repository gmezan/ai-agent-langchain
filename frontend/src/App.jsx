import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://127.0.0.1:8000/chat";


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, thread_id: threadId }),
      });
      const data = await res.json();
      setThreadId(data.thread_id);
      setMessages((msgs) => [
        ...msgs,
        { role: "agent", content: data.content },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "agent", content: "Error: Could not reach server." },
      ]);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center" style={{background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"}}>
      <div className="w-100" style={{ maxWidth: 900 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ letterSpacing: 2 }}>DogChatAgent</h1>
          <p className="text-muted">Your AI dog chat assistant</p>
        </div>
  <div className="chat-window border rounded shadow-sm mb-3 bg-white" style={{ height: "65vh", minHeight: "400px", overflowY: "auto", padding: "2rem" }}>
          {messages.length === 0 && (
            <div className="text-center text-muted">Start the conversation!</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
              <div
                className={`p-3 rounded-4 shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-success text-white"}`}
                style={{ maxWidth: "60%", fontSize: "0.95rem" }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="d-flex gap-2">
          <input
            className="form-control"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            autoFocus
            style={{ fontSize: "0.95rem" }}
          />
          <button className="btn btn-primary px-4" type="submit" style={{ fontSize: "0.95rem" }}>
            Send
          </button>
        </form>
      </div>
      <footer className="mt-auto text-center text-muted small" style={{ opacity: 0.7 }}>
        &copy; {new Date().getFullYear()} DogChatAgent
      </footer>
    </div>
  );
}

export default App;
