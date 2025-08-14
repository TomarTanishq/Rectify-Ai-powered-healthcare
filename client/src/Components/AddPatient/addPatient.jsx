import React from 'react'
import { useState } from 'react'
import { HeartPlus, Plus } from "lucide-react"
import axios from 'axios'
import { toast } from 'react-toastify'
import api from '../../api'
const AddPatient = () => {
    //Add Patient state
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        contactNumber: "",
        address: "",
        gender: "",
        medicalHistory: [{
            condition: "",
            diagnosis: "",
            medication: [{
                name: "",
                dosage: "",
                frequency: "",
                notes: ""
            }]
        }],
        vitals: [{
            bloodPressure: "",
            heartRate: "",
            temperature: ""
        }],
        nextAppointment: ""
    })
    // Top level form handling
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    //Handle medical history change
    const handleMedicalHistoryChange = (index, e) => {
        const { name, value } = e.target
        const newMedicalHistory = [...formData.medicalHistory]
        newMedicalHistory[index][name] = value
        setFormData(prev => ({
            ...prev,
            medicalHistory: newMedicalHistory
        }))
    }
    // Handle medicine changes
    const handleMedicineChange = (historyIndex, medicalIndex, e) => {
        const { name, value } = e.target
        const updatedHistory = [...formData.medicalHistory]
        updatedHistory[historyIndex].medication[medicalIndex][name] = value
        setFormData({ ...formData, medicalHistory: updatedHistory })
    }
    // Add a new medical history entry
    const addMedicalHistoryEntry = () => {
        setFormData({
            ...formData,
            medicalHistory: [
                ...formData.medicalHistory,
                {
                    condition: '',
                    diagnosis: '',
                    medication: [{ name: '', dosage: '', frequency: '', notes: '' }],
                }
            ]
        })
    }
    // Add new medicine inside a specific medical history entry
    const addMedicalEntry = (historyIndex) => {
        const updatedHistory = [...formData.medicalHistory];
        updatedHistory[historyIndex].medication.push({
            name: '',
            dosage: '',
            frequency: '',
            notes: '',
        })
        setFormData({ ...formData, medicalHistory: updatedHistory })
    }
    // Handle vital changes
    const handleVitalChange = (index, e) => {
        const { name, value } = e.target
        const updatedViitals = [...formData.vitals]
        updatedViitals[index][name] = value
        setFormData({ ...formData, vitals: updatedViitals })
    }
    // Submit Form
    const handleAddPatient = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/patients/add', formData, {
                withCredentials: true
            })
            setFormData({
                doctor: "",
                doctorName: "",
                name: "",
                age: "",
                contactNumber: "",
                address: "",
                gender: "",
                medicalHistory: [
                    {
                        condition: "",
                        diagnosis: "",
                        medication: [
                            { name: "", dosage: "", frequency: "", notes: "" }
                        ],
                        diagnosedDate: ""
                    }
                ],
                vitals: [
                    {
                        bloodPressure: "",
                        heartRate: "",
                        temperature: "",
                        AdditionalReadings: [""]
                    }
                ],
                nextAppointment: ""
            });
            toast.success("Patient Added Successfully!");
        } catch (error) {
            console.log(error.message || error);
            toast.error("Patient couldn't be added!");
            // alert("Failed to add patient")
        }
    }
    return (
        <div>
            <div className='w-full bg-white border border-gray-300 rounded-none md:rounded-tr-4xl md:rounded-tl-4xl'>
                {/* Heading */}
                <div className='pt-5 px-5 flex items-center justify-center gap-2'>
                    <HeartPlus size={30} className='text-blue-600' />
                    <h1 className='font-poppins text-4xl text-gray-600 tracking-tight'>Patient Registration</h1>
                </div>
                <hr className='mt-4 border-gray-300' />

                {/* Form */}
                <div className='max-w-3xl mx-auto mt-4 rounded-md max-h-[82.5vh] overflow-y-auto'>
                    <form onSubmit={handleAddPatient}>
                        {/* Personal Information */}
                        <div className='px-5 pt-4 pb-5 bg-gray-50 rounded-lg border border-gray-200'>
                            <h2 className='text-gray-800 text-[16px] font-semibold'>Personal Information</h2>

                            <div className='grid grid-cols-1 md:grid-cols-3 mt-2 gap-x-4 gap-y-2.5'>
                                {/* Name */}
                                <div className='flex flex-col gap-1 col-span-2 md:col-span-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Full Name</label>
                                    <input name='name' value={formData.name} onChange={handleChange} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div>
                                {/* Age */}
                                <div className='flex flex-col gap-1 col-span-2 md:col-span-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Age</label>
                                    <input name='age' value={formData.age} onChange={handleChange} type="number" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div>
                                {/* Gender */}
                                <div className='flex flex-col gap-1 col-span-2 md:col-span-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white'>
                                        <option value="">Select a gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                {/* Contact Number */}
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Contact Number</label>
                                    <input name='contactNumber' value={formData.contactNumber} onChange={handleChange} type="number" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div>
                                {/* Address */}
                                <div className='flex flex-col gap-1 col-span-2'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Address</label>
                                    <input name='address' value={formData.address} onChange={handleChange} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div>
                            </div>

                        </div>
                        {/* Vitals */}
                        <div className='px-5 pt-4 pb-5 bg-gray-50 rounded-lg mt-5 border border-gray-200'>
                            <h2 className='text-gray-800 text-[16px] font-semibold'>Vital Signs</h2>

                            <div className='grid grid-cols-1 md:grid-cols-3 mt-2 gap-x-4 gap-y-2.5'>
                                {/* Blood Preasure */}
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Blood Pressure</label>
                                    <input name='bloodPressure' value={formData.vitals[0].bloodPressure} onChange={(e) => handleVitalChange(0, e)} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' placeholder='120/80' />
                                </div>
                                {/* Heart Rate */}
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Heart Rate(bpm)</label>
                                    <input name='heartRate' value={formData.vitals[0].heartRate} onChange={(e) => handleVitalChange(0, e)} type="number" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div>
                                {/* Temperature */}
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Temperature(°F)</label>
                                    <input name='temperature' value={formData.vitals[0].temperature} onChange={(e) => handleVitalChange(0, e)} type="number" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div>

                            </div>

                        </div>
                        {/* Medical History */}
                        <div className='px-5 pt-4 bg-gray-50 rounded-lg mt-5 border border-gray-200 pb-5'>
                            <div className='flex justify-between'>
                                <h2 className='text-gray-800 text-[16px] font-semibold'>Medical History</h2>
                                <button type='button' onClick={addMedicalHistoryEntry}>
                                    <Plus className='text-blue-600 cursor-pointer'/>
                                </button>
                            </div>
                            {formData.medicalHistory.map((history, historyIndex) => (
                                <div key={historyIndex} className='grid grid-cols-1 md:grid-cols-1 mt-2 gap-x-4 gap-y-2.5'>
                                    {/* Condition */}
                                    <div className='bg-white p-5 rounded-md'>
                                        <h3 className='text-gray-700 text-[12px] mb-2 font-semibold underline underline-offset-2'>Medical Entry {historyIndex + 1}</h3>
                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="" className='text-gray-700 text-[14px]'>Condition</label>
                                            <input name='condition' value={history.condition} onChange={(e) => handleMedicalHistoryChange(historyIndex, e)} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                        </div>

                                        {/* Diagnosis */}
                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="" className='text-gray-700 text-[14px]'>Diagnosis</label>
                                            <textarea name="diagnosis" value={history.diagnosis} onChange={(e) => handleMedicalHistoryChange(historyIndex, e)} className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white'></textarea>
                                        </div>
                                        {/* Medication */}
                                        <div className='flex justify-between items-center mt-5 mb-2'>
                                            <h2 className='text-gray-800 font-semibold text-[14px]'>Medications</h2>
                                            <button type='button' onClick={() => addMedicalEntry(historyIndex)}>
                                            <Plus className='text-blue-600 cursor-pointer'/>
                                            </button>
                                        </div>
                                        {history.medication.map((med, medIndex) => (
                                            <div key={medIndex} className='flex flex-col gap-2 mb-2'>
                                                {/* Medicines */}
                                                {/* <h3 className='text-gray-700 text-sm mb-2 text-center'>Medicine Entry {medIndex + 1}</h3> */}
                                                <div className='bg-white border border-gray-300 rounded-md grid grid-cols-1 md:grid-cols-4 px-5 gap-x-4 pb-5'>

                                                    {/* Medication Name */}
                                                    <div className='flex flex-col gap-1 pt-4'>
                                                        <label htmlFor="" className='text-gray-700 text-[14px]'>Medication Name</label>
                                                        <input name='name' value={med.name} onChange={(e) => handleMedicineChange(historyIndex, medIndex, e)} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                                    </div>
                                                    {/* Dosage */}
                                                    <div className='flex flex-col gap-1 pt-4'>
                                                        <label htmlFor="" className='text-gray-700 text-[14px]'>Dosage</label>
                                                        <input name='dosage' value={med.dosage} onChange={(e) => handleMedicineChange(historyIndex, medIndex, e)} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                                    </div>
                                                    {/* Frequency */}
                                                    <div className='flex flex-col gap-1 pt-4'>
                                                        <label htmlFor="" className='text-gray-700 text-[14px]'>Frequency</label>
                                                        <input name='frequency' value={med.frequency} onChange={(e) => handleMedicineChange(historyIndex, medIndex, e)} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                                    </div>
                                                    {/* Notes */}
                                                    <div className='flex flex-col gap-1 pt-4'>
                                                        <label htmlFor="" className='text-gray-700 text-[14px]'>Notes</label>
                                                        <input name='notes' value={med.notes} onChange={(e) => handleMedicineChange(historyIndex, medIndex, e)} type="text" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Next Appointment */}
                        <div className='px-5 pt-4 pb-5 bg-gray-50 rounded-lg mt-5 border border-gray-200'>
                            <h2 className='text-gray-800 text-[16px] font-semibold'>Next Appointment</h2>

                            <div className='grid grid-cols-1 md:grid-cols-3 mt-2 gap-x-4 gap-y-2.5'>
                                {/* Date */}
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Date</label>
                                    <input name='nextAppointment' value={formData.nextAppointment} onChange={handleChange} type="date" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' placeholder='120/80' />
                                </div>
                                {/* Timings */}
                                {/* <div className='flex flex-col gap-1'>
                                    <label htmlFor="" className='text-gray-700 text-[14px]'>Timing</label>
                                    <input name='nextAppointment' value={formData.nextAppointment} onChange={handleChange} type="time" className='border border-gray-300 rounded-md focus:outline-0 px-3 text-[14px] py-1 text-gray-800 bg-white' />
                                </div> */}

                            </div>

                        </div>
                        {/* Submit Button */}
                        <div className='flex justify-start mt-5 pb-5'>
                            <button className='p-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm cursor-pointer'>
                                Register Patient
                            </button>

                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default AddPatient
