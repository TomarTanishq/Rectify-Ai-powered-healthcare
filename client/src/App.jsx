import './App.css'
import LandingPage from './Pages/LandingPage'
import DoctorLogin from './Components/Login/DoctorLogin'
import { Route, Routes } from "react-router-dom"
import DoctorLoginPage from './Pages/DoctorLoginPage'
import DoctorSignup from './Components/SignUp/DoctorSignup'
import PatientLogin from './Components/Login/PatientLogin'
import { ToastContainer } from 'react-toastify';
import DoctorDashboard from './Pages/DoctorDashboard'
import AddPatient from './Components/AddPatient/addPatient'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/doctor/login' element={<DoctorLoginPage />} />
        <Route path='/doctor/signUp' element={<DoctorSignup />} />
        <Route path='/patient/login' element={<PatientLogin />} />
        <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
        {/* <Route path='/doctor/register-patient' element={<AddPatient />} /> */}
      </Routes>

      <ToastContainer
        autoClose={2000}
        hideProgressBar={true} />
    </>



  )
}

export default App
