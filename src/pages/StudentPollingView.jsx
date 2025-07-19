import { useState, useEffect } from "react";
import StudentPollResult from "./StudentResultView";

export default function StudentPollQuestion({ poll, socket }) {
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(poll.maxTime || 15);
  const [showWindow, setShowWindow] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [liveResults, setLiveResults] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (!socket) return;

    const handleStudentsUpdate = (data) => setParticipants(data);
    const handleChatMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleLiveResults = (data) => setLiveResults(data);

    socket.on("students:update", handleStudentsUpdate);
    socket.on("chat:message", handleChatMessage);
    socket.on("poll:liveResults", handleLiveResults);

    return () => {
      socket.off("students:update", handleStudentsUpdate);
      socket.off("chat:message", handleChatMessage);
      socket.off("poll:liveResults", handleLiveResults);
    };
  }, [socket]);

  const handleSubmit = () => {
    if (selected === null) {
      alert("Please select an option before submitting.");
      return;
    }
    socket.emit("student:submitAnswer", poll.options[selected]);
    setShowResult(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socket.emit("chat:message", newMessage);
    setNewMessage("");
  };

  // =====================
  // Render live results after submission
  // =====================
if (showResult) {
  return <StudentPollResult results={liveResults} />;
}

  // =====================
  // Render question page before submit
  // =====================
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">Question</h2>
          <span className="text-red-500 font-semibold text-sm">
            ⏱️ {`00:${String(timer).padStart(2, "0")}`}
          </span>
        </div>
        <p className="font-semibold mb-4">{poll.question}</p>
        {poll.options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex items-center mb-2 p-2 border rounded-md cursor-pointer ${
              selected === idx
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="answer"
              className="mr-3"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
            />
            {opt}
          </label>
        ))}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full w-full"
        >
          Submit
        </button>
      </div>

      {/* Floating Chat Icon */}
      <button
        className="fixed bottom-6 right-6 bg-purple-600 text-white w-12 h-12 rounded-full text-2xl shadow-lg"
        onClick={() => setShowWindow(!showWindow)}
      >
        💬
      </button>

      {/* Chat / Participants Window */}
      {showWindow && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b text-sm font-medium">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-2 ${
                activeTab === "chat" ? "border-b-2 border-purple-500" : ""
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`flex-1 px-4 py-2 ${
                activeTab === "participants" ? "border-b-2 border-purple-500" : ""
              }`}
            >
              Participants
            </button>
          </div>

          {/* Content */}
          <div className="p-4 h-60 overflow-y-auto text-sm">
            {activeTab === "chat" ? (
              <>
                {messages.map((msg, i) => (
                  <p key={i}>
                    <strong>{msg.name || "Anonymous"}:</strong> {msg.text}
                  </p>
                ))}
                <div className="mt-2 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded-l px-2 py-1 text-sm"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-purple-600 text-white px-3 rounded-r text-sm"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <ul>
                {participants.map((student, i) => (
                  <li key={i} className="py-1 border-b">
                    {student.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
