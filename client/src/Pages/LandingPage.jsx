import AskAI from "../Components/AskAI/AskAI"
import HeroSection from "../Components/LandingPage/HeroSection"
import PropertiesSection from "../Components/LandingPage/PropertiesSection"
import PseudoNavBar from "../Components/LandingPage/PseudoNavBar"
import SemiFooterSection from "../Components/LandingPage/SemiFooter"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 font-robotoflex">
      {/* <Navbar/> */}
      <PseudoNavBar />
      <HeroSection />
      <PropertiesSection />
      <AskAI />
      
      <SemiFooterSection />
    </div>
  )
}

export default LandingPage
