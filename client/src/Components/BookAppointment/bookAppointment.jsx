import axios from "axios"
import { div } from "motion/react-client"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import api from "../../api";
const bookappointment = ({ onClose }) => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    doctor: '',
    name: '',
    age: '',
    gender: '',
    contactNumber: '',
    appointmentDate: '',
    timing: '',
    address: ''
  })

  //Fetching Doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const res = await api.get('http://localhost:3000/patients/bookAppointment')
      setDoctors(res.data)
      setLoading(false)

    } catch (error) {
      setLoading(false)
      setError(`Error fetching Doctors ${error.message}`)
      console.log(error.message);

    }
  }

  //Handle Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //Handle Visitor Data submission
  const handleAddVisitor = async (e) => {
    setSubmitting(true)
    setError('')
    e.preventDefault()

    try {

      const res = await axios.post('http://localhost:3000/visitors/onlineAppointment', formData)
      setFormData({
        doctor: '', name: '', age: '', gender: '', contactNumber: '', appointmentDate: '', address: '', timing: ''
      })
      toast.success("Appointment Booked Successfully!");
    } catch (error) {
      setError(`Failed to book appointment: ${error.message}`)
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  //Handle Loading state
  // if (loading) {
  //   return <p className='text-gray-800 p-6 text-xl font-bold text-center place-self-center'>...............</p>
  // }
  // if (error) {
  //   return <p className='text-red-500 p-6 text-xl font-bold'>{error}</p>
  // }

  //Handling form submission loading state
  // if (submitting) {
  //   return <p className='text-gray-800 p-6 text-xl font-bold text-center place-self-center'>Submiting data</p>
  // }
  // if (error) {
  //   return <p className='text-red-500 p-6 text-xl font-bold'>{error}</p>
  // }

  return (
    <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center pt-0 md:pt-55">
      <div className="h-[100vh] w-6xl bg-white rounded-none md:rounded-4xl overflow-y-auto">

        {/* Modal Header */}
        <div className="mt-5 flex flex-col">
          <span className="flex justify-end mx-6">
            <button onClick={onClose} className="cursor-pointer text-gray-500 font-poppins tracking-tighter hover:text-gray-700">Close</button>
          </span>
          <div className="max-w-xl mx-auto mt-5 font-poppins">
            <h1 className="text-4xl md:text-5xl tracking-tighter text-gray-700">Book Your Appointment</h1>
          </div>
        </div>

        {/* Modal Body */}
        <div className="w-full mx-auto font-nunito">

          {/* Form */}
          <form onSubmit={handleAddVisitor}>

            {/* With Dr. */}
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-base mt-2 text-[#FA5B30]">With Dr.</h2>
              {doctors.length > 0 ? (
                <select
                  name="doctor"
                  id="underline_select"
                  className="mt-2 px-0  text-gray-700 bg-transparent border-0 border-b-2 border-gray-400"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Doctor</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor._id}>{doctor.name} || {doctor.specialization}</option>
                  ))}
                </select>
              ) : (
                <h2 className="text-base mt-2 text-[#FA5B30]">Error Loading Doctors</h2>
              )}


            </div>

            {/* Patient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 md:max-w-2xl mx-auto p-5">
              <div className="flex flex-col text-left gap-2">
                <label className="text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg outline-0 px-5 py-1"
                  placeholder="Enter your Name"
                />
              </div>
              <div className="flex flex-col text-left gap-2">
                <label htmlFor="" className="text-gray-700">Contact</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg outline-0 px-5 py-1"
                  placeholder="Enter your Contact Number"
                />
              </div>
              <div className="flex flex-col text-left gap-2 md:col-span-2">
                <label htmlFor="" className="text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg outline-0 px-5 py-2"
                  placeholder="Enter your Address"
                />
              </div>
              <div className="flex flex-col text-left gap-2">
                <label htmlFor="" className="text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg outline-0 px-5 py-1"
                  placeholder="Enter your Age"
                />
              </div>
              <div className="flex flex-col text-left gap-2">
                <label htmlFor="" className="text-gray-700">Appointment Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg outline-0 px-5 py-1"
                  placeholder="Enter your Contact Number"
                />
              </div>

              {/* Timings */}
              <div className="md:col-span-2 mt-5">
                <label className="block text-left text-md font-medium text-gray-700 mb-2">Choose Timing</label>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                  <label className="relative flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 has-checked:bg-indigo-200 has-checked:text-indigo-600 has-checked:border-1 has-checked:border-indigo-300">
                    <input
                      type="radio"
                      name="timing"
                      onChange={handleChange}
                      value="09:00 AM"
                      className="absolute opacity-0"
                      required
                    />
                    <span className="text-sm">09:00 AM</span>
                  </label>
                  <label className="relative flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 has-checked:bg-indigo-200 has-checked:text-indigo-600 has-checked:border-1 has-checked:border-indigo-300">
                    <input
                      type="radio"
                      name="timing"
                      onChange={handleChange}
                      value="10:00 AM"
                      className="absolute opacity-0"
                      required
                    />
                    <span className="text-sm">10:00 AM</span>
                  </label>
                  <label className="relative flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 has-checked:bg-indigo-200 has-checked:text-indigo-600 has-checked:border-1 has-checked:border-indigo-300">
                    <input
                      type="radio"
                      name="timing"
                      onChange={handleChange}
                      value="11:00 AM"
                      className="absolute opacity-0"
                      required
                    />
                    <span className="text-sm">11:00 AM</span>
                  </label>
                  <label className="relative flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 has-checked:bg-indigo-200 has-checked:text-indigo-600 has-checked:border-1 has-checked:border-indigo-300">
                    <input
                      type="radio"
                      name="timing"
                      onChange={handleChange}
                      value="01:00 PM"
                      className="absolute opacity-0"
                      required
                    />
                    <span className="text-sm">01:00 PM</span>
                  </label>
                  <label className="relative flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 has-checked:bg-indigo-200 has-checked:text-indigo-600 has-checked:border-1 has-checked:border-indigo-300">
                    <input
                      type="radio"
                      name="timing"
                      onChange={handleChange}
                      value="02:00 PM"
                      className="absolute opacity-0"
                      required
                    />
                    <span className="text-sm">02:00 PM</span>
                  </label>
                  <label className="relative flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 has-checked:bg-indigo-200 has-checked:text-indigo-600 has-checked:border-1 has-checked:border-indigo-300">
                    <input
                      type="radio"
                      name="timing"
                      onChange={handleChange}
                      value="03:00 PM"
                      className="absolute opacity-0"
                      required
                    />
                    <span className="text-sm">03:00 PM</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#FA5B30] text-white py-2 px-4 rounded-md hover:bg-[#fa4830] font-medium cursor-pointer"
                >
                  {/* Loading State */}
                  {submitting ? (
                    <div className="flex justify-center items-center">
                      <div className="flex space-x-1 py-2 px-4">
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div>Confirm Appointment</div>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default bookappointment
