import { Outlet, Link} from 'react-router-dom';
import {BookOpen, LayoutDashboard } from 'lucide-react';

export default function Layout() {

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Course Allocation
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/course-allocation"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  <BookOpen className="mr-1 h-4 w-4" />
                  Course Allocation
                </Link>
              </div>
              <Link
                to="allocated-course"
                className="inline-flex items-center px-7 pt-1 text-sm font-medium text-gray-900"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Allocated Courses
              </Link>
              <Link
                to="/upload-csv"
                className="inline-flex items-center px-7 pt-1 text-sm font-medium text-gray-900"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Upload csv
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}