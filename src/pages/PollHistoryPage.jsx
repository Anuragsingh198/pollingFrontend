import React, { useEffect, useState } from "react";

export default function PollHistoryPage({ onClose }) {
  const [pollHistory, setPollHistory] = useState(() => {
    const saved = localStorage.getItem("pollHistory");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 flex justify-center items-start pt-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            View <span className="text-purple-600">Poll History</span>
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✖️
          </button>
        </div>

        {pollHistory.length === 0 ? (
          <p className="text-center text-gray-500">
            No poll history available.
          </p>
        ) : (
          pollHistory.map((poll, index) => {
            const totalVotes = Object.values(poll.results).reduce(
              (acc, val) => acc + val,
              0
            );

            return (
              <div
                key={index}
                className="mb-8 border border-gray-300 rounded-xl overflow-hidden"
              >
                <div className="bg-gray-800 text-white px-4 py-2 font-semibold text-sm">
                  Question {index + 1}
                </div>

                <div className="p-4 bg-white">
                  <p className="font-medium mb-4">{poll.question}</p>

                  {poll.options.map((option, i) => {
                    const count = poll.results[option] || 0;
                    const percent =
                      totalVotes === 0
                        ? 0
                        : ((count / totalVotes) * 100).toFixed(0);

                    return (
                      <div key={i} className="mb-3">
                        <div className="relative w-full h-10 rounded-md border border-purple-200 overflow-hidden flex items-center px-3 bg-white">
                          <div className="mr-2 w-4 h-4 border-2 border-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm font-medium text-gray-800 z-10">
                            {option}
                          </span>
                          <div
                            className="absolute top-0 left-0 h-full bg-purple-500 z-0"
                            style={{ width: `${percent}%` }}
                          ></div>
                          <div className="absolute top-0 left-0 w-full h-full flex items-center px-3 text-white font-semibold text-sm z-10">
                            {percent}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
