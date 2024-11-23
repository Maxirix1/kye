import React, { useState } from "react";
import "../style/font-style.css";
import useAuth from "../hooks/useAuth";

const Origin = ({ onParcelChange }) => {
  const { branch } = useAuth();
  const [parcelData, setParcelData] = useState({
    id_parcel: "",
    type_tel: "",
    tel: "",
    type: "delivery",
    note: "",
    branch: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prevData) => ({ ...prevData, [name]: value }));
    onParcelChange({ ...parcelData, [name]: value });
  };

  const handleRadioChange = (value) => {
    setParcelData((prevData) => ({ ...prevData, type: value }));
    onParcelChange({ ...parcelData, type: value });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "20px",
          //   backgroundColor: "#f9f9f9",
          //   borderRadius: "20px 20px 0 0",mongodb://localhost:27017/
        }}
      >
        {/* Origin Section */}
        <div
          id="admin-lao"
          style={{
            flex: 1,
            minWidth: "300px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div style={gradientHeaderStyle("#0bdb96", "#00c6e0")}>
            <h2 style={{ margin: 0, color: "white" }} className="font-semibold">
              ต้นทาง
            </h2>
          </div>
          <div style={bodyStyle}>
            <div style={{ marginBottom: "10px" }}>
              <label style={labelStyle}>สาขา :</label>
              <p>{branch}</p>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={labelStyle}>ID Parcels :</label>
              <input
                type="text"
                name="id_parcel"
                value={parcelData.id_parcel}
                placeholder="Enter ID Parcel"
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>เบอร์ผู้ส่ง :</label>
                <div style={{ display: "flex" }}>
                  <select
                    name="type_tel"
                    onChange={handleInputChange}
                    value={parcelData.type_tel}
                    style={{
                      ...inputStyle,
                      width: "80px",
                      borderRadius: "5px 0 0 5px",
                    }}
                  >
                    <option value="" disabled>
                      +
                    </option>
                    <option value="+66">+66</option>
                    <option value="+856">+856</option>
                  </select>
                  <input
                    type="tel"
                    name="tel"
                    value={parcelData.tel}
                    placeholder="XX-XXX-XXXX"
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      borderRadius: "0 5px 5px 0",
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  name="type"
                  value="delivery"
                  checked={parcelData.type === "delivery"}
                  onChange={() => handleRadioChange("delivery")}
                  style={{ marginRight: "5px" }}
                />{" "}
                จัดส่ง
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  name="type"
                  value="warehouse"
                  checked={parcelData.type === "warehouse"}
                  onChange={() => handleRadioChange("warehouse")}
                  style={{ marginRight: "5px" }}
                />{" "}
                รับที่โกดัง
              </label>
            </div>
            <div>
              <label style={labelStyle}>หมายเหตุ :</label>
              <textarea
                name="note"
                value={parcelData.note}
                onChange={handleInputChange}
                placeholder="เพิ่มหมายเหตุ"
                style={{ ...inputStyle, height: "80px" }}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Destination Section */}
        <div
          id="admin-lao"
          style={{
            flex: 1,
            minWidth: "300px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <div style={gradientHeaderStyle("#0b5edb", "#0bd1db")}>
            <h2 style={{ margin: 0, color: "white" }} className="font-semibold">
              ปลายทาง
            </h2>
          </div>
          <div style={bodyStyle}>
            <div style={{ marginBottom: "10px" }}>
              <label style={labelStyle}>สาขา :</label>
              <select
                style={inputStyle}
                onChange={handleInputChange}
                name="branch"
                required
                value={parcelData.branch}
              >
                <option value="" disabled>
                  เลือกสาขา
                </option>
                <option value="kye02">KYE02 (ສາຂາ ເພຍວັດ) ນະຄອນຫຼວງ</option>
                <option value="kye50">KYE50 (ສາຂາ ສ້າງເຫວີຍ) ຫຼວງພະບາງ</option>
              </select>
            </div>
          </div>
        </div>
      </div>
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
  //   backgroundColor: "#fff",
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

export default Origin;
