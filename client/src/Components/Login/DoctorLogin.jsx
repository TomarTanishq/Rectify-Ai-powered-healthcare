import { useState } from "react";
import axios from "axios"
import DoctorsSVG from "../../images/Doctors.svg"
import { useNavigate } from "react-router-dom";

const DoctorLogin = ({ }) => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/doctors/login', {
        email,
        password
      }, {
        withCredentials: true
      })
      
      // DocId and DocName
      const docId = res.data._id
      const docName = res.data.name

      // LocalStorage
      localStorage.setItem("doctorId", docId)
      localStorage.setItem("doctorname", docName)

      console.log(`${docName}`, "Logged in");
      setError('')
      navigate('/doctor/dashboard')
    } catch (error) {
      setError(error)
      console.log(error || "Login failed");
    }
  }


  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left Side - Image */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-teal-600 to-teal-700 ">
          <div className="w-150">
            <img src={DoctorsSVG} alt="" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center">
              <h1
                className="text-4xl font-extrabold text-teal-800 tracking-tight mb-2 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Rectify
              </h1>
              <div className="w-16 h-1 bg-teal-600 mx-auto rounded-full"></div>
            </div>

            {/* Sign In Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
              <div className="flex justify-center items-center gap-2 text-gray-600">
                <p>Create an Account?</p>
                <button
                  className="text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-200 underline underline-offset-2 cursor-pointer"
                  onClick={() => navigate('/doctor/signUp')}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                  Sign In
                </button>

                {error && (
                  <div>
                    <p className="text-xs text-[#FA5B30]">Credentials dont match</p>
                  </div>
                )}

              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;