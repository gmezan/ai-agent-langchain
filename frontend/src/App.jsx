import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactMarkdown from "react-markdown";
import { chatService } from "./services/api";
import { LoginButton } from "./login/google";


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);

  const handleSuccess = (userData) => {
    console.log('Setting User Data:', userData);
    setUser(userData);
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null); // Clear user state
    // Note: For a more complete logout, you may also clear tokens from storage.
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    const response = await chatService.sendMessage(input, threadId);
    if (!response.error) {
      setThreadId(response.thread_id);
    }
    setMessages((msgs) => [...msgs, response]);
  };

  return (
    <div className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center" style={{background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"}}>
      <div className="w-100" style={{ maxWidth: 900 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ letterSpacing: 2 }}>DogChatAgent</h1>
          <p className="text-muted">Your AI dog chat assistant</p>
          {user ? (
            // Display this if a user is logged in
            <div>
              <h2>Welcome, {user.name}!</h2>
              <p>Email: {user.email}</p>
              <button onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            // Display the login button if no user is logged in
            <LoginButton onLogin={handleSuccess} />
          )}
        </div>
  <div className="chat-window border rounded shadow-sm mb-3 bg-white" style={{ height: "65vh", minHeight: "400px", overflowY: "auto", padding: "2rem" }}>
          {messages.length === 0 && (
            <div className="text-center text-muted">Start the conversation!</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
              <div
                className={`p-3 rounded-4 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-white" 
                    : msg.error 
                      ? "bg-danger text-white" 
                      : "bg-success text-white"
                }`}
                style={{ maxWidth: "60%", fontSize: "0.95rem" }}
              >
                <div>
                  {msg.role === "assistant" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                  {msg.error && (
                    <div className="mt-2 small opacity-75">
                      {msg.error.message}
                    </div>
                  )}
                </div>
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
