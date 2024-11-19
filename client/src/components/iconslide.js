import React, { useEffect, useRef } from "react";
// import "./App.css";
import Icon1 from "../assets/icon(1).jpg";
import Icon2 from "../assets/icon(2).jpg";
import Icon3 from "../assets/icon(3).jpg";
import Icon4 from "../assets/icon(4).jpg";
import Icon5 from "../assets/icon(5).jpg";
import Icon6 from "../assets/icon(6).jpg";
import Icon7 from "../assets/icon(7).jpg";
import Icon8 from "../assets/icon(8).jpg";
import Icon9 from "../assets/icon(9).jpg";
import Icon10 from "../assets/icon(10).jpg";
import Icon11 from "../assets/icon(11).jpg";
import Icon12 from "../assets/icon(12).jpg";
import Icon13 from "../assets/icon(13).jpg";

const IconSlide = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    // Duplicate the list to create infinite scroll effect
    const ul = sliderRef.current;
    ul.insertAdjacentHTML("afterend", ul.outerHTML);
    ul.nextSibling.setAttribute("aria-hidden", "true");
  }, []);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="w-full max-w-5xl md:px-10 py-24 mx-auto">
        <div className="text-center">
          <div className="w-full inline-flex flex-nowrap overflow-hidden mask-image-linear">
            <ul
              ref={sliderRef}
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
            >
              <li>
                <img src={Icon1} alt="1" className="w-16" />
              </li>
              <li>
                <img src={Icon2} alt="2" className="w-16" />
              </li>
              <li>
                <img src={Icon3} alt="3" className="w-16" />
              </li>
              <li>
                <img src={Icon4} alt="4" className="w-16" />
              </li>
              <li>
                <img src={Icon5} alt="5" className="w-16" />
              </li>
              <li>
                <img src={Icon6} alt="6" className="w-16" />
              </li>
              <li>
                <img src={Icon7} alt="7" className="w-16" />
              </li>
              <li>
                <img src={Icon8} alt="8" className="w-16" />
              </li>
              <li>
                <img src={Icon9} alt="8" className="w-16" />
              </li>
              <li>
                <img src={Icon10} alt="8" className="w-16" />
              </li>
              <li>
                <img src={Icon11} alt="8" className="w-16" />
              </li>
              <li>
                <img src={Icon12} alt="8" className="w-16" />
              </li>
              <li>
                <img src={Icon13} alt="8" className="w-16" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSlide;
