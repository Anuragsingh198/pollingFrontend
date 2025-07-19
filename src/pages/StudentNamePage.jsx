import { useState, useEffect } from "react";
import socket from "../socket"; // adjust path based on your project
import StudentPollQuestion from "./StudentPollingView";
import StudentPollResult from "./StudentResultView";
import StudentWaitingPage from "./StudentWaitingPage";
// create this for showing results

export default function StudentNamePage() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [poll, setPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState(() => {
    const stored = localStorage.getItem("askedQuestions");
    return stored ? JSON.parse(stored) : [];
  });
  const handleContinue = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    console.log("Student Name:", name);

    socket.emit("student:join", name);
    setJoined(true);
  };

  useEffect(() => {
    socket.on("poll:question", (data) => {
      console.log("Received poll:", data);
      setPoll(data);
      setPollResults(null); // reset results when new poll starts
    });

    socket.on("endPoll", (data) => {
      console.log("Poll results:", data);
      // setPollResults(data); // store results
      setPoll(null); // clear current poll
    });
      const handleLiveResults = (data) => {
      console.log("Received live results:", data);
      setPollResults(data);
    };

    socket.on("poll:liveResults", handleLiveResults);

    socket.on("student:kicked", () => {
      alert("You were kicked from the session.");
      window.location.href = "/kicked-out";
    });

    return () => {
      socket.off("poll:question");
      socket.off("endPoll");
      socket.off("student:kicked");
    };
  }, []);

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-3">
          ✦ Intervue Poll
        </span>
        <h1 className="text-3xl font-semibold mb-2">
          Let’s <span className="font-bold">Get Started</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          If you’re a student, you’ll be able to{" "}
          <strong>submit your answers</strong>, participate in live polls, and
          see how your responses compare with your classmates.
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name"
          className="border w-72 px-4 py-2 rounded-md mb-6"
        />

        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          Continue
        </button>
      </div>
    );
  }

  if (poll) {
    return <StudentPollQuestion poll={poll} socket={socket} />;
  }

  if (pollResults) {
    return <StudentPollResult  results={pollResults}/>;
  }
  // if( !poll &&askedQuestions.length ===0 )
     return <StudentWaitingPage />;
}
