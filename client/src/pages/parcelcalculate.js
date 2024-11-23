import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Parcel = ({ onDetailsChange }) => {
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
      if (onDetailsChange) {
        onDetailsChange(updatedData);
      }
      return updatedData;
    });
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    setDetailsData((prevData) => ({
      ...prevData,
      price: parseFloat(price), // แปลงค่าให้เป็นตัวเลข
    }));
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get("http://maxirix.thddns.net:7377/api/rate");
        setRateChina(response.data.china);
        setRateThai(response.data.thai);
      } catch (error) {
        console.error("Error fetching rateChina", error);
      }
    };
    fetchRate();
  }, []);

  const calculatePrice = useCallback(() => {
    let price = 0;
    let cbm = 0;
    let size = detailsData.width * detailsData.length * detailsData.height;
    let ton = detailsData.weight / 1000;

    switch (detailsData.typeParcel) {
      case "Genaral":
        price = detailsData.weight * 15000;
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

    setDetailsData((prevData) => ({
      ...prevData,
      price: price * detailsData.amount,
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
    rateThai,
  ]);

  return (
    <div>
      <input
        type="text"
        name="typeParcel"
        value={detailsData.typeParcel}
        onChange={handleInputChange}
        placeholder="ประเภทพัสดุ"
      />
      <input
        type="number"
        name="weight"
        value={detailsData.weight}
        onChange={handleInputChange}
        placeholder="น้ำหนัก (kg)"
      />
      <input
        type="number"
        name="width"
        value={detailsData.width}
        onChange={handleInputChange}
        placeholder="ความกว้าง (cm)"
      />
      <input
        type="number"
        name="length"
        value={detailsData.length}
        onChange={handleInputChange}
        placeholder="ความยาว (cm)"
      />
      <input
        type="number"
        name="height"
        value={detailsData.height}
        onChange={handleInputChange}
        placeholder="ความสูง (cm)"
      />
      <input
        type="number"
        name="amount"
        value={detailsData.amount}
        onChange={handleInputChange}
        placeholder="จำนวนพัสดุ"
      />
      <input
        type="text"
        name="price"
        value={detailsData.price}
        onChange={handlePriceChange}
        placeholder="ราคาคำนวณ (บาท)"
      />
    </div>
  );
};

export default Parcel;