import { useState, useEffect } from "react";
import socket from "../socket";
import TeacherPollView from "./TeacherPollingView";
import { useNavigate } from "react-router-dom";

export default function TeacherPollPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctOptions, setCorrectOptions] = useState([false, false]);
  const [duration, setDuration] = useState("60");
  const [currentPoll, setCurrentPoll] = useState(null);
  const [students, setStudents] = useState([]);
 const navigate = useNavigate()
  // Load current poll from localStorage on mount
  useEffect(() => {
    const storedPoll = localStorage.getItem("currentPoll");
    if (storedPoll) {
      setCurrentPoll(JSON.parse(storedPoll));
    }
  }, []);

  useEffect(() => {
    socket.on("poll:question", (data) => {
      console.log("Poll active:", data);
      setCurrentPoll(data);
      localStorage.setItem("currentPoll", JSON.stringify(data));
    });
    return () => {
      socket.off("poll:question");
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index, value) => {
    const newCorrects = [...correctOptions];
    newCorrects[index] = value === "yes";
    setCorrectOptions(newCorrects);
  };

  const addOption = () => {
    setOptions([...options, ""]);
    setCorrectOptions([...correctOptions, false]);
  };

  const askQuestion = () => {
    const filteredOptions = options.filter((opt) => opt.trim());

    if (!question.trim() || filteredOptions.length < 2) {
      alert("Please enter a question and at least two options.");
      return;
    }

    // if (currentPoll) {
    //   alert("A poll is already active. Please end it before creating a new one.");
    //   return;
    // }

    const pollData = {
      question,
      options: filteredOptions,
      maxTime: parseInt(duration) || 60,
    };

    socket.emit("teacher:createPoll", pollData);

    navigate('/teacher-start')
    console.log("Poll emitted:", pollData);

  };

  // if (currentPoll) {
  //   return <TeacherPollView/>;
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-white">
      <span className="text-purple-700 bg-purple-100 px-4 py-1 rounded-full text-sm font-semibold mb-3">
        ✦ Intervue Poll
      </span>
      <h1 className="text-3xl font-semibold text-gray-900 mb-1">
        Let’s <span className="font-bold">Get Started</span>
      </h1>
      <p className="text-gray-500 text-center mb-8 max-w-lg">
        You’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.
      </p>

      <div className="w-full max-w-xl">
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter your question</label>
        <div className="flex justify-between items-center mb-1">
          <textarea
            className="w-full p-3 border rounded-md resize-none"
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={100}
            placeholder="Type your question here..."
          />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="ml-4 px-2 py-1 border rounded-md"
          >
            <option value="30">30 seconds</option>
            <option value="60">60 seconds</option>
            <option value="90">90 seconds</option>
          </select>
        </div>
        <p className="text-right text-xs text-gray-400">{question.length}/100</p>

        <div className="mt-6">
          <p className="mb-2 font-medium">Edit Options</p>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-4 mb-3">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 border p-2 rounded-md"
                placeholder={`Option ${index + 1}`}
              />
              <div className="flex items-center space-x-2 text-sm">
                <label>
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    value="yes"
                    checked={correctOptions[index]}
                    onChange={(e) => handleCorrectChange(index, e.target.value)}
                  />
                  <span className="ml-1">Yes</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    value="no"
                    checked={!correctOptions[index]}
                    onChange={(e) => handleCorrectChange(index, e.target.value)}
                  />
                  <span className="ml-1">No</span>
                </label>
              </div>
            </div>
          ))}

          <button
            className="text-purple-600 border border-purple-600 px-3 py-1 text-sm rounded-md hover:bg-purple-50"
            onClick={addOption}
          >
            + Add More Option
          </button>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={askQuestion}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm"
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
}
