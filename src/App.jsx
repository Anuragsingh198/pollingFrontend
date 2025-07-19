import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentNamePage from "./pages/StudentNamePage";
import StudentWaitingPage from "./pages/StudentWaitingPage";
import StudentPollQuestion from "./pages/StudentPollingView";
import KickedOutPage from "./pages/KickOutPage";
import TeacherPollPage from "./pages/CreatePollPage";
import TeacherPollView from "./pages/TeacherPollingView";
import RoleSelection from "./pages/RollSelectionPage";
import DataClearButtons from "./pages/ClearDataPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/student-name" element={<StudentNamePage />} />
          <Route path="/student-waiting" element={<StudentWaitingPage />} />
          <Route path="/student-poll" element={<StudentPollQuestion />} />
          <Route path="/kicked-out" element={<KickedOutPage />} />
          <Route path="/teacher-start" element={<TeacherPollView />} />
          <Route path="/teacher-create" element={<TeacherPollPage />} />
        </Routes>

        <DataClearButtons /> 
      </div>
    </Router>
  );
}

export default App;
