import axios from "axios"
import { useEffect, useState } from "react"
import api from "../api"

export const useAllAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const docId = localStorage.getItem("doctorId")
    const fetchAppointments = async () => {
        try {
            const res = await api.get(`/visitors/all/${docId}`)
            setAppointments(res.data)
            setLoading(false)
        } catch (err) {
            console.log("Error loading appointments")
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchAppointments()
    }, [])
    return { appointments, loading }

}

