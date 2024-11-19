import React from "react";
// import { Link } from "react-router-dom";
import Price2 from "../assets/price2.jpg";
import Price3 from "../assets/price3.jpg";
import Navbar from "../components/navbar";

function CalculateChina() {
  return (
    <div>
        <Navbar></Navbar>
      <div className="pt-14 w-full flex flex-col align-center justify-center items-center 2xl:px-[20vw]">
        <h1 className="text-center text-[20px] text-[#fff] font-semibold px-10 py-2  rounded-md bg-[#8044CC]">ສຳລັບສາງ “ຄຸນຫມີງ”</h1>
        <img src={Price2} alt="calculate" className="w-full my-2" />
        <h1 className="text-center text-[20px] text-[#fff] font-semibold px-10 py-2  rounded-md bg-[#8044CC]">ສຳລັບສາງ “ກວາງໂຈວ”</h1>

        <img src={Price3} alt="calculate" className="w-full mt-2" />
      </div>
    </div>
  );
}

export default CalculateChina;
