import { useState } from 'react'
import './App.css'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Home from './pages/home/Home'
import { Routes, Route } from 'react-router-dom'
import EditStudent from './pages/students/EditStudents'
import PastExamDetails from './pages/past-exams/PastExamDetails'
import PastExamStudentView from './pages/past-exams/PastExamStudentView'
import EditExam from './pages/active-exams/EditExam'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CreateStudent from './pages/students/CreateStudent'
import EditUpcomingExams from './pages/upcoming-exam/EditUpcomingExams'
import ExamContainer from './components/ExamContainer'
import PrivacyPolicy from './pages/privacy-policy/PrivacyPolicy'
import ExamParticipants from './pages/exam-participant/ExamParticipants'
import ActivationPage from './pages/user-activate/UserActivationPage'
import StudentDetails from './pages/students/StudentDetails'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/register' element={<RegisterPage />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/exams' element={<ExamContainer />}></Route>
        <Route path="/edit-user/:id" element={<EditStudent />} />
        <Route path="/user-details/:userId" element={<StudentDetails />} />
        <Route path="/past-exam-details/:id" element={<PastExamDetails />} />
        <Route path="/past-exam/student-view/:id" element={<PastExamStudentView />} />
        <Route path="/edit-exam/:id" element={<EditExam />} />
        <Route path="/exam-participants/:id" element={<ExamParticipants />} />
        <Route path="/activation/:token" element={<ActivationPage />} />
        <Route path="/create-student" element={<CreateStudent />} />
        <Route path="/edit-upcoming-exam" element={<EditUpcomingExams />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
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
  )
}

export default App