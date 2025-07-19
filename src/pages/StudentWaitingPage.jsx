export default function StudentWaitingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">✦ Intervue Poll</span>
      <div className="text-5xl animate-spin text-purple-500 mb-4">C</div>
      <p className="text-gray-600 text-lg font-medium">Wait for the teacher to ask questions..</p>

      <div className="fixed bottom-6 right-6">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">💬</div>
      </div>
    </div>
  );
}
