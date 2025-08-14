import React, { useEffect, useState } from 'react'
import { UserPlus, Search, Users, CalendarPlus, TrendingUp, TrendingDown, MountainSnow, User, SquareActivity, Phone, House, BriefcaseMedical, Activity } from "lucide-react"
import axios from 'axios'
import { Cardio } from 'ldrs/react'
import 'ldrs/react/Cardio.css'
import { usePatientStats } from '../../hooks/usePatientStats'
import { useAllAppointments } from '../../hooks/useAllAppointments'
import { useTodaysAppointments } from '../../hooks/useTodaysAppointments'
import AddPatient from '../AddPatient/addPatient'
import api from '../../api'

const Patients = () => {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [newPatientModal, setNewPatientModal] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [query, setQuery] = useState("")
    const [searchedPatient, setSearchedPatient] = useState([])
    // Fetch patients
    const fetchPatients = async () => {
        try {
            const res = await api.post('http://localhost:3000/patients/all', {}, {
                withCredentials: true
            })
            setPatients(res.data)
            setLoading(false)
        } catch (err) {
            console.log("Failed to fetch patients")
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPatients()
    }, [])
    // Fetch Searched Patients
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim() === "") {
                setSearchedPatient(patients)
            } else {
                const lowerCaseQuery = query.toLowerCase()
                const res = patients.filter((p) =>
                    p.name.toLowerCase().includes(lowerCaseQuery) ||
                    p.contactNumber.includes(query) ||
                    p._id.toLowerCase().includes(lowerCaseQuery)
                )
                setSearchedPatient(res)
            }
        }, 500)
        return () => clearTimeout(delayDebounce)
    }, [query, patients])
    // Total Patients
    const totalPatients = patients.length
    // Weekly Patients
    const weeklyStats = usePatientStats(patients)
    // Last month total patients
    let lastMonthTotalPatients = 0
    let currentMonthTotalPatients = 0
    weeklyStats.forEach(week => {
        lastMonthTotalPatients += week.previousMonth
        currentMonthTotalPatients += week.currentMonth
    })
    // Percentage change for last vs current month
    const getPercentageChange = (lastMonth, currentMonth) => {
        if (lastMonth === 0 && currentMonth > 0) {
            return { percentage: 100, color: "green" }
        }
        if (lastMonth === 0 && currentMonth === 0) {
            return { percentage: 0, color: "gray" }
        }
        else {
            const diff = Math.abs(currentMonth - lastMonth)
            return {
                percentage: (diff / lastMonth) * 100,
                color: currentMonth > lastMonth ? "green" : "red",
            }
        }
    }
    // Calculate percentage change
    const percentChange = getPercentageChange(lastMonthTotalPatients, currentMonthTotalPatients)

    // Percentage change for last vs current week
    const getWeeklyPercentageChange = () => {
        const dateNow = new Date().getDate()
        let week = ""
        let currentWeek = 0
        let lastWeek = 0
        if (dateNow <= 7) {
            week = "1"
            currentWeek = weeklyStats[0].currentMonth
            lastWeek = weeklyStats[3].previousMonth
        }
        if (dateNow <= 14) {
            week = "2"
            currentWeek = weeklyStats[1].currentMonth
            lastWeek = weeklyStats[0].currentMonth
        }
        else if (dateNow <= 21) {
            week = "3"
            currentWeek = weeklyStats[2].currentMonth
            lastWeek = weeklyStats[1].currentMonth
            console.log(week, lastWeek, currentWeek);
        }
        else {
            week = "4"
            currentWeek = weeklyStats[3].currentMonth
            lastWeek = weeklyStats[2].currentMonth
        }

        // Maths
        if (lastWeek === 0 && currentWeek === 0) {
            return { percentage: 0, color: "gray" }
        }
        if (lastWeek === 0 && currentWeek > 0) {
            return { percentage: 100, color: "green" }
        }
        else {
            const diff = Math.abs(currentWeek - lastWeek)
            return {
                percentage: (diff / lastWeek) * 100,
                color: currentWeek > lastWeek ? "green" : "red"
            }
        }
    }
    // Calculate weekly percentage change
    const weeklyPercentageChange = getWeeklyPercentageChange()
    // Get total appointments
    const totalAppointments = useAllAppointments()
    // Get today's appointments
    const todaysTotalAppointments = useTodaysAppointments()
    // Open Patient Details Modal
    const openModal = (patient) => {
        setModalOpen(true)
        setSelectedPatient(patient)
    }
    // Close Patient Details Modal
    const closeModal = () => {
        setModalOpen(false)
        setSelectedPatient(null)
    }
    // Open Add Patient Modal
    const openAddPatientModal = () => {
        setNewPatientModal(true)
    }
    // Close Add Patient Modal
    const closeAddPatientModal = () => {
        setNewPatientModal(false)
    }
    return (
        <div className='p-5 w-full h-screen bg-gray-50'>
            {/* Heading */}
            <div className=' px-5 py-2 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center font-poppins'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl text-gray-800 tracking-tight'>Patient Records</h1>
                    <p className='text-sm text-gray-500 text-center md:text-left'>Manage your patients</p>
                </div>
                <div onClick={() => openAddPatientModal()} className='flex justify-center items-center gap-1 bg-blue-600 text-white py-2 px-3 rounded-xl cursor-pointer hover:bg-blue-500'>
                    <button >
                        <UserPlus size={18} />
                    </button>
                    <h3 className='text-[13px]'>Add a Patient</h3>
                </div>
            </div>
            {/* Search */}
            <div className='px-8 py-5 mt-2 bg-white relative rounded-lg shadow-sm'>
                <Search size={16} className='absolute left-11 top-1/2 -translate-y-1/2 text-gray-500' />
                <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" className='w-full rounded-2xl px-5 py-1.5 pl-9 outline outline-gray-300 text-sm text-gray-700 bg-white' placeholder='Search patients by name, ID or contact' />
            </div>
            {/* Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 mt-5 gap-8'>
                {/* Total Patients */}
                <div className='flex flex-col bg-white shadow-md rounded-xl px-5 py-3 border-r-4 border-purple-500 hover:shadow-lg transition-all'>
                    <div className='flex flex-row justify-between items-center '>
                        <div className='flex flex-col'>
                            <h3 className='font-poppins text-base text-gray-500 tracking-tighter'>Total Patients</h3>
                            <p className='text-xl font-poppins text-gray-800 tracking-tight'>{totalPatients}</p>
                        </div>
                        <div className='flex items-center justify-center h-11 w-11 rounded-full bg-purple-200'>
                            <Users className='text-purple-700' size={17} />
                        </div>
                    </div>
                    <div className='mt-8 flex items-center gap-1'>
                        {percentChange.color === "green" ? (
                            <TrendingUp size={12} className="text-green-500" />
                        ) : (
                            <TrendingDown size={12} className="text-red-500" />
                        )}
                        <p className={`${percentChange.color === "green" ? "text-green-500" : "text-red-500"} text-[13px]`}>{percentChange.percentage.toFixed(2)}% {percentChange.color === "green" ? "increase" : "decrease"} from last month</p>
                    </div>
                </div>
                {/* New Patients */}
                <div className='flex flex-col bg-white shadow-md rounded-xl px-5 py-3 border-r-4 border-blue-500 hover:shadow-lg transition-all'>
                    <div className='flex flex-row justify-between items-center '>
                        <div className='flex flex-col'>
                            <h3 className='font-poppins text-base text-gray-500 tracking-tighter'>New Patients</h3>
                            <p className='text-xl font-poppins text-gray-800 tracking-tight'>{currentMonthTotalPatients}</p>
                        </div>
                        <div className='flex items-center justify-center h-11 w-11 rounded-full bg-blue-200'>
                            <UserPlus className='text-blue-700' size={17} />
                        </div>
                    </div>
                    <div className='mt-8 flex items-center gap-1'>
                        {weeklyPercentageChange.color === "green" ? (
                            <TrendingUp size={12} className="text-green-500" />
                        ) : (
                            <TrendingDown size={12} className="text-red-500" />
                        )}
                        <p className={`${weeklyPercentageChange.color === "green" ? "text-green-500" : "text-red-500"} text-[13px]`}>{weeklyPercentageChange.percentage.toFixed(2)}% {weeklyPercentageChange.color === "green" ? "increase" : "decrease"} from last week</p>
                    </div>
                </div>
                {/* Appointments */}
                <div className='flex flex-col bg-white shadow-md rounded-xl px-5 py-3 border-r-4 border-amber-500 hover:shadow-lg transition-all'>
                    <div className='flex flex-row justify-between items-center '>
                        <div className='flex flex-col'>
                            <h3 className='font-poppins text-base text-gray-500 tracking-tighter'>Appointments</h3>
                            {totalAppointments.loading === true ? (
                                <p className='text-xl font-poppins text-gray-800 tracking-tight'>Loading......</p>
                            ) : (
                                <p className='text-xl font-poppins text-gray-800 tracking-tight'>{totalAppointments.appointments.length}</p>
                            )}

                        </div>
                        <div className='flex items-center justify-center h-11 w-11 rounded-full bg-amber-200'>
                            <CalendarPlus className='text-amber-700' size={17} />
                        </div>
                    </div>
                    <div className='mt-8 flex items-center gap-1'>
                        <MountainSnow size={12} className='text-amber-500' />
                        {todaysTotalAppointments.loading === true ? (
                            <p>Loading......</p>
                        ) : (
                            <p className="text-[13px] text-amber-500">{todaysTotalAppointments.todaysAppointments.length} {todaysTotalAppointments.todaysAppointments.length === 1 ? "appointment" : "appointments"} today</p>
                        )}

                    </div>
                </div>
            </div>
            {/* Table Section */}
            <div className='bg-white mt-5 rounded-2xl shadow-sm'>
                {/* Header */}
                <div className='px-5 py-3'>
                    <h1 className='font-nunito text-gray-800 text-xl tracking-tight font-semibold'>Patient List</h1>
                </div>
                <hr className='text-gray-200' />
                {/* Table columns */}
                <div className='max-h-[100vh] overflow-y-auto'>
                    <table className='w-full text-sm'>
                        <thead className='font-poppins text-gray-500 text-left bg-gray-50 sticky z-20 top-0'>
                            <tr className=''>
                                <th className='font-light py-3 px-5'>ID</th>
                                <th className='font-light py-3 px-5'>Name</th>
                                <th className='font-light py-3 px-5'>Age</th>
                                <th className='font-light py-3 px-5'>Contact</th>
                                <th className='font-light py-3 px-5'>Last Visit</th>
                                <th className='font-light py-3 px-5'></th>
                            </tr>
                        </thead>
                        <tbody className='font-poppins text-gray-600 tracking-tight text-left '>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className='py-5'>
                                        <div className='flex w-full justify-center items-center'>
                                            <Cardio size="200" stroke="8" speed="2" color="orange" />
                                        </div>
                                    </td>
                                </tr>
                            ) : searchedPatient.length > 0 ? (
                                searchedPatient.map((patient, index) => (
                                    <tr key={index} className='border-b-1 border-gray-200 hover:bg-gray-50'>
                                        <td className='py-2 px-5 text-gray-500'>{patient._id}</td>
                                        <div className='flex flex-col'>
                                            <td className='pt-2 px-5'>{patient.name}</td>
                                            <td className='pb-1 px-5 text-gray-400'>{patient.gender}</td>
                                        </div>
                                        <td className='py-2 px-5'>{patient.age}</td>
                                        <td className='py-2 px-5'>{patient.contactNumber}</td>
                                        <td className='py-2 px-5'>{new Date(patient.updatedAt).toLocaleDateString()}</td>
                                        <td className='py-2 px-5'><button onClick={() => openModal(patient)} className='text-green-500 text-[13px] cursor-pointer hover:text-green-600 hover:underline transition-all'>Show Details</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='px-5 py-2'></td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
            {/* Patient's details Modal */}
            {modalOpen && selectedPatient && (
                <div className='fixed inset-0 z-50 pt-10 backdrop-blur-[2px] w-full bg-black/70'>
                    <div className='flex justify-end'>
                        <button
                            onClick={() => closeModal()}
                            className='text-white px-6 -mt-8 mb-2 font-poppins cursor-pointer hover:text-gray-200'>
                            Close
                        </button>
                    </div>
                    <div className='w-full bg-white border border-gray-300 rounded-none md:rounded-tr-4xl md:rounded-tl-4xl'>
                        <div className='bg-white max-w-3xl mx-auto border-l-1 border-gray-200 border-r-1 border-b-1'>
                            {/* Heading */}
                            <div className='pt-5 px-5 flex items-center justify-center gap-2'>
                                <SquareActivity size={30} className='text-blue-600' />
                                <h1 className='font-poppins text-4xl text-gray-600 tracking-tight'>Patient Details</h1>
                            </div>
                            <hr className='mt-4 border-gray-300' />
                            {/* Information */}
                            <div className='font-nunito flex flex-col md:flex-row mt-5 items-center justify-between max-w-2xl mx-auto'>
                                {/* basic Info */}
                                <div className='flex gap-2'>
                                    {/* Circle */}
                                    <div className='h-15 w-15 rounded-full bg-gray-100 inline-flex items-center justify-center'>
                                        <User size={25} className='text-gray-600' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-gray-700 tracking-tight font-bold'>{selectedPatient.name}</span>
                                        <span className='text-xs text-gray-600'>Patient ID: {selectedPatient._id}</span>
                                        <span className='text-xs text-gray-600'>{selectedPatient.age} Years</span>
                                        <span className='text-xs text-gray-600'>{selectedPatient.gender}</span>
                                    </div>
                                </div>

                                {/* COntact Details */}
                                <div className='flex flex-col bg-gray-50 p-5 rounded-xl gap-1'>
                                    <h3 className='text-xs font-bold'>Contact Information</h3>

                                    <div className='flex items-center gap-1'>
                                        <Phone size={13} className='text-gray-600' />
                                        <span className='text-xs  text-gray-700'>+91 {selectedPatient.contactNumber}</span>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <House size={13} className='text-gray-600' />
                                        <span className='text-xs  text-gray-700'>{selectedPatient.address}</span>
                                    </div>
                                </div>
                            </div>
                            <hr className='mt-5 border-gray-200' />
                            {/* Scrollable div */}
                            <div className='max-h-[70vh] overflow-y-auto'>
                                {/* Condition Mapping */}
                                <div className=' p-5'>
                                    <h1 className='text-gray-600 font-poppins font-semibold'>Medical History</h1>
                                    {selectedPatient.medicalHistory.length > 0 ? (
                                        selectedPatient.medicalHistory.map((entry, index) => (
                                            <div key={index} className='max-w-2xl mx-auto border border-gray-300 rounded-xl mt-3 px-5 py-1.5 font-nunito'>
                                                <div className='flex items-center gap-3'>
                                                    <BriefcaseMedical size={17} className='text-blue-700' />
                                                    <div className='flex flex-col'>
                                                        <h3 className='text-[12px] text-gray-900'>{entry.diagnosis}</h3>
                                                        <p className='text-[10px] text-gray-700'>Diagnosed On: {new Date(entry.diagnosedDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No Medical History</p>
                                    )}
                                </div>

                                {/* Medicines Mapping */}
                                <div className='p-5 -mt-5'>
                                    <h1 className='text-gray-600 font-poppins font-semibold'>Medicines</h1>
                                    <div className='mt-1 px-5 py-2 rounded-md'>
                                        <table className='w-full text-sm'>
                                            <thead className='font-nunito bg-gray-100 text-left'>
                                                <tr className='rounded-md'>
                                                    <th className='text-gray-600 font-light px-3 py-2'>Medicine</th>
                                                    <th className='text-gray-600 font-light px-3 py-2'>Dosage</th>
                                                    <th className='text-gray-600 font-light px-3 py-2'>Frequency</th>
                                                    <th className='text-gray-600 font-light px-3 py-2'>Prescribed</th>
                                                    <th className='text-gray-600 font-light px-3 py-2'>Notes</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedPatient.medicalHistory.map((entry, index) => (
                                                    entry.medication.map((medicine, index) => (
                                                        <tr key={index} className='border-b-1 border-gray-100'>
                                                            <div className='flex flex-col py-2 '>
                                                                <td className='text-gray-600 px-3 text-[12px]'>{medicine.name}</td>
                                                                <p className='text-gray-400 px-3 text-[10px]'>For {entry.condition}</p>
                                                            </div>
                                                            <td className='text-gray-600 px-3 text-[12px]'>{medicine.dosage}</td>
                                                            <td className='text-gray-600 px-3 text-[12px]'>{medicine.frequency}</td>
                                                            <td className='text-gray-600 px-3 text-[12px]'>{new Date(entry.diagnosedDate).toLocaleDateString()}</td>
                                                            <td className='text-gray-600 px-3 text-[12px]'>{medicine.notes}</td>
                                                        </tr>
                                                    ))
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Vital Signs Mapping */}
                                <div className='p-5 -mt-7 mb-5'>
                                    <h1 className='text-gray-600 font-poppins font-semibold'>Recent Vital Signs</h1>
                                    <div className='mt-1 px-5 py-2 rounded-md'>
                                        {/* Grids */}
                                        {selectedPatient.vitals.map((vital, index) => (
                                            <div key={index} className='grid md:grid-cols-4 gap-5'>
                                                {/* BP */}
                                                <div className='border border-gray-300 rounded-md flex flex-col'>
                                                    <div className=' flex pt-2 px-2 justify-between items-center'>
                                                        <h3 className='text-[12px] text-gray-600'>Blood Pressure</h3>
                                                        <Activity size={14} className='text-blue-700' />
                                                    </div>
                                                    <div className='px-2 flex gap-1 '>
                                                        <h3 className='text-gray-900 text-lg font-semibold'>{vital.bloodPressure}</h3>
                                                        <p className='text-gray-600 text-[13px] relative top-[6px]'>mmhg</p>
                                                    </div>
                                                    <div className='px-2 flex gap-1 mt-1'>
                                                        <h3 className='text-gray-600 text-[10px]'>Recorded On:</h3>
                                                        <p className='text-gray-600 text-[10px]'>{new Date(vital.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className='px-2 flex gap-1 pb-2'>
                                                        <h3 className='text-gray-600 text-[10px]'>Recorded At:</h3>
                                                        <p className='text-gray-600 text-[10px]'>{new Date(vital.date).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>

                                                {/* Heart Rate */}
                                                <div className='border border-gray-300 rounded-md flex flex-col'>
                                                    <div className=' flex pt-2 px-2 justify-between items-center'>
                                                        <h3 className='text-[12px] text-gray-600'>Heart Rate</h3>
                                                        <Activity size={14} className='text-blue-700' />
                                                    </div>
                                                    <div className='px-2 flex gap-1 '>
                                                        <h3 className='text-gray-900 text-lg font-semibold'>{vital.heartRate}</h3>
                                                        <p className='text-gray-600 text-[13px] relative top-[6px]'>bpm</p>
                                                    </div>
                                                    <div className='px-2 flex gap-1 mt-1'>
                                                        <h3 className='text-gray-600 text-[10px]'>Recorded On:</h3>
                                                        <p className='text-gray-600 text-[10px]'>{new Date(vital.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className='px-2 flex gap-1 pb-2'>
                                                        <h3 className='text-gray-600 text-[10px]'>Recorded At:</h3>
                                                        <p className='text-gray-600 text-[10px]'>{new Date(vital.date).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>

                                                {/* Temperature */}
                                                <div className='border border-gray-300 rounded-md flex flex-col'>
                                                    <div className=' flex pt-2 px-2 justify-between items-center'>
                                                        <h3 className='text-[12px] text-gray-600'>Temperature</h3>
                                                        <Activity size={14} className='text-blue-700' />
                                                    </div>
                                                    <div className='px-2 flex gap-1 '>
                                                        <h3 className='text-gray-900 text-lg font-semibold'>{vital.temperature}</h3>
                                                        <p className='text-gray-600 text-[13px] relative top-[6px]'>°F</p>
                                                    </div>
                                                    <div className='px-2 flex gap-1 mt-1'>
                                                        <h3 className='text-gray-600 text-[10px]'>Recorded On:</h3>
                                                        <p className='text-gray-600 text-[10px]'>{new Date(vital.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className='px-2 flex gap-1 pb-2'>
                                                        <h3 className='text-gray-600 text-[10px]'>Recorded At:</h3>
                                                        <p className='text-gray-600 text-[10px]'>{new Date(vital.date).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add new Patient Modal */}
            {newPatientModal && (
                <div className='fixed inset-0 z-50 pt-10 backdrop-blur-[2px] w-full bg-black/70'>
                    <div className='flex justify-end'>
                        <button
                            onClick={() => closeAddPatientModal()}
                            className='text-white px-6 -mt-8 mb-2 font-poppins cursor-pointer hover:text-gray-300'>
                            Close
                        </button>
                    </div>
                    <AddPatient />
                </div>
            )}
        </div >
    )
}

export default Patients
