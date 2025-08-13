import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="font-nunito bg-white/10 backdrop-blur-xs sticky w-10/12 mx-auto z-20 top-10 rounded-2xl border border-gray-200 shadow-xs">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
                {/* Logo */}
                <span className="self-center text-lg text-gray-800 font-extrabold whitespace-nowrap">Rectify</span>

                {/* Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    className="inline-flex items-center p-2 ml-3 text-sm text-gray-700 rounded-lg md:hidden hover:bg-gray-50"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Nav Links */}
                <div className={`w-full md:flex md:w-auto mr-5 ${isOpen ? "block" : "hidden"}`}>
                    <ul className="flex flex-col p-4 md:p-0 mt-4 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-800 rounded-sm transition duration-300 delay-75 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:text-black md:p-0">Book Appointment</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-800 rounded-sm transition duration-300 delay-75 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:text-black md:p-0">Doctor</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-800 rounded-sm transition duration-300 delay-75 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:text-black md:p-0">Patient</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
