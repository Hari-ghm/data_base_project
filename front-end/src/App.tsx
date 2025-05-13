import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import CourseAllocation from './pages/CourseAllocation';
import Layout from './components/Layout';
import UploadPage from "./pages/UploadCsv";
import AllocatedCourses from './pages/AllocatedCourse_dashboard';
import FacultyTimetable from './pages/FacultyTimetable';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course-allocation" element={<CourseAllocation />} />
            <Route path="upload-csv" element={<UploadPage />} />
            <Route path="allocated-course" element={<AllocatedCourses />} />
            <Route path="faculty-timetable/:facultyempId" element={<FacultyTimetable />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;