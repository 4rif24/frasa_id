import React from "react"
import HeroContainer from "./Hero/HeroContainer"
import Gallery from "./Gallery/Gallery"
import PopularClasses from "./PopularClasses/PopularClasses"
import PopularTeacher from "./PopularTeacher/PopularTeacher"
import useAuth from "../../hooks/useAuth"

export const Home = () => {
 
  return (
    <section>
      <HeroContainer/>
      <div className="max-w-screen-xl- mx-auto">
        <Gallery/>
        <PopularClasses/>
        <PopularTeacher/>

      </div>
    </section>
  )
}

export default Home