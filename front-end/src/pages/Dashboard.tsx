import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg p-6 ">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Central Course Allocation System
      </h1>
      <h3 className="text-2xl py-4">
        This platform is designed to assist administrators in efficiently
        managing course and slot allocations for faculty members at VIT Chennai.
        With a user-friendly interface and organized workflow, admins can assign
        courses, manage faculty preferences, and finalize slot distributions
        with ease.
      </h3>
      <h2 className="text-2xl">
        To proceed with course allocation, click{" "}
        <span
          className="text-green-500 cursor-pointer"
          onClick={() => navigate("/course-allocation")}
        >
          Course Allocation{" "}
        </span>
        in Navbar
      </h2>
    </div>
  );
}