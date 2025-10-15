import React from 'react'
import image1 from "../../../assets/gallary/image1.jpg"
import image2 from "../../../assets/gallary/image2.jpg"
import image3 from "../../../assets/gallary/image3.jpg"
import image4 from "../../../assets/gallary/image4.jpg"
import image5 from "../../../assets/gallary/image5.jpg"

const Gallery = () => {
  return (
    <section className='md:w-[80%] mx-auto my-28 px-4'>
        <div className="mb-16 text-center">
            <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>
                Our Gallery
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our collection of memorable moments and beautiful works
            </p>
        </div>

        {/* Grid container */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Main featured image */}
            <div className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                <img 
                  src={image1} 
                  alt="Featured gallery image showcasing our work" 
                  className='h-[400px] md:h-[720px] w-full object-cover'
                />
            </div>
            
            {/* Secondary images grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03]">
                    <img 
                      className="h-[200px] md:h-[350px] w-full object-cover" 
                      src={image2}
                      alt="Secondary gallery image 1" 
                    />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03]">
                    <img 
                      className="h-[200px] md:h-[350px] w-full object-cover" 
                      src={image3}
                      alt="Secondary gallery image 2" 
                    />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03]">
                    <img 
                      className="h-[200px] md:h-[350px] w-full object-cover" 
                      src={image4}
                      alt="Secondary gallery image 3" 
                    />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03]">
                    <img 
                      className="h-[200px] md:h-[350px] w-full object-cover" 
                      src={image5}
                      alt="Secondary gallery image 4" 
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Gallery