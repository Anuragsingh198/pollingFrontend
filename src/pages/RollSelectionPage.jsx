import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    if (selectedRole === "student") {
      navigate("/student-name");
    } else {
      navigate("/teacher-start");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center mb-6">
        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-3">
          🎯 Interact Poll
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Welcome to the <span className="text-black font-bold">Live Polling System</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Please select the role that best describes you to begin using the live polling system
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          className={`w-64 p-4 rounded-lg border text-left transition ${
            selectedRole === "student"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => setSelectedRole("student")}
        >
          <h3 className="font-semibold mb-1">I'm a Student</h3>
          <p className="text-sm text-gray-500">
            Participate in polls and submit your answers in real time.
          </p>
        </button>

        <button
          className={`w-64 p-4 rounded-lg border text-left transition ${
            selectedRole === "teacher"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => setSelectedRole("teacher")}
        >
          <h3 className="font-semibold mb-1">I'm a Teacher</h3>
          <p className="text-sm text-gray-500">
            Create polls and view live results.
          </p>
        </button>
      </div>

      <button
        onClick={handleContinue}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
      >
        Continue
      </button>
    </div>
  );
}
