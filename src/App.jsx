import { useState } from 'react';
import './App.css';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Home from './pages/home/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import EditStudent from './pages/students/EditStudents';
import PastExamDetails from './pages/past-exams/PastExamDetails';
import PastExamStudentView from './pages/past-exams/PastExamStudentView';
import EditExam from './pages/active-exams/EditExam';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateStudent from './pages/students/CreateStudent';
import EditUpcomingExams from './pages/upcoming-exam/EditUpcomingExams';
import ExamContainer from './components/ExamContainer';
import PrivacyPolicy from './pages/privacy-policy/PrivacyPolicy';
import ExamParticipants from './pages/exam-participant/ExamParticipants';
import ActivationPage from './pages/user-activate/UserActivationPage';
import StudentDetails from './pages/students/StudentDetails';
import ForgotPasswordPage from './pages/auth/ForgetPasswordPage';
import CreateAdminForm from './pages/super-admin/CreateAdminForm';
import EditAdmin from './pages/super-admin/EditAdmin';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const SuperAdminRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (authToken && userRole === 'SuperAdmin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/super-admin'
          element={
            <SuperAdminRoute>
              <LoginPage isSuperAdmin={true} />
            </SuperAdminRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route path="/activation/:token" element={<ActivationPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/exams'
          element={
            <ProtectedRoute>
              <ExamContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <ProtectedRoute>
              <EditStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-details/:userId"
          element={
            <ProtectedRoute>
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/past-exam-details/:id"
          element={
            <ProtectedRoute>
              <PastExamDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/past-exam/student-view/:id"
          element={
            <ProtectedRoute>
              <PastExamStudentView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-exam/:id"
          element={
            <ProtectedRoute>
              <EditExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-participants/:id"
          element={
            <ProtectedRoute>
              <ExamParticipants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-student"
          element={
            <ProtectedRoute>
              <CreateStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-upcoming-exam"
          element={
            <ProtectedRoute>
              <EditUpcomingExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-new-admin"
          element={
            <ProtectedRoute>
              <CreateAdminForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-admin/:id"
          element={
            <ProtectedRoute>
              <EditAdmin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;