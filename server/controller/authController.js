const User = require("../model/users");
const Parcel = require("../model/parcel");
const { sequelize } = require("../db");
const ParcelDetail = require("../model/saveData");
const SaveTime = require("../model/saveTime");
const SaveError = require("../model/saveerror");
const Rate = require("../model/rate");
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const puppeteer = require("puppeteer");
const path = require("path");

const fs = require("fs");

exports.signupUser = async (req, res) => {
  const { username, email, passwrd } = req.body;

  try {
    let user = await User.findOne({ where: { email } }); // เปลี่ยนจาก newUser เป็น User
    if (user) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // ตรวจสอบว่า username ถูกใช้แล้วหรือยัง
    user = await User.findOne({ where: { username } }); // เปลี่ยนจาก newUser เป็น User
    if (user) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(passwrd, 16);

    // สร้าง user ใหม่
    const new_user = await User.create({
      username,
      email,
      passwrd: hashedPassword,
      // role: 'user',
    });

    res.status(201).json({ message: "Signup Successful!", redirect: "/login" });
  } catch (err) {
    console.error("Error in signup:", err); // แสดงข้อผิดพลาดในคอนโซล
    res.status(500).json({ message: "Error 500 | Try again " });
  }
};

exports.idParcel = async (req, res) => {
  const { id_parcel, from } = req.body;

  try {
    let parcel = await Parcel.findOne({ where: { id_parcel } });
    if (parcel) {
      return res.status(400).json({ message: "ID Parcel already!" });
    }

    const originTime = moment
      .tz("Asia/Vientiane")
      .format("YYYY-MM-DD HH:mm:ss");

    await Parcel.create({
      id_parcel,
      from,
    });

    await SaveTime.create({
      id_parcel,
      from,
      origin: originTime,
    });

    res.status(201).json({ message: "Save Parcel Successful!", redirect: "" });
  } catch (err) {
    console.error("500 | ERROR Try again", err);
    res.status(500).json({ message: "Error 500 | Try again ", err });
  }
};

exports.getAllParcels = async (req, res) => {
  const { from } = req.body;
  try {
    const parcels = await Parcel.findAll({
      where: {
        from: from,
      },
    });
    res.status(200).json(parcels);
  } catch (error) {
    console.error("Error fetching parcels: ", error);
    res.status(500).json({ message: "500 ERROR fetch percels | Try again!" });
  }
};

exports.parcelsWait = async (req, res) => {
  try {
    const parcelswait = await ParcelDetail.findAll({
      where: { status: "spread" },
    });

    if (!parcelswait) {
      return res
        .status(404)
        .json({ message: "No parcels found with status 'spread'" });
    }
    res.status(200).json(parcelswait);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching Parcel: " + error.message });
  }
};

exports.countParcels = async (req, res) => {
  const { from } = req.body;

  if (!from) {
    return res.status(400).json({ message: "400 ERROR | 'from' is required!" });
  }
  try {
    const count = await Parcel.count({
      where: { from },
    });

    if (count === 0) {
      return res.status(404).json({ message: "No parcels found.", total: 0 });
    }
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ message: "500 ERROR Count parcels | Try again!" });
  }
};
exports.countParcelsWarehouse = async (req, res) => {
  try {
    const count = await ParcelDetail.count({
      where: {
        status: "accepted",
      },
    });
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ message: "500 ERROR Count parcels | Try again!" });
  }
};
exports.countParcelsBranch = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ message: "400 ERROR: Username is required!" });
  }
  try {
    const count = await ParcelDetail.count({
      where: {
        branch: username,
        status: "201",
      },
    });
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ message: "500 ERROR Count parcels | Try again!" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, passwrd } = req.body;

  try {
    let user = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: email }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or email!" });
    }

    const isMatch = await bcrypt.compare(passwrd, user.passwrd);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password!" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      message: "Login Successful!",
      username: user.username,
      role: user.role,
      branch: user.branch,
      // credit: user.credit,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error | Try again :<" });
  }
};

exports.rate = async (req, res) => {
  try {
    const rate = await Rate.findOne({
      attributes: ["china", "thai"],
    });
    if (!rate) {
      return res.status(404).json({ message: "Rate not found" });
    }
    res.status(200).json(rate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rate: " + error.message });
  }
};
exports.saveData = async (req, res) => {
  try {
    const { parcel, detail } = req.body;

    const existingParcel = await Parcel.findOne({
      where: { id_parcel: parcel.id_parcel, status: "accepted" },
      attributes: ["from"],
    });

    if (existingParcel) {
      const mainParcel = parcel;
      const fromValue = existingParcel.from;

      const dataExpress = {
        id_parcel: mainParcel.id_parcel,
        from: fromValue,
        status: "spread",
        type_tel: mainParcel.type_tel,
        tel: mainParcel.tel,
        type: mainParcel.type,
        note: mainParcel.note,
        branch: mainParcel.branch,
        typeParcel: detail.typeParcel,
        width: detail.width,
        length: detail.length,
        height: detail.height,
        weight: detail.weight,
        amount: detail.amount,
        price: detail.price,
      };

      try {
        const branch = dataExpress.branch;
        const price = dataExpress.price;

        const userBranch = await User.findOne({ branch });

        if (!userBranch) {
          return res.status(404).json({ message: "ไม่พบสาขานี้ในระบบ" });
        }

        // if (userBranch.credit < price) {
        //   return res.status(400).json({ message: "เครดิตไม่เพียงพอ" });
        // }

        const updatedUser = await User.update(
          { credit: sequelize.literal(`credit - ${price}`) },
          {
            where: { branch },
            returning: true,
          }
        );

        if (updatedUser) {
          console.log("Credit updated successfully", updatedUser);
        } else {
          console.log("Credit updated unsuccessfully");
        }
      } catch (error) {
        console.error("Error while updating credit", error);
      }

      const [updated] = await ParcelDetail.update(dataExpress, {
        where: { id_parcel: mainParcel.id_parcel },
      });
      if (updated) {
        await Parcel.destroy({
          where: { id_parcel: parcel.id_parcel },
        });

        function imageToBase64(imagePath) {
          const image = fs.readFileSync(imagePath);
          return image.toString("base64");
        }

        const base64Image = imageToBase64(path.join(__dirname, "logo.jpg"));

        const htmlContent = `<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Parcel Information</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap");

      body {
        font-family: "Kanit", sans-serif;
      }
    </style>
  </head>
  <body class="bg-gray-100 flex justify-center items-center">
    <div class="container mx-auto bg-white shadow-lg rounded-lg p-12 w-full max-w-[2400px] h-full flex flex-col items-center">
      <!-- โลโก้ -->
      <div class="w-full flex justify-center mb-8">
        <img src="data:image/jpeg;base64,${base64Image}" alt="Logo" class="w-1/3 max-w-[800px]" />
      </div>

      <!-- ข้อมูลผู้ส่งและผู้รับ -->
      <div class="flex justify-between w-full text-[5rem] font-medium text-gray-800 mb-6 mt-44">
        <p><strong>จาก:</strong> ${fromValue}</p>
        <p><strong>ถึง:</strong> ${mainParcel.branch}</p>
      </div>

      <!-- รหัสพัสดุ -->
      <p class="text-[7rem] font-semibold text-gray-900 my-20">
        ${mainParcel.id_parcel}
      </p>

      <!-- ตารางข้อมูลพัสดุ -->
      <table class="table-auto w-full text-6xl mt-[100px] border border-gray-500 rounded-lg overflow-hidden">
        <thead class="bg-gray-300 text-gray-800">
          <tr>  
            <th class="py-12 px-6 text-center">Width (cm)</th>
            <th class="py-12 px-6 text-center">Length (cm)</th>
            <th class="py-12 px-6 text-center">Height (cm)</th>
            <th class="py-12 px-6 text-center">Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="even:bg-gray-100 odd:bg-white">
            <td class="py-14 px-6 text-center">${detail.width}</td>
            <td class="py-14 px-6 text-center">${detail.length}</td>
            <td class="py-14 px-6 text-center">${detail.height}</td>
            <td class="py-14 px-6 text-center">${detail.weight}</td>
          </tr>
        </tbody>
      </table>

      <!-- จำนวนและราคารวม -->
      <div class="w-full mt-[10vh] text-right text-[5rem] font-medium text-gray-900">
        <p class="mb-4"><strong>จำนวน:</strong> ${detail.amount}</p>
        <p><strong>ราคารวม:</strong> ${detail.price} LAK</p>
      </div>
            <footer class="w-full text-6xl mt-[100px] border border-gray-500 rounded-lg p-14">
        <p class="font-semibold mb-14">หมายเหตุ :</p>
      ${mainParcel.note}
      </footer>
    </div>
  </body>
</html>`;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdfFileName = `${mainParcel.id_parcel}.pdf`;
        const pdfPath = path.join(
          __dirname,
          "../../client/public/pdf",
          pdfFileName
        );
        await page.pdf({
          path: pdfPath,
          // format: "A4",
          width: "70cm",
          height: "100cm",
          printBackground: true,
          margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
        });

        console.log(`PDF saved as ${pdfPath}`);

        await browser.close();

        res.status(200).json({
          message: "Parcel updated successfully!",
          data: dataExpress,
        });
      } else {
        res.status(404).json({ message: "ParcelDetail not found for update" });
      }
    } else {
      res.status(404).json({ message: "Parcel not found in OldParcelTable" });
    }
  } catch (error) {
    console.error("Error Save | Try again", error);
    res.status(500).json({ message: "Error saving parcel | Try again" });
  }
};

exports.checkIdInTables = async (req, res) => {
  const id = req.params.id;

  try {
    const foundInSavetime = await SaveTime.findOne({
      where: { id_parcel: id },
    });

    if (!foundInSavetime) {
      return res
        .status(404)
        .json({ message: "No data found for this id_parcel" });
    }

    const columns = [
      "origin",
      "export",
      "acceptedorigin",
      "spread",
      "branch",
      "success",
    ];

    let lastColumn = null;
    for (let i = columns.length - 1; i >= 0; i--) {
      if (foundInSavetime[columns[i]]) {
        lastColumn = columns[i];
        break;
      }
    }

    if (!lastColumn) {
      return res.status(404).json({ message: "No non-empty columns found" });
    }

    return res.json({ lastColumn });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Database query failed", message: err.message });
  }
};

exports.updateParcelStatus = async (req, res) => {
  const { parcelIds } = req.body;

  try {
    const result = await Parcel.update(
      { status: "export" },
      {
        where: {
          id_parcel: parcelIds,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({ message: "Parcel not found to update" });
    }

    const exportTime = moment
      .tz("Asia/Vientiane")
      .format("YYYY-MM-DD HH:mm:ss");

    const updateTimeExport = await SaveTime.update(
      {
        export: exportTime,
      },
      {
        where: {
          id_parcel: parcelIds,
        },
      }
    );

    if (updateTimeExport[0] === 0) {
      return res.status(404).json({ message: "SaveTime not found ID parcel" });
    }

    res.status(200).json({ message: "Parcel status updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while updating parcel status" });
  }
};

exports.listProduct = async (req, res) => {
  const { to } = req.body;
  try {
    const products = await Parcel.findAll({
      where: { status: "export", to: to },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
exports.listProductOrigin = async (req, res) => {
  const { from } = req.body;
  try {
    const products = await Parcel.findAll({
      where: { status: "export", from: from },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.percelInStored = async (req, res) => {
  try {
    const parcelWareHouse = await ParcelDetail.findAll({
      where: { status: "accepted" },
    });
    res.json(parcelWareHouse);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Parcel!" });
  }
};

exports.saveParcelStatus = async (req, res) => {
  const { id_parcel, from, status } = req.body;

  try {
    const newParcel = await ParcelDetail.create({
      id_parcel,
      from,
      status,
    });

    const acceptedorigin = moment
      .tz("Asia/Vientiane")
      .format("YYYY-MM-DD HH:mm:ss");

    const savetime = await SaveTime.update(
      {
        acceptorigin: acceptedorigin,
      },
      {
        where: {
          id_parcel: id_parcel,
        },
      }
    );

    if (savetime[0] === 0) {
      return res.status(404).json({ message: "SaveTime not found ID parcel" });
    }

    res.status(200).json({
      message: "Parcel information saved successfully",
      data: newParcel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving parcel information" });
  }
};

exports.updateBranch = async (req, res) => {
  const { id_parcel, status } = req.body;

  try {
    const reUpdate = await ParcelDetail.update(
      { status },
      {
        where: {
          id_parcel,
        },
      }
    );

    const spreadTime = moment
      .tz("Asia/Vientiane")
      .format("YYYY-MM-DD HH:mm:ss");

    const spread = await SaveTime.update(
      {
        spread: spreadTime,
      },
      {
        where: {
          id_parcel: id_parcel,
        },
      }
    );

    if (spread[0] === 0) {
      return res.status(404).json({ message: "SaveTime not found ID parcel" });
    }

    if (reUpdate[0] === 0) {
      return res.status(404).json({ message: "Parcel don't update!" });
    }
    res.status(200).json({ message: "Parcel status updated successfully" });
  } catch (error) {
    console.error("Error updating parcel status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating parcel status" });
  }
};

exports.updateReceive = async (req, res) => {
  const { id_parcel } = req.body;

  try {
    const [updateReceive] = await ParcelDetail.update(
      { status: "202" },
      {
        where: {
          id_parcel: id_parcel,
        },
      }
    );

    const branchTime = moment
      .tz("Asia/Vientiane")
      .format("YYYY-MM-DD HH:mm:ss");

    const branch = await SaveTime.update(
      {
        branch: branchTime,
      },
      {
        where: {
          id_parcel: id_parcel,
        },
      }
    );

    if (branch[0] === 0) {
      return res.status(404).json({ message: "SaveTime not found ID parcel" });
    }

    if (updateReceive === 0) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    res.status(200).json(updateReceive);
  } catch (error) {
    console.error("Error updating parcel status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating parcel status" });
  }
};

exports.updateSuccess = async (req, res) => {
  const { id_parcel } = req.body;

  const savetime = moment.tz("Asia/Vientiane").format("YYYY-MM-DD HH:mm:ss");

  try {
    const updateSuccess = await ParcelDetail.update(
      { status: "success", time: savetime },
      {
        where: {
          id_parcel: id_parcel,
        },
      }
    );

    const successTime = moment
      .tz("Asia/Vientiane")
      .format("YYYY-MM-DD HH:mm:ss");

    const successExport = await SaveTime.update(
      {
        success: successTime,
      },
      {
        where: {
          id_parcel: id_parcel,
        },
      }
    );

    if (successExport[0] === 0) {
      return res.status(404).json({ message: "SaveTime not found ID parcel" });
    }

    res.status(200).json({ message: "Success!", time: savetime });
  } catch (error) {
    res.status(500).json({ message: "Error unsuccessful" });
  }
};

exports.updateAccept = async (req, res) => {
  const { id_parcel, status } = req.body;

  try {
    const result = await Parcel.update(
      { status },
      {
        where: {
          id_parcel,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({ message: "Parcel not found to update" });
    }
    res.status(200).json({ message: "Parcel status updated successfully" });
  } catch (error) {
    console.error("Error updating parcel status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating parcel status" });
  }
};

exports.parcelBranch = async (req, res) => {
  const { username } = req.body;

  try {
    const parcelsSave = await ParcelDetail.findAll({
      where: { branch: username, status: "202" },
    });

    if (!parcelsSave || parcelsSave.length === 0) {
      return res
        .status(404)
        .json({ message: "No parcels found for this branch" });
    }

    res.status(200).json(parcelsSave);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching ParcelSave: " + error.message });
  }
};

exports.searchWareHouse = async (req, res) => {
  const { id_parcel } = req.body;

  try {
    const parcel = await Parcel.findOne({
      where: { id_parcel, status: "export" },
    });

    if (parcel) {
      res.status(200).json(parcel);
    } else {
      res.status(404).json({ message: "Parcel not found" });
    }
  } catch (error) {
    console.error("Error fetching parcel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchParcel = async (req, res) => {
  const { id_parcel, username } = req.body;

  try {
    const parcel = await ParcelDetail.findOne({
      where: {
        id_parcel,
        branch: username,
        status: "201",
        type: "delivery",
      },
    });

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    res.status(200).json(parcel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error parcel" });
  }
};

exports.searchSuccessParcel = async (req, res) => {
  const { id_parcel, username } = req.body;

  try {
    const parcelId = await ParcelDetail.findOne({
      where: {
        id_parcel,
        branch: username,
        status: "202",
        type: "delivery",
      },
    });
    if (!parcelId) {
      return res.status(404).json({ message: "Parcel Not Found!" });
    }

    res.status(200).json(parcelId);
  } catch (error) {
    console.error("Error Can't Find Parcel | Try Again", error);
    res.status(500).json({ message: "Error can't Found Data!" });
  }
};

exports.saveerror = async (req, res) => {
  const { id_parcel, username } = req.body;

  const savetime = moment.tz("Asia/Vientiane").format("YYYY-MM-DD HH:mm:ss");
  try {
    const saveerror = await SaveError.create({
      id_parcel,
      branch: username,
      timesave: savetime,
    });
    res
      .status(200)
      .json({ message: "Saved Error successfully", parcel: saveerror });
  } catch (error) {
    console.error("Error saving failed parcel:", error);
    res
      .status(500)
      .json({ message: "Server error while saving failed parcel" });
  }
};

exports.credit = async (req, res) => {
  const { username } = req.body;

  try {
    const credit = await User.findOne({
      where: {
        username: username,
      },
    });
    res.status(200).json(credit);
  } catch (error) {
    console.error("Error", error);
    res.status(500);
  }
};
exports.checkCredit = async (req, res) => {
  const { branch } = req.body;

  try {
    const user = await User.findOne({ where: { branch: branch } });

    if (!user) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ credit: user.credit });
  } catch (error) {
    res.status(500).json({ message: "Error checking credit", error });
  }
};
exports.checkStatus = async (req, res) => {
  const { id_parcel } = req.body;

  try {
    const status = await SaveTime.findOne({
      where: { id_parcel },
    });

    if (!status) {
      return res.status(404).json({
        message: "No status found for this parcel ID.",
      });
    }

    const requireBranch =
      !!status.spread || !!status.branch || !!status.success;

    let branchData = null;
    if (requireBranch) {
      const branch = await ParcelDetail.findOne({
        where: { id_parcel },
      });

      if (!branch) {
        return res.status(404).json({
          message: "No branch found for this parcel ID.",
        });
      }
      branchData = branch.branch;
    }

    const result = {};
    if (status.origin) result.origin = status.origin;
    if (status.export) result.export = status.export;
    if (status.acceptorigin) result.acceptorigin = status.acceptorigin;
    if (status.spread) result.spread = status.spread;
    if (status.branch) result.branch = status.branch;
    if (status.success) result.success = status.success;

    res.status(200).json({
      id_parcel: status.id_parcel,
      status: result,
      branch: branchData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error checking status", error: error.message });
  }
};
