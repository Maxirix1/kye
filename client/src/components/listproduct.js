import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const Listproduct = () => {
  const [products, setProducts] = useState();
  const [productsOrigin, setProductsOrigin] = useState();

  const storedBranch = localStorage.getItem("branch");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/listproduct",
          { to: storedBranch }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchProducts();
  }, [storedBranch]);

  useEffect(() => {
    const fetchOrigin = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/listOrigin",
          { from: storedBranch }
        );
        setProductsOrigin(response.data);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchOrigin();
  }, [storedBranch]);

  const handleAccept = async (product) => {
    const dataToSave = {
      id_parcel: product.id_parcel,
      from: product.from,
      status: "accepted",
    };

    const updateParcel = {
      id_parcel: product.id_parcel,
      status: "accepted",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/parcel/update",
        updateParcel
      );

      if (response.status === 200) {
        // alert("Parcel status updated successfully");
        window.location.reload();
        setProducts((prevProducts) =>
          prevProducts.filter((item) => item.id_parcel !== product.id_parcel)
        );
      }
    } catch (error) {
      console.error("Error updating parcel status:", error);
      Swal.fire({
        title: "Error Update",
        text: "Contact Developer!",
        icon: "error",
      });
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/parcel/save",
        dataToSave
      );

      if (response.status === 200) {
        // alert("Parcel status saved");

        setProducts((prevProducts) =>
          prevProducts.map((item) =>
            item.id_parcel === product.id_parcel
              ? { ...item, status: "accepted" }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error saving parcel: ", error);
    }
  };
  // const { username } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [findParcel, setFindParcel] = useState("");
  const [parcelResponse, setParcelResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSeachPaste = async (e) => {
    const pasted = e.clipboardData.getData("Text");
    setFindParcel(pasted);
    setParcels([]);

    if (pasted.length >= 5) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/parcel/searchwarehouse",
          {
            id_parcel: pasted,
          }
        );
        setParcelResponse(response.data);
        setError("");
      } catch (error) {
        console.error("Error to Search | Try again", error);
        setParcelResponse(null);
        setError("This ID Parcel was not found.");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        <div className="bg-[#732dcf] px-6 py-4 pb-6 rounded-lg w-full mb-10">
          <h1 style={{ fontSize: "16px", margin: "0", color: "#fff" }}>
            ค้นหารายการพัสดุ
          </h1>

          <div className="flex mt-2 gap-2">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const parcel = products.find((item) => item.id_parcel === findParcel);
                  if (parcel) {
                    handleAccept(parcel);
                  } else {
                    Swal.fire({
                      title: "Parcel Not Found",
                      text: "Please check the Parcel ID again.",
                      icon: "error",
                    });
                  }
                }
              }}
              // value={findParcel}
              onChange={(e) => setFindParcel(e.target.value)}
              onPaste={handleSeachPaste}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Number Parcel."
            />
            <button
              className="bg-white rounded-lg px-4 text-[#732dcf] font-semibold text-md duration-200 hover:px-6 hover:duration-200"
              type="button"
              onClick={() => {
                const parcel = products.find(
                  (item) => item.id_parcel === findParcel
                );
                if (parcel) {
                  handleAccept(parcel); // ส่งเฉพาะ parcel ที่ตรงกับ ID
                } else {
                  Swal.fire({
                    title: "Parcel Not Found",
                    text: "Please check the Parcel ID again.",
                    icon: "error",
                  });
                }
              }}
            >
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
                />
              </svg>
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 font-semibold">{error}</div>}

        <div className="w-full mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-end text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    FROM
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {parcelResponse ? (
                  <tr className="bg-green-200">
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {parcelResponse.id_parcel}
                      </p>
                    </td>
                    <td className="text-center px-5 py-5 border-b border-gray-200 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        {parcelResponse.status}
                      </span>
                    </td>
                    <td className="text-end px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {parcelResponse.from}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-end">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {parcelResponse.time}
                      </p>
                    </td>
                  </tr>
                ) : (
                  (storedBranch === "LAO Warehouse"
                    ? products
                    : productsOrigin
                  )?.map((product) => (
                    <tr
                      key={product.id_parcel}
                      className="hover:bg-gray-100 bg-white"
                    >
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {product.id_parcel}
                        </p>
                      </td>
                      <td className="text-center px-5 py-5 border-b border-gray-200 text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                          ></span>
                          {product.status}
                        </span>
                      </td>
                      <td className="text-end px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {product.from}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-end">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {product.time}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listproduct;
