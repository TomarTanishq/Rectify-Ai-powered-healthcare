import { useState } from "react";
import PatientSVG from "../../images/login.svg"
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");


    return (
        <div className="min-h-screen bg-white font-poppins">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                {/* Left Side - Image */}
                <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-teal-600 to-teal-700 ">
                    <div className="w-150">
                        <img src={PatientSVG} alt="" />
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

                        {/* Form */}
                        <div className="space-y-6">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                                Sign In
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;