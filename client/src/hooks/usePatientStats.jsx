export const usePatientStats = (patients) => {// Stats for Week 1-4
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
    return weekStats
}

// export default usePatientStats
