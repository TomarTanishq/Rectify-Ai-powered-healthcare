import React, { useEffect, useState } from 'react'
// import axios from 'axios'
import DoctorGreeting from "../../images/DoctorGreeting.png"
import { User, SquareActivity, Phone, House, BriefcaseMedical, Activity, Plus, Circle, CheckCircle, HeartPlus, Heart } from "lucide-react"
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import AddPatient from "../AddPatient/addPatient"
import api from '../../api';

const DoctorDashboard = () => {

  const [patients, setPatients] = useState([])
  const [todaysPatients, setTodaysPatients] = useState([])
  const [visitedPatients, setVisitedPatients] = useState({}) // Track visited patients
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isChartReady, setIsChartReady] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [newPatientModal, setNewPatientModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Tasks state
  const [tasks, setTasks] = useState([])
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [taskLoading, setTaskLoading] = useState(false)
  
  const doctorName = localStorage.getItem("doctorname");
  const docId = localStorage.getItem("doctorId")

  // Patients for today
  const fetchTodaysPatients = async () => {
    try {
      setLoading(true)
      const res = await api.get(`http://localhost:3000/visitors/${docId}`)
      setTodaysPatients(res.data)
      setLoading(false)
    } catch (error) {
      // console.error("Error fetching today's appointments", error);
      setLoading(false)
    }
  }

  // All Patients
  const fetchPatients = async () => {
    try {
      const res = await api.post('http://localhost:3000/patients/all', {}, {
        withCredentials: true
      })
      setPatients(res.data)
      setLoading(false)
    } catch (error) {
      // console.error("Error Fetching Patients", error)
      setError("Failed to fetch patients")
      setLoading(false)
    }
  }

  // Fetch today's tasks
  const fetchTodaysTasks = async () => {
    try {
      const res = await api.get('http://localhost:3000/tasks/today', {
        withCredentials: true
      })
      setTasks(res.data)
    } catch (error) {
      console.error("Error fetching tasks", error)
    }
  }

  // Add new task
  const addTask = async () => {
    if (!newTaskText.trim()) return;

    try {
      setTaskLoading(true)
      const res = await api.post('http://localhost:3000/tasks/add', {
        task: newTaskText,
        status: 'pending'
      }, {
        withCredentials: true
      })

      setTasks([...tasks, res.data])
      setNewTaskText('')
      setShowTaskInput(false)
    } catch (error) {
      console.error("Error adding task", error)
    } finally {
      setTaskLoading(false)
    }
  }

  // Update task status
  const updateTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'

    try {
      const res = await api.patch(`http://localhost:3000/tasks/${taskId}`, {
        status: newStatus
      }, {
        withCredentials: true
      })

      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error("Error updating task", error)
    }
  }

  // Handle checkbox change
  const handleVisitedChange = (patientId, isChecked) => {
    setVisitedPatients(prev => ({
      ...prev,
      [patientId]: isChecked
    }))
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    fetchTodaysPatients()
  }, [])

  useEffect(() => {
    fetchTodaysTasks()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartReady(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const totalTodaysPatients = todaysPatients.length

  //Filtering Routine Checkups for "TODAY"
  const todaysDate = new Date().toLocaleDateString()
  const routineCheckup = patients.filter(
    (patient) => new Date(patient.nextAppointment).toLocaleDateString() === todaysDate
  )

  // Modal functions
  const openModal = (patient) => {
    setSelectedPatient(patient)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setSelectedPatient(null)
  }

  //Modal for Adding new Patient
  const openAddPatientModal = () => {
    setNewPatientModal(true)
  }
  const closeAddPatientModal = () => {
    setNewPatientModal(false)
  }

  // Stats for Week 1-4
  const currMonth = new Date().getMonth()
  const currYear = new Date().getFullYear()
  const prevMonth = currMonth === 0 ? 11 : currMonth - 1
  const prevYear = currMonth === 0 ? currYear - 1 : currYear

  // get week
  const getWeek = (date) => {
    const day = date
    if (day <= 7) return 1
    if (day <= 14) return 2
    if (day <= 21) return 3
    return 4
  }

  const weekStats = [1, 2, 3, 4].map(week => ({
    week: `Week ${week}`,
    currentMonth: 0,
    previousMonth: 0
  }))

  patients.forEach(patient => {
    const week = getWeek(new Date(patient.createdAt).getDate())
    const month = new Date(patient.createdAt).getMonth()
    const year = new Date(patient.createdAt).getFullYear()

    if (month === currMonth && year === currYear) {
      weekStats[week - 1].currentMonth += 1
    } else if (month === prevMonth && year === prevYear) {
      weekStats[week - 1].previousMonth += 1
    }
  })

  return (
    <div className='w-full bg-gray-50  min-h-screen p-5'>

      {/* Grids */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-x-5'>

        {/* Greetings */}
        <div className='md:col-span-2 font-poppins tracking-tight bg-white w-full px-5 py-1 pt-4 rounded-xl shadow-sm'>
          <div className='flex justify-between'>
            <div className='flex flex-col'>
              <h1 className='text-xl/6 md:text-3xl text-gray-800 tracking-tight'>Good day, Dr.{doctorName}</h1>
              <p className='text-gray-600 text-xs md:text-sm tracking-tight'>Have a nice time!</p>
              <div className='mt-10 md:mt-19'>
                <p className='text-gray-800 text-3xl md:text-3xl font-semibold'>{totalTodaysPatients + routineCheckup.length}</p>
                <p className='text-xs md:text-sm text-gray-800'>Appointments Today</p>
              </div>
            </div>
            <div>
              <img src={DoctorGreeting} className='h-40 w-80 md:h-50 md:w-70' />
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className='md:row-span-2 md:col-span-2 bg-white rounded-xl shadow-md px-5 py-1 pt-4 mt-5 md:mt-0'>
          <h1 className='text-xl md:text-2xl text-gray-800 tracking-tight font-poppins'>Today's Appointments</h1>
          <p className='text-xs md:text-sm text-gray-600 font-nunito'>Manage appointments for today</p>

          {/* Table */}
          <div className='bg-white mt-5 rounded-md max-h-80 overflow-y-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-100 text-left font-poppins text-gray-800 sticky z-20 top-0'>
                <tr className=''>
                  <th className='px-3 py-2 font-light'></th>
                  <th className='px-5 py-2 font-light'>NAME</th>
                  <th className='px-5 py-2 font-light'>TIMING</th>
                  <th className='px-5 py-2 font-light'>PHONE NUMBER</th>
                </tr>
              </thead>

              {/* Patients map */}
              <tbody>
                {todaysPatients.length > 0 ? (
                  todaysPatients.map((patient, index) => {
                    const patientKey = patient.id || patient._id || index;
                    const isVisited = visitedPatients[patientKey] || false;

                    return (
                      <tr
                        key={patientKey}
                        className={`text-left border-b border-gray-200 text-gray-800 font-nunito ${isVisited ? 'bg-green-50' : ''
                          }`}
                      >
                        <td className='px-3 py-4'>
                          <input
                            type="checkbox"
                            checked={isVisited}
                            onChange={(e) => handleVisitedChange(patientKey, e.target.checked)}
                            className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2'
                          />
                        </td>
                        <td className={`px-5 py-4 text-xs md:text-sm ${isVisited ? 'line-through text-gray-500' : ''}`}>
                          {patient.name}
                        </td>
                        <td className={`px-5 py-4 text-xs md:text-sm ${isVisited ? 'line-through text-gray-500' : ''}`}>
                          {patient.timing}
                        </td>
                        <td className={`px-5 py-4 text-xs md:text-sm ${isVisited ? 'line-through text-gray-500' : ''}`}>
                          {patient.contactNumber}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 text-sm">
                      No appointments for today
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* Add Patient*/}
        <div className='mt-5 w-full rounded-xl font-poppins' >
          <div className='flex flex-col'>
            {/* Add Patient */}
            <div
              onClick={() => setNewPatientModal(true)}
              className='items-center justify-center flex px-2 bg-[#0E3386] hover:bg-[#191970] text-white rounded-3xl gap-2 font-nunito cursor-pointer py-4 w-[150px]'>
              <button>
                <Plus size={20} className='text-white' />
              </button>
              <p className='text-xs'>Add New Patient</p>
            </div>
          </div>
          <div className='px-2 mt-5 items-center'>
            <p className='text-3xl text-gray-800 font-semibold'>{patients.length}</p>
            <p className='text-gray-700 tracking-tight text-sm'>Total Patients</p>
          </div>
        </div>

        {/* Stats */}
        <div className=' mt-5 w-full bg-white  rounded-xl shadow-sm font-poppins' >
          <div className='flex flex-col'>
            {/* Stats Heading */}
            <div className='flex items-center gap-2 py-5 px-5'>
              {/* Circle */}
              <div className='h-8 w-8 rounded-full bg-gray-100 inline-flex items-center justify-center'>
                <User size={18} color='black' />
              </div>
              {/* Heading */}
              <div className='flex flex-col'>
                <p className='text-gray-600 text-xs'>Last month</p>
                <h3 className='text-gray-800 text-sm'>Patients</h3>
              </div>
            </div>

            <div className="w-full h-[100px]">
              {isChartReady && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weekStats}
                    margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
                  >
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="previousMonth"
                      stroke="#818589"
                      strokeWidth={1}
                      name="Previous Month" ś
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="currentMonth"
                      stroke="#82ca9d"
                      strokeWidth={1}
                      name="Current Month"
                      activeDot={{ r: 6, }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}

            </div>

          </div>


        </div>

        {/* Routine Checkups */}
        <div className='md:col-span-2 mt-5 w-full bg-white  rounded-xl shadow-sm px-5 py-1 pt-4 min-h-[40vh]'  >
          <h1 className='text-2xl tracking-tight text-gray-800 font-poppins'>Routine Checkups</h1>
          <p className='text-xs md:text-sm text-gray-600 font-nunito'>Manage regular check-ups</p>
          {/* Table */}
          <div className='bg-white mt-5 rounded-md max-h-50 overflow-y-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-100 text-left font-poppins text-gray-800 sticky z-20 top-0'>
                <tr className=''>
                  <th className='px-5 py-2 font-light'>NAME</th>
                  <th className='px-5 py-2 font-light'>PHONE NUMBER</th>
                  <th className='px-5 py-2 font-light'></th>
                </tr>
              </thead>

              {/* Patients map */}
              <tbody>
                {routineCheckup.length > 0 ? (
                  routineCheckup.map((patient, index) => {
                    return (
                      <tr
                        key={index}
                        className={`text-left border-b border-gray-200 text-gray-800 font-nunito`}
                      >
                        <td className={`px-5 py-4 text-xs md:text-sm`}>
                          {patient.name}
                        </td>
                        <td className={`px-5 py-4 text-xs md:text-sm`}>
                          {patient.contactNumber}
                        </td>
                        <td className='px-5 py-4 text-xs md:text-sm'>
                          <button onClick={() => openModal(patient)} className='cursor-pointer text-green-600'>
                            Show Details
                          </button>

                        </td>
                      </tr>
                    );
                  })

                ) : (
                  <tr>
                    <td colSpan="2" className='text-center text-gray-500 py-5 text-sm'>No routine checkups for today</td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks for Today */}
        <div className='md:row-span-2 md:col-span-2 mt-5 w-full bg-white rounded-xl shadow-sm px-5 py-1 pt-4 min-h-[40vh]'>
          {/* Heading */}
          <div className='flex justify-between items-center'>
            <div className='flex flex-col'>
              <h1 className='text-xl md:text-2xl text-gray-800 tracking-tight font-poppins'>Tasks for Today</h1>
              <p className='text-xs md:text-sm text-gray-600 font-nunito'>Manage your daily tasks</p>
            </div>
            <div
              className='flex items-center px-2 py-3 bg-[#1B1B1B] hover:bg-black text-white rounded-3xl gap-2 font-nunito cursor-pointer'
              onClick={() => setShowTaskInput(true)}
            >
              <Plus size={20} className='text-white' />
              <p className='text-xs'>Add New Task</p>
            </div>
          </div>

          {/* Tasks Container */}
          <div className='mt-5 max-h-50 overflow-y-auto'>
            {/* New Task Input */}
            {showTaskInput && (
              <div className='mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50'>
                <textarea
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter your task here..."
                  className='w-full p-2 border border-gray-300 rounded-md resize-none text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows="2"
                  autoFocus
                />
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={addTask}
                    disabled={taskLoading || !newTaskText.trim()}
                    className='px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  >
                    {taskLoading ? 'Adding...' : 'Add Task'}
                  </button>
                  <button
                    onClick={() => {
                      setShowTaskInput(false)
                      setNewTaskText('')
                    }}
                    className='px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className='space-y-3'>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${task.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <button
                      onClick={() => updateTaskStatus(task._id, task.status)}
                      className='mt-0.5 hover:scale-110 transition-transform'
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle size={18} className='text-green-600' />
                      ) : (
                        <Circle size={18} className='text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                    <div className='flex-1'>
                      <p className={`text-sm font-nunito ${task.status === 'completed'
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                        }`}>
                        {task.task}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        Created: {new Date(task.createdAt).toLocaleString()}
                      </p>
                      {task.status === 'completed' && (
                        <span className='inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full'>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p className='text-sm'>No tasks for today</p>
                  <p className='text-xs mt-1'>Click "Add New Task" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Regular Checkups Modal */}
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
    </div>

  )
}

export default DoctorDashboard