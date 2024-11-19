import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

import Parcel from "../components/origin";
// import Details from "../components/parcel";
import Spread from "../components/spread";
import Branch from "../components/successbranch";
import ParcelWait from "../components/parcelwaitsave";
// import { Sidebar } from "../components/sidebar";
import "../style/font-style.css";
import axios from "axios";

const DistributionDashboard = ({ onDetailsChange }) => {
  const navigate = useNavigate();
  const { username, role } = useAuth();

  const [activePage, setActivePage] = useState("distribution");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  // const storedRole = localStorage.getItem("role");
  const storedBranch = localStorage.getItem("branch");
  const storedRole = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    } else if (storedRole !== "admin" && storedRole !== "branch") {
      navigate("/forbidden");
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sidebarLinkStyle = (page) => ({
    display: "block",
    color: "white",
    textDecoration: "none",
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "5px",
    paddingRight: "10px",
    backgroundColor: activePage === page ? "#34495e" : "transparent",
    transition: "background-color 0.3s",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [parcelData, setParcelData] = useState({});
  // const [detailsData, setDetailsData] = useState({});

  const handleParcelChange = (data) => {
    setParcelData(data);
  };

  // const handleDetailChange = (data) => {
  //   setDetailsData(data);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let timerInterval;
    // Swal.fire({
    //   title: "Loading...",
    //   timer: 5000,
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //     const timer = Swal.getPopup().querySelector("b");
    //     timerInterval = setInterval(() => {
    //       timer.textContent = `${Swal.getTimerLeft()}`;
    //     }, 500);
    //   },
    //   willClose: () => {
    //     clearInterval(timerInterval);
    //   },
    // }).then((result) => {
    //   if (result.dismiss === Swal.DismissReason.timer) {
    //     console.log("I was closed by the timer");
    //   }
    // });

    const checkEmptyFields = Object.values(detailsData).some(
      (value) => value === "" || value === null || value === undefined
    );
    const checkEmptyParcel = Object.values(parcelData).some(
      (value) => value === "" || value === null || value === undefined
    );

    if (checkEmptyFields) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน",
        icon: "info",
      });
      return;
    }
    if (checkEmptyParcel) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน",
        icon: "info",
      });
      return;
    }
    console.log("Updated detailsData:", detailsData.price);

    try {
      const checkCredit = await axios.post(
        "http://localhost:5000/api/checkcredit",
        {
          branch: parcelData.branch,
        }
      );

      const userCredit = checkCredit.data.credit;

      if (userCredit < detailsData.price) {
        Swal.fire({
          title: "ไม่เพียงพอ",
          text: `ยอดเครดิตในสาขา ${parcelData.branch} ไม่พอ กรุณาตรวจสอบอีกครั้ง`,
          icon: "error",
        });
        return;
      }

      const fullData = {
        parcel: parcelData,
        detail: detailsData,
        price: detailsData.price,
      };
      // console.log("fullData", fullData.price);

      const response = await axios.post(
        "http://localhost:5000/api/saveData",
        fullData
      );
      console.log("Data Save Successfully:", response.data);
      console.log("fullData", fullData);

      window.location.reload();
    } catch (error) {
      console.log("Error Save data | Try again", error);
      Swal.fire({
        title: "ไม่พบพัสดุ",
        text: "โปรดรับพัสดุเข้าโกดัง | หรือติดต่อเจ้าหน้าที่",
        icon: "error",
      });
    }
  };

  // -----------------Detail Data---------------------------
  const [rateChina, setRateChina] = useState(0);
  const [rateThai, setRateThai] = useState(0);
  const [detailsData, setDetailsData] = useState({
    typeParcel: "",
    width: "",
    height: "",
    length: "",
    weight: "",
    amount: "",
    price: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetailsData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log(updatedData);
      if (onDetailsChange) {
        onDetailsChange(updatedData);
      }
      return updatedData;
    });
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rate");
        setRateChina(response.data.china);
        setRateThai(response.data.thai);
      } catch (error) {
        console.error("Error fetching rateChina", error);
      }
    };
    fetchRate();
  }, []);

  const handlePriceChange = (e) => {
    const price = e.target.value;
    setDetailsData((prevData) => ({
      ...prevData,
      price,
    }));
  };

  // console.log("Calculating price with data:", detailsData);

  const calculatePrice = useCallback(() => {
    let price = 0;
    let cbm = 0;
    const width = parseFloat(detailsData.width) || 0;
    const length = parseFloat(detailsData.length) || 0;
    const height = parseFloat(detailsData.height) || 0;
    const weight = parseFloat(detailsData.weight) || 0;
    const amount = parseFloat(detailsData.amount) || 1;

    const size = width * length * height;
    const ton = weight / 1000;

    switch (detailsData.typeParcel) {
      case "O":
      case "A":
      case "2A":
      case "B":
      case "C":
      case "D":
      case "E":
      case "F":
      case "G":
      case "H":
      case "I":
        // ใช้ตารางราคาเดียวกันสำหรับทุกประเภท
        if (size <= 25 && weight <= 0.5) price = 25;
        else if (size <= 35 && weight <= 1) price = 35 * rateThai;
        else if (size <= 45 && weight <= 3) price = 45 * rateThai;
        else if (size <= 60 && weight <= 5) price = 60 * rateThai;
        else if (size <= 70 && weight <= 7) price = 80 * rateThai;
        else if (size <= 80 && weight <= 9) price = 95 * rateThai;
        else if (size <= 90 && weight <= 12) price = 120 * rateThai;
        else if (size <= 105 && weight <= 15) price = 150 * rateThai;
        else if (size <= 120 && weight <= 18) price = 200 * rateThai;
        else if (size <= 130 && weight <= 22) price = 250 * rateThai;
        else if (size <= 145 && weight <= 24) price = 300 * rateThai;
        break;
      case "Genaral":
        price = weight * 15000;
        break;
      case "Electrical":
        cbm = size / 1000000;
        price = cbm * 700 * rateChina;
        break;
      case "Big-But-Light":
        cbm = size / 1000000;
        price = cbm * 650 * rateChina;
        break;
      case "Lots-of-Weight":
        price = ton * 1400 * rateChina;
        break;
      default:
        price = 0;
    }

    price = Math.round(price);

    // console.log("Price:", price);

    // อัปเดต state ด้วยราคาใหม่ที่คำนวณแล้ว
    setDetailsData((prevData) => ({
      ...prevData,
      // price: prevData.price || price * amount,
      price: price * amount,
    }));
  }, [detailsData, rateChina]);

  useEffect(() => {
    calculatePrice();
  }, [
    detailsData.typeParcel,
    detailsData.weight,
    detailsData.width,
    detailsData.length,
    detailsData.height,
    detailsData.amount,
    rateChina,
    // rateThai,
    // calculatePrice
  ]);

  useEffect(() => {
    console.log(detailsData);
  }, [detailsData]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* <Sidebar/> */}

      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? (sidebarOpen ? "100%" : "0") : "250px",
          height: "100vh",
          backgroundColor: "#2a2d39",
          color: "white",
          padding: sidebarOpen ? "20px" : "0",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s",
          overflow: "hidden",
          position: isMobile ? "fixed" : "relative",
          zIndex: 1000,
          left: isMobile ? (sidebarOpen ? "0" : "-100%") : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "24px", margin: 0 }}>การจัดการ</h2>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
        <nav style={{ flex: 1 }}>
          <Link
            to="/homeAdmin/main"
            style={sidebarLinkStyle("inventorystatistics")}
            onClick={() => {
              setActivePage("inventorystatistics");
              isMobile && toggleSidebar();
            }}
          >
            หน้าแรก
          </Link>
          <Link
            to="/homeAdmin/list"
            style={sidebarLinkStyle("inventory")}
            onClick={() => {
              setActivePage("inventory");
              isMobile && toggleSidebar();
            }}
          >
            รายการพัสดุ
          </Link>
          <Link
            to="/homeAdmin/distribution"
            style={sidebarLinkStyle("distribution")}
            onClick={() => {
              setActivePage("distribution");
              isMobile && toggleSidebar();
            }}
          >
            กระจายพัสดุ
          </Link>
          <Link
            to="/homeAdmin/branch"
            style={sidebarLinkStyle("branches")}
            onClick={() => {
              setActivePage("branches");
              isMobile && toggleSidebar();
            }}
          >
            ข้อมูลสาขา
          </Link>
        </nav>
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")}
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                ☰
              </button>
            )}
            <h1 style={{ fontSize: "24px", margin: "0" }}>การกระจายพัสดุ</h1>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "20px" }}>
                {" "}
                {new Date().toLocaleDateString("th-TH")}
              </span>
              <span style={{ marginRight: "20px" }}>
                {new Date().toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>
                {username} | {role}
              </span>
              <Link
                to="/"
                style={{
                  marginLeft: "20px",
                  padding: "8px 16px",
                  backgroundColor: "#4a69bd",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                หน้าเเรก
              </Link>
            </div>
          )}
        </header>

        <div style={{ overflowX: "auto" }}>
          {storedBranch === "LAO Warehouse" ? (
            <>
              <Parcel onParcelChange={handleParcelChange} />
              {/* <Details onDetailsChange={handleDetailChange} /> */}

              <div>
                <div
                  id="admin-lao"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={gradientHeaderStyle("#0031e0", "#0ad5f5")}>
                    <h2 style={{ margin: 0, color: "white" }}>ข้อมูลพัสดุ</h2>
                  </div>
                  <div style={bodyStyle}>
                    <div
                      style={{
                        display: "grid",
                        gap: "15px",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>ประเภท :</label>
                        <select
                          style={inputStyle}
                          onChange={handleInputChange}
                          value={detailsData.typeParcel}
                          name="typeParcel"
                        >
                          <option value="" disabled>
                            เลือกประเภท
                          </option>
                          <option value="O"> O </option>
                          <option value="A"> A </option>
                          <option value="2A"> 2A</option>
                          <option value="B"> B</option>
                          <option value="C"> C</option>
                          <option value="D"> D</option>
                          <option value="E"> E</option>
                          <option value="F"> F</option>
                          <option value="G"> G</option>
                          <option value="H"> H</option>
                          <option value="I"> I</option>
                          <option value="Genaral"> เครื่องใช้ทั่วไป</option>
                          <option value="Electrical"> เครื่องใช้ไฟฟ้า</option>
                          <option value="Big-But-Light">
                            {" "}
                            เครื่องใหญ่น้ำหนักเบา
                          </option>
                          <option value="Lots-of-Weight"> น้ำหนักเยอะ</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>ขนาด(cm) :</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <input
                            name="width"
                            type="number"
                            onChange={handleInputChange}
                            value={detailsData.width}
                            placeholder="กว้าง"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <input
                            name="length"
                            type="number"
                            onChange={handleInputChange}
                            value={detailsData.length}
                            placeholder="ยาว"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <input
                            name="height"
                            type="number"
                            onChange={handleInputChange}
                            value={detailsData.height}
                            placeholder="สูง"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>น้ำหนัก(kg) :</label>
                        <input
                          name="weight"
                          type="number"
                          onChange={handleInputChange}
                          value={detailsData.weight}
                          placeholder="น้ำหนัก"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>จำนวน :</label>
                        <input
                          name="amount"
                          type="number"
                          onChange={handleInputChange}
                          value={detailsData.amount}
                          placeholder="จำนวน(ชิ้น)"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>ราคา :</label>
                        <input
                          name="price"
                          type="number"
                          onChange={handlePriceChange}
                          // onBlur={calculatePrice}
                          value={detailsData.price}
                          placeholder="ราคา"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex align-center justify-end mt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="text-lg font-medium px-14 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Save
                </button>
              </div>

              <hr className="my-6" />
              <ParcelWait />
            </>
          ) : null}

          {storedRole === "branch" ? (
            <>
              <Branch />
            </>
          ) : null}

          {/* Item Details Section */}
          {storedBranch !== "LAO Warehouse" && storedRole !== "branch" ? (
            <>
              <Spread />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};
const gradientHeaderStyle = (color1, color2) => ({
  background: `linear-gradient(to right, ${color1}, ${color2})`,
  padding: "15px 20px",
  borderRadius: "20px 20px 0 0",
  color: "white",
});

const bodyStyle = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

export default DistributionDashboard;
