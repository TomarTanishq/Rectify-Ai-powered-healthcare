import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
const PseudoNavBar = () => {

    const navigate = useNavigate()

    return (

        <motion.div
            className="font-poppins pt-10 px-8 max-w-7xl mx-auto"
            initial={{ z: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}

        >
            {/* Grid Layout for Centering */}
            <div className="grid grid-cols-3 items-center">

                {/* Left Section */}
                <div className="flex justify-start">
                    <a href="#bookAppointment">
                        <button className="">
                            <h1 className="hidden md:block text-md font-semibold text-teal-800 hover:underline cursor-pointer text-shadow-[0px_5px_25px] transition duration-300 delay-75 ease-in-out hover:scale-102">
                                Book Appointment
                            </h1>
                        </button>
                    </a>

                </div>

                {/* Center Logo */}
                <div className="flex justify-center">
                    <h1 className="text-4xl font-extrabold text-teal-800 tracking-tight">
                        Rectify
                    </h1>
                </div>

                {/* Right Section */}
                <div className="flex justify-end space-x-6">
                    <button
                        onClick={() => navigate('/doctor/login')}
                    >
                        <h1 className="hidden md:block text-md font-semibold text-teal-800 hover:underline cursor-pointer text-shadow-[0px_5px_25px] transition duration-300 delay-75 ease-in-out hover:scale-102">
                            Doctor
                        </h1>
                    </button>
                    <button
                        onClick={() => navigate('/patient/login')}
                    >
                        <h1 className="hidden md:block text-md font-semibold text-teal-800 hover:underline cursor-pointer text-shadow-[0px_5px_25px] transition duration-300 delay-75 ease-in-out hover:scale-102">
                            Patient
                        </h1>
                    </button>
                </div>
            </div>
        </motion.div>

    );
};

export default PseudoNavBar;
