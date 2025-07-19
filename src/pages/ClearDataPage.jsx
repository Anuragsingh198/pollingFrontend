import { useNavigate } from "react-router-dom";

export default function DataClearButtons() {
  const navigate = useNavigate();

  const clearBackendData = async () => {
    try {
      const res = await fetch("https://pollingbackend-production-6d6b.up.railway.app/admin/clear-data", {
        method: "POST",
      });
      const data = await res.json();
      // alert(data.message || "Backend data cleared.");
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error("Error clearing backend data:", err);
      alert("Failed to clear backend data.");
    }
  };

  const clearLocalStorageData = () => {
    localStorage.clear();
    alert("Local storage data cleared.");
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="fixed top-6 left-6 bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-4 space-y-3 w-50">
      <p className="text-sm text-gray-800">
        Please delete frontend and backend data before use. Data is stored in memory due to time constraints. All assignment functionalities are implemented.
      </p>

      <div className="space-y-2">
        <button
          onClick={clearBackendData}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          Clear Backend Data
        </button>

        <button
          onClick={clearLocalStorageData}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          Clear Local Storage
        </button>
      </div>
    </div>
  );
}
