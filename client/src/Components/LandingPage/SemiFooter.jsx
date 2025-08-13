import HeartIcon from "../../images/heart.png"
import AppointmentIcon from "../../images/appointment.png"
import Doodle from "../../images/doodle.png"
import BookAppointment from "../BookAppointment/bookAppointment"
import { useEffect, useState } from "react"

const SemiFooter = () => {

    const [modal, setModal] = useState(false)

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = 'hidden'
        }
        else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [modal])

    return (
        <div className="bg-blue-100 flex flex-col relative z-50 mx-auto text-center pb-5">
            <div className="pt-25">
                <div className="h-20 w-20 rounded-full bg-[#ff216c] inline-flex justify-center items-center shadow-lg">
                    <img src={HeartIcon} className="h-10 w-10 invert-100 animate-pulse" />
                </div>

                <div className="max-w-4xl mx-auto ">
                    <h1 className="mt-8 text-4xl md:text-5xl font-semibold text-gray-700 text-shadow-lg/15 text-shadow-blue-400">Ready to Transform Your Healthcare Experience?</h1>

                    <div className="mt-8 w-5/6 mx-auto">
                        <p className="text-gray-600">Join early users exploring Rectify to streamline their healthcare journey. Get started today and experience the future of AI-powered healthcare.</p>
                        <div className="mt-8">
                            <button
                                className="bg-white w-full md:w-auto py-3 md:py-3 md:px-12 rounded-lg shadow-lg cursor-pointer"
                                onClick={() => setModal(true)}
                            >
                                <div className="flex flex-row items-center justify-center gap-5">
                                    <img src={AppointmentIcon} className="w-5 h-5 invert-25" />
                                    <p className="font-semibold text-gray-600" id="bookAppointment">Book your First Appointment</p>
                                </div>
                            </button>
                            <img
                                src={Doodle}
                                className="mt-5 md:mt-0 scale-110 md:scale-100 md:h-full md:w-full" />
                        </div>
                        <p className="mt-10 text-gray-800 text-[14px] md:text-base font-extralight">© 2025 Rectify • All rights reserved • Built with ❤️ in देहरादून</p>
                        <hr className="border-gray-400" />
                    </div>
                </div>

            </div>
            {modal && (
                <BookAppointment onClose={() => setModal(false)} />
            )}

        </div>
    )
}
export default SemiFooter
