import React from "react";
import { PulseLoader } from 'react-spinners';



const Loader = ({isLoading=true , color="white"}) => {
  return (
    <PulseLoader 
    color={color}
    loading={isLoading} 
  />
  );
};

export default Loader;
