export default function KickedOutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      {/* Badge */}
      <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
        ✦ Intervue Poll
      </span>

      {/* Message */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        You’ve been Kicked out !
      </h1>
      <p className="text-gray-500 text-sm md:text-base max-w-md">
        Looks like the teacher had removed you from the poll system.
        <br />
        Please try again sometime.
      </p>
    </div>
  );
}
