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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/register' element={<RegisterPage />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path="/edit-user/:id" element={<EditStudent />} />
        <Route path="/past-exam-details/:id" element={<PastExamDetails />} />
        <Route path="/past-exam/student-view/:id" element={<PastExamStudentView />} />
        <Route path="/edit-exam/:id" element={<EditExam />} />
      </Routes>

      {/* Toast Container for notifications */}
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