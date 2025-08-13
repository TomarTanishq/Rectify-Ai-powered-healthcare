import Sidebar from "../Components/Dashboard/Sidebar"
import DashboardContent from "../Components/Dashboard/DashboardContent"
import { useState } from "react"
import Patients from "../Components/Dashboard/Patients"

const DoctorDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard")

  const renderContent = () => {
    switch (activePage) {
      case "Patients":
        return <Patients />;
      default:
        return <DashboardContent />
    }
  }
  return (
    // Sidebar
    <div className="flex">
      {/* Sidebar */}
      <div className="">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      </div>
      {/* Rendered Content */}
      <div className="ml-0 md:ml-40 mt-20 md:mt-0 w-full transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  )
}
export default DoctorDashboard
