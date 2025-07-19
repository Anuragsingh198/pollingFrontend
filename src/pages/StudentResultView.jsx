import { useState, useEffect } from "react";
import socket from "../socket";

export default function StudentPollResult({ results: propResults }) {
  const [results, setResults] = useState(
    propResults || {
      question: "Loading...",
      counts: {},
    }
  );

  const [showWindow, setShowWindow] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (propResults) {
      setResults(propResults);
    }

    const handleEndPoll = (data) => {
      console.log("Poll ended. Final results received:", data);
      setResults(data);
    };

    const handleLiveResults = (data) => {
      console.log("Received live results:", data);
      setResults(data);
    };

    const handleChatMessage = (msg) => {
      console.log("Received chat message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    const handleChatHistory = (history) => {
      console.log("Received chat history:", history);
      setMessages(history);
    };

    const handleStudentsUpdate = (data) => {
      setParticipants(data);
    };

    socket.on("chat:history", handleChatHistory);
    socket.on("poll:liveResults", handleLiveResults);
    socket.on("endPoll", handleEndPoll);
    socket.on("chat:message", handleChatMessage);
    socket.on("students:update", handleStudentsUpdate);

    return () => {
      socket.off("poll:liveResults", handleLiveResults);
      socket.off("endPoll", handleEndPoll);
      socket.off("chat:message", handleChatMessage);
      socket.off("students:update", handleStudentsUpdate);
      socket.off("chat:history", handleChatHistory);
    };
  }, [propResults]);

  // const sendMessage = () => {
  //   if (!newMessage.trim()) return;
  //   socket.emit("chat:message", { text: newMessage, name: "You" });
  //   setMessages((prev) => [...prev, { text: newMessage, name: "You" }]);
  //   setNewMessage("");
  // };
  const sendMessage = () => {
  if (!newMessage.trim()) return;
  socket.emit("chat:message", { text: newMessage, name: "You" });
  setNewMessage(""); 
};


  const totalVotes = results && results.counts
    ? Object.values(results.counts).reduce((acc, val) => acc + val, 0)
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      <h2 className="text-2xl font-semibold mb-4">Poll Results</h2>
      <p className="mb-4 text-center">{results?.question || "Loading..."}</p>

      <ul className="w-full max-w-md mb-6">
        {results && results.counts && Object.keys(results.counts).length > 0 ? (
          Object.entries(results.counts).map(([option, count], i) => {
            const percent = totalVotes === 0 ? 0 : ((count / totalVotes) * 100).toFixed(1);
            return (
              <li key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{option}</span>
                  <span className="text-gray-600">{percent}% ({count})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </li>
            );
          })
        ) : (
          <li>Loading results...</li>
        )}
      </ul>

      <p className="text-gray-500 mb-20">
        Results update live as students submit.
      </p>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-purple-600 text-white w-12 h-12 rounded-full text-2xl shadow-lg"
        onClick={() => setShowWindow(!showWindow)}
      >
        💬
      </button>

      {/* Chat / Participants Window */}
      {showWindow && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
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

          <div className="p-4 h-60 overflow-y-auto text-sm">
            {activeTab === "chat" ? (
              <>
                {messages.map((msg, i) => (
                  <p key={i}>
                    <strong>Student:</strong> {msg.text}
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
                {participants.length > 0 ? (
                  participants.map((student, i) => (
                    <li key={i} className="py-1 border-b">
                      <span>{student.name}</span>
                    </li>
                  ))
                ) : (
                  <li>No participants yet.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
