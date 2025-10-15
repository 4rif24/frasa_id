import React from 'react';
import bgImg from "../../../assets/dashboard/jaconda-14.png";

const InstructorCP = () => {
  return (
    <div>
      <div className='h-screen my-5'>
        <h1 className='text-2xl font-bold'>Instructor Dashboard</h1>
        <img src={bgImg} alt="" className='md:w-1/2' />
      </div>
    </div>
  );
}

export default InstructorCP;