import { Outlet } from "react-router-dom"
import NavBar from "../components/headers/NavBar"
import Footer from "../pages/Home/Footer/Footer"

export const MainLayout = () => {
  return (
    <main className="dark:bg-black overflow-hidden">
      <NavBar/>
      <Outlet/>
      <Footer/>
    </main>
  )
}

export default MainLayout
