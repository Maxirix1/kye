import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../style/font-style.css'
import Logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" border-gray-200 transition duration-300 bg-white bg-opacity-90 z-50" style={{position: 'fixed', width: '100%' }}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            className="h-8"
            alt="Logo"
          />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="duration-300 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-[#732dcf] rounded-lg md:hidden hover:bg-[#7d00d1] hover:text-[#fff] focus:outline-none focus:ring-2 focus:ring-[#7d00d1] "
          aria-controls="navbar-default"
          aria-expanded={isOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:flex md:items-center text-start md:w-auto duration-300 md:bg-opacity-0 bg-opacity-90 bg-white rounded ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg text-white md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
            <li>
              <Link 
                to="/"
                className="font-bold block py-2 px-3 md:text-[#732dcf] rounded bg-[#732dcf] text-white md:bg-transparent md:p-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/#about"
                className="font-bold block py-2 px-3 text-[#732dcf] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="font-bold block py-2 px-3 text-[#732dcf] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
              >
                ຕິດຕາມພັດສະດຸ
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-bold block py-2 px-3 text-[#732dcf] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
              >
                ຄຳນວນຄ່າຂົນສົ່ງ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <hr className="bg-gray-700"/>
    </nav>
  );
}

export default Navbar;
