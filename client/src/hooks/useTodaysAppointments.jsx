import { useEffect, useState } from "react"
import axios from "axios"

export const useTodaysAppointments = () => {
    const [todaysAppointments, setTodaysAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    // DocId
    const docId = localStorage.getItem("doctorId")
    // Fetch today's appointments
    const fetchTodaysAppointments = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/visitors/${docId}`)
            setTodaysAppointments(res.data)
            setLoading(false)
        } catch (err) {
            console.log("Error fetchning today's appointments")
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchTodaysAppointments()
    }, [])
    return { todaysAppointments, loading }
}

