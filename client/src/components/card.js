import '../style/font-style.css'
import React from "react";
import { Link } from "react-router-dom";
import Plane from "../assets/plane.jpg";
import Make from "../assets/make.jpg";
import Keep from "../assets/keep.jpg";
import Find from "../assets/find.jpg";

function Card() {
  return (
    <div className="webService">
      <div className="serviceDetails">
        <h1 className="text-2xl my-10 2xl">
          <span className="text-[#8044CC] font-extrabold">|</span>{" "}
          ລາຍລະອຽດທີ່ຢູ່ສາງ
        </h1>
        <div className="flex gap-20 align-center justify-center">
          <div className="flex-col align-center justify-center">
            <div className="flex gap-5 md:gap-10 mb-5 md:mb-10">
              <div className="service flex align-center justify-center ">
                <div className="max-w-sm bg-[#fff] border border-gray-200 rounded-lg shadow ">
                  <Link href="#">
                    <img
                      className="rounded-t-lg"
                      src={Plane}
                      alt="blankimg"
                    />
                  </Link>
                  <div className="p-5">
                    <Link href="#">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-[#8044CC]">
                        ຂົນສົ່ງຂ້າມແດນ
                      </h5>
                    </Link>
                    <p className="mb-3 font-normal text-sm text-[#8044CC] ">
                    ຂົນສົ່ງທາງລົດ , ລົດສົ່ງທາງເຮືອ , ຂົນສົ່ງທາງອາກາດ
                    </p>
                  </div>
                </div>
              </div>

              <div className="service flex align-center justify-center ">
                <div className="max-w-sm bg-[#fff] border border-gray-200 rounded-lg shadow ">
                  <Link href="#">
                    <img
                      className="rounded-t-lg"
                      src={Find}
                      alt="blankimg"
                    />
                  </Link>
                  <div className="p-5">
                    <Link href="#">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-[#8044CC]">
                        ຈັດຊື້ສີນຄ້າ
                      </h5>
                    </Link>
                    <p className="mb-3 font-normal text-sm text-[#8044CC] ">
                    ຈັດຊື້ສີນຄ້າຈາກຕ່າງປະເພດ : ຈີນ , ໄທ …
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-5 md:gap-10">
              <div className="service flex align-center justify-center ">
                <div className="max-w-sm bg-[#fff] border border-gray-200 rounded-lg shadow ">
                  <Link href="#">
                    <img
                      className="rounded-t-lg"
                      src={Make}
                      alt="blankimg"
                    />
                  </Link>
                  <div className="p-5">
                    <Link href="#">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-[#8044CC]">
                        ຮັບຜະລິດສີນຄ້າ (ສ້າງແບຣນ)
                      </h5>
                    </Link>
                    <p className="mb-3 font-normal text-sm text-[#8044CC] ">
                    ຮັບຜະລີດສີນຄ້າ ສຳລັບຜູ້ທີ່ຕ້ອງການມີແບຣນເປັນຂອງຕົວເອງ
                    </p>
                  </div>
                </div>
              </div>

              <div className="service flex align-center justify-center ">
                <div className="max-w-sm bg-[#fff] border border-gray-200 rounded-lg shadow ">
                  <Link href="#">
                    <img
                      className="rounded-t-lg"
                      src={Keep}
                      alt="blankimg"
                    />
                  </Link>
                  <div className="p-5">
                    <Link href="#">
                      <h5 className ="mb-2 text-xl font-bold tracking-tight text-[#8044CC]">
                        ໃຫ້ບໍລິການຝາກສາງສີນຄ້າ
                      </h5>
                    </Link>
                    <p className="mb-3 font-normal text-sm text-[#8044CC] ">
                    ບໍລິການຝາກສາງສີນຄ້າ : ຈີນ , ໄທ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
