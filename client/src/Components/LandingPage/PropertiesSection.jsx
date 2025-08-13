import { Brain, CheckIcon } from "lucide-react"
import AppointmentIcon from "../../images/appointment.png"
import BrainIcon from "../../images/brain.png"
import MedicineIcon from "../../images/medicine.png"
import DoctorIcon from "../../images/doctor.png"
import PatientIcon from "../../images/patient.png"
import SecurityIcon from "../../images/protection.png"
import TickIcon from "../../images/check.png"
import { motion } from "motion/react"


const PropertiesSection = () => {

    const patientProperties = [
        {
            description: "Book appointments instantly"
        },
        {
            description: "AI-powered health assessments"
        },
        {
            description: "View prescribed medications"
        },
        {
            description: "Track health history"
        },
    ]

    const doctorProperties = [
        {
            description: "Manage patient appointments"
        },
        {
            description: "Review AI diagnosis insights"
        },
        {
            description: "Prescribe medications digitally"
        },
        {
            description: "Access patient records"
        },
    ]

    return (
        <>
            {/* Why Choose Rectify? */}
            <div className="relative bg-white mt-20 mx-auto text-center pb-25">

                {/* Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="pt-20 md:max-w-2xl mx-auto ">
                        <h1 className="text-4xl md:text-5xl font-semibold text-gray-700">Why Choose Rectify?</h1>
                        <p className="mx-8 md:mx-0 mt-5 text-gray-500">Revolutionizing healthcare with AI-powered solutions that connect patients and doctors seamlessly </p>
                    </div>
                </motion.div>

                {/* Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 mt-10 mx-auto gap-10 max-w-6xl"
                    initial={{ z: 100, opacity: 0 }}
                    whileInView={{ z: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    {/* Instant Appointment Booking */}
                    <div className="mx-5 md:mx-0 md:w-full flex flex-col bg-[#E5F8EF] p-10 items-center rounded-2xl shadow-xl transition delay-75 duration-300 ease-in-out hover:-translate-y-2">
                        {/* Circle */}
                        <div className="w-18 h-18 rounded-full inline-flex items-center justify-center bg-[#00B894]">
                            <img
                                src={AppointmentIcon}
                                className="w-8 h-8 invert-100"
                            />
                        </div>
                        <h2 className="text-[18px] md:text-[17px] font-semibold text-gray-800 mt-5">Instant Appointment Booking</h2>
                        <p className="mt-4 text-[15px] md:text-[14px] text-gray-600 tracking-wide md:tracking-wider">Book appointments with doctors instantly, 24/7. No waiting, no phone calls - just seamless scheduling at your convenience.</p>
                    </div>

                    {/* AI Diagnosis */}
                    <div className="mx-5 md:mx-0 md:w-full flex flex-col bg-[#E8EDFF] p-10 items-center rounded-2xl shadow-xl transition delay-75 duration-300 ease-in-out hover:-translate-y-2">
                        {/* Circle */}
                        <div className="w-18 h-18 rounded-full inline-flex items-center justify-center bg-[#FFA500]">
                            <img
                                src={BrainIcon}
                                className="w-8 h-8 invert-100"
                            />
                        </div>
                        <h2 className="text-[18px] md:text-[17px] font-semibold text-gray-800 mt-5">AI-Powered Diagnosis</h2>
                        <p className="mt-4 text-[15px] md:text-[14px] text-gray-600 tracking-wide md:tracking-wider">Get preliminary health assessments powered by advanced AI technology to help identify potential health concerns early.</p>
                    </div>

                    {/* Prescription Management */}
                    <div className="mx-5 md:mx-0 md:w-full flex flex-col bg-[#FFE9E5] p-10 items-center rounded-2xl shadow-xl transition delay-75 duration-300 ease-in-out hover:-translate-y-2">
                        {/* Circle */}
                        <div className="w-18 h-18 rounded-full inline-flex items-center justify-center bg-[#FF4D4F]">
                            <img
                                src={MedicineIcon}
                                className="w-8 h-8 invert-100"
                            />
                        </div>
                        <h2 className="text-[18px] md:text-[17px] font-semibold text-gray-800 mt-5">Prescription Management </h2>
                        <p className="mt-4 text-[15px] md:text-[14px] text-gray-600 tracking-wide md:tracking-wider">Easily manage your prescribed medicines with digital tracking, reminders, and dosage information all in one place. </p>
                    </div>

                    {/* Doctor Dashboard */}
                    <div className="mx-5 md:mx-0 md:w-full flex flex-col bg-[#E6F0FB] p-10 items-center rounded-2xl shadow-xl transition delay-75 duration-300 ease-in-out hover:-translate-y-2">
                        {/* Circle */}
                        <div className="w-18 h-18 rounded-full inline-flex items-center justify-center bg-[#9B59B6]">
                            <img
                                src={DoctorIcon}
                                className="w-8 h-8 invert-100"
                            />
                        </div>
                        <h2 className="text-[18px] md:text-[17px] font-semibold text-gray-800 mt-5">Doctor Dashboard</h2>
                        <p className="mt-4 text-[15px] md:text-[14px] text-gray-600 tracking-wide md:tracking-wider">Comprehensive dashboard for healthcare providers to manage patients, appointments, and medical records efficiently.</p>
                    </div>

                    {/* Patient Dashboard */}
                    <div className="mx-5 md:mx-0 md:w-full flex flex-col bg-[#FFF4E5] p-10 items-center rounded-2xl shadow-xl transition delay-75 duration-300 ease-in-out hover:-translate-y-2">
                        {/* Circle */}
                        <div className="w-18 h-18 rounded-full inline-flex items-center justify-center bg-[#3498DB]">
                            <img
                                src={PatientIcon}
                                className="w-8 h-8 invert-100"
                            />
                        </div>
                        <h2 className="text-[18px] md:text-[17px] font-semibold text-gray-800 mt-5">Patient Dashboard</h2>
                        <p className="mt-4 text-[15px] md:text-[14px] text-gray-600 tracking-wide md:tracking-wider">Personalized patient portal to track health history, view test results, and manage all your healthcare needs. </p>
                    </div>

                    {/* Secure & Private */}
                    <div className="mx-5 md:mx-0 md:w-full flex flex-col bg-[#F3F4F6] p-10 items-center rounded-2xl shadow-xl transition delay-75 duration-300 ease-in-out hover:-translate-y-2">
                        {/* Circle */}
                        <div className="w-18 h-18 rounded-full inline-flex items-center justify-center bg-[#F1C40F]">
                            <img
                                src={SecurityIcon}
                                className="w-8 h-8 invert-100"
                            />
                        </div>
                        <h2 className="text-[18px] md:text-[17px] font-semibold text-gray-800 mt-5">Secure & Private</h2>
                        <p className="mt-4 text-[15px] md:text-[14px] text-gray-600 tracking-wide md:tracking-wider">Your health data is protected with enterprise-grade security and privacy standards, ensuring complete confidentiality.</p>
                    </div>
                </motion.div>

            </div>

            {/* Tailored Dashboards for Everyone */}
            <div className="relative bg-gradient-to-br from-teal-50 to-orange-50 z-50 mx-auto text-center pb-25">
                <div className="pt-10">

                    {/* Headings */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="pt-20 md:max-w-3xl mx-auto ">
                            <h1 className="text-4xl md:text-5xl font-semibold text-gray-700">Tailored Dashboards for Everyone</h1>
                            <p className="mx-8 md:mx-0 mt-5 text-gray-500">Experience healthcare management designed specifically for your role - whether you're a patient seeking care or a doctor providing it.</p>
                        </div>
                    </motion.div>


                    {/* Grids */}
                    <div className="grid grid-co1 md:grid-cols-2 mt-10 mx-auto gap-10 max-w-6xl">

                        {/* Left Grid */}
                        <div className="bg-white rounded-2xl shadow-md p-10 md:w-full mx-5 md:mx-0">

                            {/* FlexBox */}
                            <div className="flex flex-col md:flex-col">

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                >
                                    <div className="flex md:flex-row gap-2">

                                        {/* Icon */}
                                        <div className="h-18 w-18 rounded-full inline-flex items-center justify-center bg-gray-50 shadow-xs border border-gray-100">
                                            <img
                                                src={DoctorIcon}
                                                className="h-10 w-10"
                                            />
                                        </div>


                                        {/* Text */}
                                        <div className="p-3">
                                            <h2 className="text-left text-lg font-semibold text-gray-600">Doctor Dashboard</h2>
                                            <p className="md:text-[14px] text-left text-gray-600">Professional practice management </p>
                                            <hr className="border-gray-500" />
                                        </div>

                                    </div>
                                </motion.div>

                                {/* Properties List */}
                                <div className="flex flex-col md:flex-col">

                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    >
                                        <div className="text-left mt-8">
                                            {doctorProperties.map((item, index) => (
                                                <div key={index} className="flex md:flex-row items-center gap-3 mb-5">
                                                    <div className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-emerald-500">
                                                        <img
                                                            src={TickIcon}
                                                            className="w-4 h-4 invert-100"
                                                        />
                                                    </div>
                                                    <p className="text-gray-600 ">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>

                                    </motion.div>

                                </div>

                                <button className="text-white font-semibold bg-emerald-600 py-3 rounded-lg shadow-lg mt-2 w-4/5 md:w-3/5 hover:bg-emerald-700 cursor-pointer">Access Doctor Dashboard</button>

                            </div>


                        </div>

                        {/* Right Grid */}
                        <div className="bg-white rounded-2xl shadow-md p-10 md:w-full mx-5 md:mx-0">

                            {/* FlexBox */}
                            <div className="flex flex-col md:flex-col">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                >
                                    <div className="flex md:flex-row gap-2">

                                        {/* Icon */}
                                        <div className="h-18 w-18 rounded-full inline-flex items-center justify-center bg-gray-50 shadow-xs border border-gray-100">
                                            <img
                                                src={PatientIcon}
                                                className="h-10 w-10"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="p-3">
                                            <h2 className="text-left text-lg font-semibold text-gray-600">Patient Dashboard</h2>
                                            <p className="md:text-[14px] text-left text-gray-600">Your health, simplified</p>
                                            <hr className="border-gray-500" />
                                        </div>
                                    </div>
                                </motion.div>


                                {/* Properties List */}
                                <div className="flex flex-col md:flex-col">
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    >
                                        <div className="text-left mt-8">
                                            {patientProperties.map((item, index) => (
                                                <div key={index} className="flex md:flex-row items-center gap-3 mb-5">
                                                    <div className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-amber-300">
                                                        <img
                                                            src={TickIcon}
                                                            className="w-4 h-4 invert-100"
                                                        />
                                                    </div>
                                                    <p className="text-gray-600 ">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                </div>
                                <button className="text-white font-semibold bg-amber-300 py-3 rounded-lg shadow-lg mt-2 w-4/5 md:w-3/5 hover:bg-amber-400 cursor-pointer">Access Patient Dashboard</button>
                            </div>


                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}

export default PropertiesSection