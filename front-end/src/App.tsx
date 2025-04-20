// import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
//import Login from './pages/Login';
// import Register from './pages/Register';
// import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CourseAllocation from './pages/CourseAllocation';
import Layout from './components/Layout';
import UploadPage from "./pages/UploadCsv";
import AllocatedCourse from './pages/AllocatedCourse';

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
            <Route path="allocated-course" element={<AllocatedCourse />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;