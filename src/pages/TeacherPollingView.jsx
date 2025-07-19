import { useState, useEffect } from "react";
import PollHistoryModal from "./PollHistoryPage";
import TeacherPollPage from "./CreatePollPage";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

export default function TeacherPollView() {
  const [showWindow, setShowWindow] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [showHistory, setShowHistory] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState(() => {
    const stored = localStorage.getItem("askedQuestions");
    return stored ? JSON.parse(stored) : [];
  });
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chat:history", (history) => {
      console.log("Loaded chat history:", history);
      setMessages(history);
    });

    const handleChatMessage = (msg) => {
      console.log("Received chat message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat:message", handleChatMessage);

    return () => {
      socket.off("chat:history");
      socket.off("chat:message");
    };
  }, []);

  useEffect(() => {
    const storedPoll = JSON.parse(localStorage.getItem("currentPoll"));
    if (storedPoll) setCurrentPoll(storedPoll);

    const storedHistory = JSON.parse(localStorage.getItem("pollHistory")) || [];
    setPollHistory(storedHistory);

    socket.on("poll:question", (data) => {
      console.log("Poll active from socket:", data);
      setCurrentPoll(data);
      localStorage.setItem("currentPoll", JSON.stringify(data));
    });

    socket.on("endPoll", (data) => {
      console.log("Poll ended, results received:", data);
      const endedPoll = JSON.parse(localStorage.getItem("currentPoll"));
      if (endedPoll) {
        const pollWithResults = {
          ...endedPoll,
          results: data.counts,
          endTime: Date.now(),
        };

        setPollHistory((prevHistory) => {
          const updatedHistory = [...prevHistory, pollWithResults];
          localStorage.setItem("pollHistory", JSON.stringify(updatedHistory));
          return updatedHistory;
        });

        setAskedQuestions((prev) => {
          const updated = [...prev, pollWithResults];
          localStorage.setItem("askedQuestions", JSON.stringify(updated));
          return updated;
        });

        setCurrentPoll(null);
        localStorage.removeItem("currentPoll");
      }
    });

    socket.on("students:update", (data) => {
      console.log("Students updated:", data);
      setStudents(data);
    });

    socket.on("chat:message", (msg) => {
      console.log("Received chat message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("poll:question");
      socket.off("endPoll");
      socket.off("students:update");
      socket.off("chat:message");
    };
  }, []);

  console.log(" this is the  students : ", students);
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const messageObj = { text: newMessage, name: "Teacher" };
    socket.emit("chat:message", messageObj);
    setMessages((prev) => [...prev, messageObj]);
    setNewMessage("");
  };

  if (!currentPoll && askedQuestions.length === 0) {
    return <TeacherPollPage />;
  }

  return (
    <div className="min-h-screen bg-white p-6 relative">
      <button
        onClick={() => setShowHistory(true)}
        className="fixed top-1 right-6 bg-purple-600 text-white px-4 py-2 rounded-full shadow-md"
      >
        View Poll History
      </button>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          {currentPoll && (
            <div className="mb-6">
              <p className="font-medium text-lg mb-4 text-purple-700">
                Current Question
              </p>
              <p className="font-semibold mb-4 text-gray-800">
                {currentPoll.question}
              </p>
              <ul>
                {currentPoll.options.map((opt, i) => (
                  <li key={i} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {i + 1}. {opt}
                      </span>
                      <span className="text-xs text-gray-500">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-700 h-4 rounded-full flex items-center justify-center text-xs text-white"
                        style={{ width: `0%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {askedQuestions.length > 0 ? (
            <>
              <p className="font-medium text-lg mb-4 mt-6">Asked Questions</p>
              {askedQuestions.map((poll, index) => {
                const totalVotes = poll.options.reduce((acc, opt) => {
                  const count =
                    poll.results && poll.results[opt] ? poll.results[opt] : 0;
                  return acc + count;
                }, 0);

                return (
                  <div key={index} className="mb-6">
                    <p className="font-semibold text-purple-700 mb-1">
                      Question {index + 1}
                    </p>
                    <p className="text-gray-800 mb-3">{poll.question}</p>
                    <ul>
                      {poll.options.map((opt, i) => {
                        const count =
                          poll.results && poll.results[opt]
                            ? poll.results[opt]
                            : 0;
                        const percent =
                          totalVotes === 0
                            ? 0
                            : ((count / totalVotes) * 100).toFixed(1);
                        return (
                          <li key={i} className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{opt}</span>
                              <span className="text-gray-600">
                                {percent}% ({count})
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-purple-600 h-3 rounded-full"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </>
          ) : !currentPoll ? (
            <p className="text-gray-500">No poll active or history.</p>
          ) : null}

          <button
            className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-full text-sm"
            onClick={() => {
              if (currentPoll) {
                alert("Cannot add a new question while a poll is active.");
                return;
              } else {
                navigate("/teacher-create");
              }
            }}
          >
            + Ask a new question
          </button>
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 bg-purple-600 text-white w-12 h-12 rounded-full text-2xl shadow-lg"
        onClick={() => setShowWindow(!showWindow)}
      >
        💬
      </button>

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
                activeTab === "participants"
                  ? "border-b-2 border-purple-500"
                  : ""
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
                    <strong>Teacher:</strong> {msg.text}
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
                {students.length > 0 ? (
                  students.map((student, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center py-1 border-b"
                    >
                      <span>{student.name}</span>
                      <button
                        className="text-red-600 text-xs"
                        onClick={() => {
                          if (window.confirm(`Kick out ${student.name}?`)) {
                            socket.emit(
                              "teacher:kickStudent",
                              student.socketId
                            );
                          }
                        }}
                      >
                        Kick out
                      </button>
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

      {showHistory && (
        <PollHistoryModal
          onClose={() => setShowHistory(false)}
          history={pollHistory}
        />
      )}
    </div>
  );
}
