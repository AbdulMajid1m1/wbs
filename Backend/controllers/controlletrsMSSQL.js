
import { pool1, pool2 } from "../config/connection.js"; // import pool1 and pool2 from connection.js file
import sql from "mssql";
pool1.connect().catch((err) => console.log("Error connecting to config1:", err));
pool2.connect().catch((err) => console.log("Error connecting to config2:", err));
import bcrypt from "bcrypt";
const saltRounds = 10;

import nodemailer from 'nodemailer';
import fs from 'fs';
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import { client } from "../cacheManager.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
let jwtSecret = process.env.JWT_SECRET;
let cookieExp = process.env.COOKIE_EXPIRATION
let cookieAge = cookieExp * 24 * 60 * 60 * 1000;
let jwtExpiration = process.env.JWT_EXPIRATION;
import upload from "../config/multerConfig.js";
dotenv.config();

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

function ssccCheckDigit(barcode) {
  // Strip off leading 0's if 20-digit or 19-digit format was provided
  const len = barcode.length;
  if ((len === 20 || len === 19) && barcode.startsWith("00")) {
    barcode = barcode.substring(2);
  }

  // Return false if invalid length
  const newLen = barcode.length;
  if (newLen !== 18 && newLen !== 17) {
    return false;
  }

  // For explanation see: http://www.gs1.org/how-calculate-check-digit-manually
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const multiplier = i % 2 === 0 ? 3 : 1;
    sum += parseInt(barcode[i]) * multiplier;
  }

  const checkDigit = Math.ceil(sum / 10) * 10 - sum;

  if (newLen === 17) {
    return barcode + checkDigit;
  }
  if (newLen === 18) {
    return checkDigit === parseInt(barcode[17]);
  }
}

const WBSDB = {
  async getShipmentDataFromtShipmentReceiving(req, res, next) {
    try {
      if (!req.query.SHIPMENTID) {
        return res.status(400).send({ message: "SHIPMENTID is required." });
      }

      let query;
      if (req.query.CONTAINERID) {
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving
          WHERE SHIPMENTID = @SHIPMENTID AND CONTAINERID = @CONTAINERID
        `;
      } else {
        console.log("req.query.SHIPMENTID", req.query.SHIPMENTID);
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving
          WHERE SHIPMENTID = @SHIPMENTID
        `;
      }

      let request = pool1.request().input("SHIPMENTID", sql.VarChar, req.query.SHIPMENTID);

      if (req.query.CONTAINERID) {
        request = request.input("CONTAINERID", sql.VarChar, req.query.CONTAINERID);
      }

      const data = await request.query(query);

      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }

      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getShipmentDataFromtShipmentReceivingCL(req, res, next) {
    try {
      if (!req.query.SHIPMENTID) {
        return res.status(400).send({ message: "SHIPMENTID is required." });
      }

      let query;

      if (req.query.CONTAINERID) {
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving_CL
          WHERE SHIPMENTID = @SHIPMENTID AND CONTAINERID = @CONTAINERID
        `;
      } else {
        console.log("req.query.SHIPMENTID", req.query.SHIPMENTID);
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving_CL
          WHERE SHIPMENTID = @SHIPMENTID
        `;
      }

      let request = pool2.request().input("SHIPMENTID", sql.VarChar, req.query.SHIPMENTID);

      if (req.query.CONTAINERID) {
        request = request.input("CONTAINERID", sql.VarChar, req.query.CONTAINERID);
      }

      const data = await request.query(query);

      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }

      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  async getAllShipmentDataFromtShipmentReceiving(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Receiving
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },
  async getTblShipmentReceivingQty(req, res, next) {
    try {
      let query = `
      SELECT TOP 1 QTY FROM dbo.tbl_Shipment_Receiving
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment quantity not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },





  async getAllShipmentDataFromtShipmentReceivingCL(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Receiving_CL
      `;
      let request = pool2.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },
  async getAllShipmentDataFromtShipmentReceived(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Received 
      WHERE PALLETCODE IS NOT NULL OR PALLETCODE <> ''
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },

  async getAllTblItems(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.InventTableWMS
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Item available." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },

  async getAllExpectedShipments(req, res, next) {
    try {
      let query = `
    SELECT * FROM dbo.expectedShipments
    
    `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  // --- expectedTransferOrder controller --- //
  async getAllExpectedTransferOrder(req, res, next) {
    try {
      let query = `
    SELECT * FROM dbo.expectedTransferOrder
    
    `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getExpectedTransferOrderByTransferId(req, res, next) {
    try {
      // Extract TRANSFERID from request parameters
      const { TRANSFERID } = req.query;
      if (!TRANSFERID) {
        return res.status(400).send({ message: "TRANSFERID is required." });
      }
      let query = `
        SELECT * 
          FROM dbo.expectedTransferOrder
          WHERE TRANSFERID = @TRANSFERID
      `;

      // Create a new request
      let request = pool1.request();

      // Add parameters to the SQL request
      request.input('TRANSFERID', sql.NVarChar, TRANSFERID);

      // Execute the query
      const data = await request.query(query);

      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found for provided TRANSFERID." });
      }

      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  }
  ,



  // --- expectedTransferOrder controllers END --- //
  async getAllPickingList(req, res, next) {
    try {
      let query = `
    SELECT * FROM dbo.pickinglist
    
    `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },




  // -----  all controller for tbl_Items_CL starts here ------------------------------


  async getAllTblItemsCL(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Items_CL
      `;
      let request = pool2.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },

  // POST request to insert data
  async insertTblItemsCLData(req, res, next) {
    try {
      const {
        ITEMID,
        ITEMNAME,
        ITEMGROUPID,
      } = req.query;

      const query = `
      INSERT INTO dbo.tbl_Items_CL
        (ITEMID, ITEMNAME, ITEMGROUPID)
      VALUES
        (@ITEMID, @ITEMNAME, @ITEMGROUPID)
    `;

      let request = pool2.request();
      request.input('ITEMID', sql.NVarChar(255), ITEMID);
      request.input('ITEMNAME', sql.NVarChar(255), ITEMNAME);
      request.input('ITEMGROUPID', sql.NVarChar(255), ITEMGROUPID);

      await request.query(query);
      res.status(201).send({ message: 'Item data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // DELETE request to delete data
  // DELETE request to delete data
  async deleteTblItemsCLData(req, res, next) {
    try {
      const {
        ITEMID,
      } = req.query;

      if (!ITEMID) {
        return res.status(400).send({ message: 'ITEMID is required.' });
      }

      const query = `
      DELETE FROM dbo.tbl_Items_CL
      WHERE ITEMID = @ITEMID
    `;

      let request = pool2.request();
      request.input('ITEMID', sql.NVarChar(255), ITEMID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Item record not found.' });
      }

      res.status(200).send({ message: 'Item data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // PUT request to update data
  async updateTblItemsCLData(req, res, next) {
    try {
      const {
        ITEMID,
        ITEMNAME,
        ITEMGROUPID,
      } = req.query;

      if (!ITEMID) {
        return res.status(400).send({ message: 'ITEMID is required.' });
      }

      let query = `
      UPDATE dbo.tbl_Items_CL
      SET `;

      const updateFields = [];
      const request = pool2.request();

      if (ITEMNAME !== undefined) {
        updateFields.push('ITEMNAME = @ITEMNAME');
        request.input('ITEMNAME', sql.NVarChar(255), ITEMNAME);
      }

      if (ITEMGROUPID !== undefined) {
        updateFields.push('ITEMGROUPID = @ITEMGROUPID');
        request.input('ITEMGROUPID', sql.NVarChar(255), ITEMGROUPID);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
      WHERE ITEMID = @ITEMID
    `;

      request.input('ITEMID', sql.NVarChar(255), ITEMID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Item record not found.' });
      }

      res.status(200).send({ message: 'Item data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // all controller for tbl_Items_CL end









  async getAllPackingSlips(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.PackingSlipTable
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },
  async getAllTblDispatchingData(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Dispatching
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // async getAllTblDispatchingData(req, res, next) {
  //   try {
  //     const cacheKey = "tblDispatchingData";

  //     // Try to get data from Redis cache
  //     const cachedData = await client.get(cacheKey);

  //     if (cachedData) {
  //       // Parse the cached data and return it
  //       const parsedData = JSON.parse(cachedData);
  //       return res.status(200).send(parsedData);
  //     } else {
  //       // Fetch data from the database if not in cache
  //       let query = `
  //         SELECT * FROM dbo.tbl_Dispatching
  //       `;
  //       let request = pool1.request();
  //       const data = await request.query(query);

  //       if (data.recordsets[0].length === 0) {
  //         return res.status(404).send({ message: "No data found." });
  //       }

  //       // Cache the data in Redis with an expiration time (e.g., 1 hour)
  //       await client.set(cacheKey, JSON.stringify(data.recordsets[0]), "EX", 3600);

  //       return res.status(200).send(data.recordsets[0]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ message: error.message });
  //   }
  // },


  // tbl_Shipment_Palletizing start ------------------------------

  async getAllTblShipmentPalletizing(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Palletizing
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getShipmentPalletizingByTransferId(req, res, next,) {
    try {
      let query = `
        SELECT * FROM dbo.tbl_Shipment_Palletizing
        WHERE TRANSFERID = @TRANSFERID
      `;
      const { TRANSFERID } = req.query;
      let request = pool1.request();
      request.input('TRANSFERID', sql.NVarChar(20), TRANSFERID);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  async vaildatehipmentPalletizingSerialNumber(req, res, next) {
    try {
      const { ItemSerialNo, SHIPMENTID } = req.query;
      // Check if the SERIALNUMBER exists in tbl_mappedBarcodes
      const checkMappedBarcodesQuery = `
        SELECT COUNT(*) as count
        FROM dbo.tblMappedBarcodes
        WHERE ItemSerialNo = @ItemSerialNo
      `;

      let request1 = pool2.request();
      request1.input("ItemSerialNo", sql.NVarChar, ItemSerialNo);
      const checkMappedBarcodesResult = await request1.query(checkMappedBarcodesQuery);

      if (checkMappedBarcodesResult.recordset[0].count > 0) {
        return res.status(400).send({ message: "ItemSerialNo already exists in tbl_mappedBarcodes." });
      }

      let request2 = pool1.request();
      let request3 = pool2.request();

      request2.input("ItemSerialNo", sql.NVarChar, ItemSerialNo);
      request3.input("ItemSerialNo", sql.NVarChar, ItemSerialNo);
      request3.input("SHIPMENTID", sql.NVarChar, SHIPMENTID);


      // Fetch SHIPMENTID from tbl_Shipment_Received_CL

      const getShipmentIDFromReceivedCLQuery = `
        SELECT SHIPMENTID
        FROM tbl_Shipment_Received_CL
        WHERE SERIALNUM = @ItemSerialNo AND SHIPMENTID = @SHIPMENTID
        AND (PALLETCODE IS NULL OR PALLETCODE = '' OR PALLETCODE = 'undefined')
      `;
      const shipmentIDFromReceivedCLResult = await request3.query(getShipmentIDFromReceivedCLQuery);
      console.log(shipmentIDFromReceivedCLResult);
      if (shipmentIDFromReceivedCLResult.recordset.length > 0) {
        const receivedCLShipmentID = shipmentIDFromReceivedCLResult.recordset[0].SHIPMENTID;

        // Check if SHIPMENTID exists in tbl_Shipment_Palletizing
        console.log(receivedCLShipmentID);
        return res.status(200).send({ message: "Success: Serial number is valid" });
      } else {
        return res.status(404).send({ message: "ShipmentId does not matched." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  async generateAndUpdatePalletIds(req, res, next) {
    try {
      const serialNumberList = req.query.serialNumberList;

      // Fetch the first GS1GCPID and last SSCC_AutoCounter from TblSysNo using pool2
      const query = `
      SELECT 
        (SELECT TOP 1 GS1GCPID FROM TblGCP ORDER BY TblSysNoID ASC) as FirstGS1GCPID,
        (SELECT TOP 1 SSCC_AutoCounter FROM TblSysNo ORDER BY SSCC_AutoCounter DESC) as LastSSCCAutoCounter
    `;

      const result = await pool2.request().query(query);
      const GS1GCPID = result.recordset[0].FirstGS1GCPID.toString();
      let SSCC_AutoCounter = result.recordset[0].LastSSCCAutoCounter;

      // If there is no number in SSCC_AutoCounter, use 1 as the starting counter
      if (!SSCC_AutoCounter) {
        SSCC_AutoCounter = 1;
      } else {
        SSCC_AutoCounter = parseInt(SSCC_AutoCounter) + 1;
      }

      for (const serialNumber of serialNumberList) {
        // Create 17-digit number with the given formula
        const prefix = '0' + GS1GCPID;
        const padding = '0000000'.substring(0, 7 - SSCC_AutoCounter.toString().length);
        const inputNumber = prefix + padding + SSCC_AutoCounter.toString();

        // Generate 18-digit PalletID
        const palletID = ssccCheckDigit(inputNumber);

        // Update tbl_Shipment_Received_CL based on SERIALNUM

        let currentDate = new Date().toISOString();
        const updateQuery = `
          UPDATE tbl_Shipment_Received_CL
          SET PALLETCODE = @PalletID,
          PALLET_DATE = @currentDate
          WHERE SERIALNUM = @SerialNumber
        `;

        await pool2.request()
          .input('PalletID', sql.NVarChar, palletID)
          .input('SerialNumber', sql.NVarChar, serialNumber)
          .input("currentDate", sql.Date, currentDate)
          .query(updateQuery);



      }



      // Update or insert SSCC_AutoCounter in TblSysNo
      const updateTblSysNoQuery = `
       IF EXISTS (SELECT * FROM TblSysNo)
       BEGIN
         UPDATE TblSysNo SET SSCC_AutoCounter = @SSCC_AutoCounter
       END
       ELSE
       BEGIN
         INSERT INTO TblSysNo (SSCC_AutoCounter) VALUES (1)
       END
     `;

      await pool2.request()
        .input('SSCC_AutoCounter', sql.Int, SSCC_AutoCounter)
        .query(updateTblSysNoQuery);

      res.status(200).send({ message: 'PalletIDs generated and updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  }
  ,


  // tbl_Shipment_Palletizing end ------------------------------

  // post request to insert data 
  async insertShipmentRecievingDataCL(req, res, next) {
    try {
      const {
        SHIPMENTSTATUS,
        SHIPMENTID,
        ENTITY,
        CONTAINERID,
        ARRIVALWAREHOUSE,
        ITEMNAME,
        QTY,
        ITEMID,
        PURCHID,
        CLASSIFICATION,
      } = req.query;

      const query = `
        INSERT INTO dbo.tbl_Shipment_Receiving_CL
          (SHIPMENTSTATUS, SHIPMENTID, ENTITY, CONTAINERID, ARRIVALWAREHOUSE, ITEMNAME, QTY, ITEMID, PURCHID, CLASSIFICATION)
        VALUES
          (@SHIPMENTSTATUS, @SHIPMENTID, @ENTITY, @CONTAINERID, @ARRIVALWAREHOUSE, @ITEMNAME, @QTY, @ITEMID, @PURCHID, @CLASSIFICATION)
      `;

      let request = pool2.request();
      request.input('SHIPMENTSTATUS', sql.Float, SHIPMENTSTATUS);
      request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);
      request.input('ENTITY', sql.NVarChar, ENTITY);
      request.input('CONTAINERID', sql.NVarChar, CONTAINERID);
      request.input('ARRIVALWAREHOUSE', sql.NVarChar, ARRIVALWAREHOUSE);
      request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      request.input('QTY', sql.Float, QTY);
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('PURCHID', sql.NVarChar, PURCHID);
      request.input('CLASSIFICATION', sql.Float, CLASSIFICATION);

      await request.query(query);
      res.status(201).send({ message: 'Shipment data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async deleteShipmentRecievingDataCL(req, res, next) {
    // delete data from tbl_Shipment_Receiving_CL based on SHIPMENTID
    try {
      const { SHIPMENTID } = req.query;
      console.log(SHIPMENTID)
      if (!SHIPMENTID) {
        return res.status(400).send({ message: 'shipment ID is required' });
      }

      const query = `
      DELETE FROM dbo.tbl_Shipment_Receiving_CL
      WHERE SHIPMENTID = @SHIPMENTID
    `;

      let request = pool2.request();
      request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);
      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Shipment data not found' });
      }

      res.status(201).send({ message: 'Shipment data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  },


  // PUT request to update data
  async updateShipmentRecievingDataCL(req, res, next) {
    try {
      const {
        SHIPMENTSTATUS,
        SHIPMENTID,
        ENTITY,
        CONTAINERID,
        ARRIVALWAREHOUSE,
        ITEMNAME,
        QTY,
        ITEMID,
        PURCHID,
        CLASSIFICATION,
      } = req.query;
      console.log(req.query);

      if (!SHIPMENTID) {
        return res.status(400).send({ message: 'SHIPMENTID is required.' });
      }

      let query = `
      UPDATE dbo.tbl_Shipment_Receiving_CL
      SET `;

      const updateFields = [];
      const request = pool2.request();

      if (SHIPMENTSTATUS !== undefined) {
        updateFields.push('SHIPMENTSTATUS = @SHIPMENTSTATUS');
        request.input('SHIPMENTSTATUS', sql.Float, SHIPMENTSTATUS);
      }

      if (ENTITY !== undefined) {
        updateFields.push('ENTITY = @ENTITY');
        request.input('ENTITY', sql.NVarChar, ENTITY);
      }

      if (CONTAINERID !== undefined) {
        updateFields.push('CONTAINERID = @CONTAINERID');
        request.input('CONTAINERID', sql.NVarChar, CONTAINERID);
      }

      if (ARRIVALWAREHOUSE !== undefined) {
        updateFields.push('ARRIVALWAREHOUSE = @ARRIVALWAREHOUSE');
        request.input('ARRIVALWAREHOUSE', sql.NVarChar, ARRIVALWAREHOUSE);
      }

      if (ITEMNAME !== undefined) {
        updateFields.push('ITEMNAME = @ITEMNAME');
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      }

      if (QTY !== undefined) {
        updateFields.push('QTY = @QTY');
        request.input('QTY', sql.Float, QTY);
      }

      if (ITEMID !== undefined) {
        updateFields.push('ITEMID = @ITEMID');
        request.input('ITEMID', sql.NVarChar, ITEMID);
      }

      if (PURCHID !== undefined) {
        updateFields.push('PURCHID = @PURCHID');
        request.input('PURCHID', sql.NVarChar, PURCHID);
      }

      if (CLASSIFICATION !== undefined) {
        updateFields.push('CLASSIFICATION = @CLASSIFICATION');
        request.input('CLASSIFICATION', sql.Float, CLASSIFICATION);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
      WHERE SHIPMENTID = @SHIPMENTID
    `;

      request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Shipment record not found.' });
      }

      res.status(200).send({ message: 'Shipment data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // ------------ tbl_Shipment_Received_CL controllers Start ------------


  async getAllTblShipmentReceivedCL(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Received_CL
      `;
      let request = pool2.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },





  async getTransferDistributionByTransferId(req, res, next,) {
    try {
      let query = `
        SELECT * FROM dbo.Transfer_Distribution
        WHERE TRANSFERID = @TRANSFERID
      `;
      const { TRANSFERID } = req.query;
      let request = pool1.request();
      request.input('TRANSFERID', sql.NVarChar(20), TRANSFERID);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getTblShipmentReceivedCLStats(req, res, next) {
    try {
      let query = `
        SELECT
          COUNT(DISTINCT SHIPMENTID) as uniqueShipmentCount,
          COUNT(*) as totalReceipts,
          SUM(POQTY) as totalItems
        FROM dbo.tbl_Shipment_Received_CL
        WHERE CAST(TRXDATETIME AS DATE) = CAST(GETDATE() AS DATE)
      `;
      let request = pool2.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }
      return res.status(200).send({
        uniqueShipmentCount: data.recordsets[0][0].uniqueShipmentCount,
        totalReceipts: data.recordsets[0][0].totalReceipts,
        totalItems: data.recordsets[0][0].totalItems,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  // post request to insert data 

  async insertShipmentRecievedDataCL(req, res, next) {
    console.log(req.token);
    try {
      const {
        SHIPMENTID,
        CONTAINERID,
        ARRIVALWAREHOUSE,
        ITEMNAME,
        ITEMID,
        PURCHID,
        CLASSIFICATION,
        SERIALNUM,
        RCVDCONFIGID,
        RCVD_DATE,
        GTIN,
        RZONE,
        PALLET_DATE,
        PALLETCODE,
        BIN,
        REMARKS,
        POQTY,
      } = req.query;

      const localDateString = new Date().toISOString();

      const checkShipmentCounterQuery = `
        SELECT TOP 1 [REMAININGQTY]
        FROM [WBSSQL].[dbo].[tbl_Shipment_Counter]
        WHERE [SHIPMENTID] = @SHIPMENTID AND [CONTAINERID] = @CONTAINERID
      `;

      let request1 = pool2.request();
      request1.input("SHIPMENTID", sql.NVarChar, SHIPMENTID);
      request1.input("CONTAINERID", sql.NVarChar, CONTAINERID);

      const checkShipmentCounterResult = await request1.query(checkShipmentCounterQuery);
      let REMAININGQTY;

      if (checkShipmentCounterResult.recordset.length === 0) {
        REMAININGQTY = POQTY;

        const insertShipmentCounterQuery = `
          INSERT INTO [WBSSQL].[dbo].[tbl_Shipment_Counter]
            ([SHIPMENTID], [CONTAINERID], [POQTY], [REMAININGQTY])
          VALUES
            (@SHIPMENTID, @CONTAINERID, @POQTY, @REMAININGQTY)
        `;

        let request2 = pool2.request();
        request2.input("SHIPMENTID", sql.NVarChar, SHIPMENTID);
        request2.input("CONTAINERID", sql.NVarChar, CONTAINERID);
        request2.input("POQTY", sql.Numeric(18, 0), POQTY);
        request2.input("REMAININGQTY", sql.Numeric(18, 0), REMAININGQTY);
        await request2.query(insertShipmentCounterQuery);

      } else {
        REMAININGQTY = checkShipmentCounterResult.recordset[0].REMAININGQTY;
        if (REMAININGQTY === 0) {
          res.status(409).send({ message: "Error: Remaining qty is 0." });
          return;
        }
      }

      const checkSerialNumQuery = `
        SELECT COUNT(*) as count
        FROM dbo.tbl_Shipment_Received_CL
        WHERE SERIALNUM = @SERIALNUM
      `;

      let request3 = pool2.request();
      request3.input("SERIALNUM", sql.NVarChar, SERIALNUM);

      const checkSerialNumResult = await request3.query(checkSerialNumQuery);
      if (checkSerialNumResult.recordset[0].count > 0) {
        res.status(409).send({ message: "Error: SerialNum already exists." });
        return;
      }

      const query = `
        INSERT INTO dbo.tbl_Shipment_Received_CL
          (SHIPMENTID, CONTAINERID, ARRIVALWAREHOUSE, ITEMNAME, ITEMID, PURCHID, CLASSIFICATION, SERIALNUM, RCVDCONFIGID, RCVD_DATE, GTIN, RZONE, PALLET_DATE, PALLETCODE, BIN, REMARKS, POQTY, RCVQTY, REMAININGQTY, USERID, TRXDATETIME)
          VALUES
          (@SHIPMENTID, @CONTAINERID, @ARRIVALWAREHOUSE, @ITEMNAME, @ITEMID, @PURCHID, @CLASSIFICATION, @SERIALNUM, @RCVDCONFIGID, @RCVD_DATE, @GTIN, @RZONE, @PALLET_DATE, @PALLETCODE, @BIN, @REMARKS, @POQTY, @RCVQTY, @REMAININGQTY, @USERID, @TRXDATETIME)
          `;
      let request4 = pool2.request();
      request4.input("SHIPMENTID", sql.NVarChar, SHIPMENTID);
      request4.input("CONTAINERID", sql.NVarChar, CONTAINERID);
      request4.input("ARRIVALWAREHOUSE", sql.NVarChar, ARRIVALWAREHOUSE);
      request4.input("ITEMNAME", sql.NVarChar, ITEMNAME);
      request4.input("ITEMID", sql.NVarChar, ITEMID);
      request4.input("PURCHID", sql.NVarChar, PURCHID);
      request4.input("CLASSIFICATION", sql.Float, CLASSIFICATION);
      request4.input("SERIALNUM", sql.NVarChar, SERIALNUM);
      request4.input("RCVDCONFIGID", sql.NVarChar, RCVDCONFIGID);
      request4.input("RCVD_DATE", sql.Date, RCVD_DATE);
      request4.input("GTIN", sql.NVarChar, GTIN);
      request4.input("RZONE", sql.NVarChar, RZONE);
      request4.input("PALLET_DATE", sql.Date, PALLET_DATE);
      request4.input("PALLETCODE", sql.NVarChar, PALLETCODE);
      request4.input("BIN", sql.NVarChar, BIN);
      request4.input("REMARKS", sql.NVarChar, REMARKS);
      request4.input("POQTY", sql.Numeric(18, 0), POQTY);
      request4.input("RCVQTY", sql.Numeric(18, 0), 1);
      request4.input("REMAININGQTY", sql.Numeric(18, 0), REMAININGQTY - 1);
      request4.input("USERID", sql.NVarChar, req.token.UserID);
      request4.input("TRXDATETIME", sql.DateTime, localDateString);

      await request4.query(query);

      const updateShipmentCounterQuery = `
  UPDATE [WBSSQL].[dbo].[tbl_Shipment_Counter]
  SET [REMAININGQTY] = @REMAININGQTY2
  WHERE [SHIPMENTID] = @SHIPMENTID AND [CONTAINERID] = @CONTAINERID
`;

      let request5 = pool2.request();
      request5.input("SHIPMENTID", sql.NVarChar, SHIPMENTID);
      request5.input("CONTAINERID", sql.NVarChar, CONTAINERID);
      request5.input("REMAININGQTY2", sql.Numeric(18, 0), REMAININGQTY - 1);
      await request5.query(updateShipmentCounterQuery);

      res.status(201).send({ message: "Shipment data inserted successfully." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },





  async getShipmentRecievedCLDataCByShipmentId(req, res, next) {

    try {
      const { SHIPMENTID } = req.query;
      console.log(SHIPMENTID);

      if (!SHIPMENTID) {
        return res.status(400).send({ message: "SHIPMENTID is required." });
      }

      const query = `
        SELECT * FROM dbo.tbl_Shipment_Received_CL
        WHERE SHIPMENTID = @SHIPMENTID
      `;
      let request = pool2.request();
      request.input('SHIPMENTID', sql.NVarChar(255), SHIPMENTID);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Shipment not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },
  async getShipmentRecievedCLDataCBySerialNumber(req, res, next) {

    try {
      const { SERIALNUM } = req.query;

      if (!SERIALNUM) {
        return res.status(400).send({ message: "SERIALNUM is required." });
      }

      const query = `
        SELECT * FROM dbo.tbl_Shipment_Received_CL
        WHERE SERIALNUM = @SERIALNUM
      `;
      let request = pool2.request();
      request.input('SERIALNUM', sql.NVarChar(100), SERIALNUM);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },



  async getShipmentRecievedCLDataByPalletCode(req, res, next) {

    try {
      const { PalletCode } = req.query;
      console.log(PalletCode);

      if (!PalletCode) {
        return res.status(400).send({ message: "PalletCode is required." });
      }

      const query = `
        SELECT * FROM dbo.tbl_Shipment_Received_CL
        WHERE PalletCode = @PalletCode
      `;
      let request = pool2.request();
      request.input('PalletCode', sql.NVarChar(255), PalletCode);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getShipmentRecievedCLDataBySerialNumberAndBinLocation(req, res, next) {
    try {
      const { serialNumber, binLocation } = req.query;

      if (!serialNumber || !binLocation) {
        return res.status(400).send({ message: "SERIALNUM and bin location are required." });
      }

      const query = `
        SELECT * FROM dbo.tbl_Shipment_Received_CL
        WHERE SERIALNUM = @SERIALNUM AND BIN = @BinLocation
      `;
      let request = pool2.request();
      request.input('SERIALNUM', sql.NVarChar(100), serialNumber);
      request.input('BinLocation', sql.NVarChar(255), binLocation);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getShipmentRecievedCLDataByPalletCodeAndBinLocation(req, res, next) {
    try {
      const { palletCode, binLocation } = req.query;

      if (!palletCode || !binLocation) {
        return res.status(400).send({ message: "PalletCode and bin location are required." });
      }

      const query = `
        SELECT * FROM dbo.tbl_Shipment_Received_CL
        WHERE PalletCode = @PalletCode AND BIN = @BinLocation
      `;
      let request = pool2.request();
      request.input('PalletCode', sql.NVarChar(255), palletCode);
      request.input('BinLocation', sql.NVarChar(255), binLocation);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "Data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async deleteShipmentRecievedDataCL(req, res, next) {
    try {
      const { SERIALNUM } = req.query;
      console.log(SERIALNUM);

      if (!SERIALNUM) {
        return res.status(400).send({ message: "SERIALNUM is required." });
      }

      const query = `
        DELETE FROM dbo.tbl_Shipment_Received_CL
        WHERE SERIALNUM = @SERIALNUM
      `;

      let request = pool2.request();
      request.input('SERIALNUM', sql.NVarChar(255), SERIALNUM);

      const result = await request.query(query);
      console.log("Before query execution");

      console.log("After query execution");
      console.log("Rows affected: ", result.rowsAffected[0]);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: "No data found with the given SERIALNUM." });
      }

      res.status(200).send({ message: 'Shipment data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  // controller to update data
  async updateShipmentRecievedDataCL(req, res, next) {
    try {
      let records = req.body.records; // Get the records array from the request body

      if (!Array.isArray(records)) {
        records = [req.body]; // If it's not an array, use the original request body as a single-record array
      }

      if (records.length === 0) {
        return res.status(400).send({ message: 'At least one record is required for update.' });
      }

      let updatedCount = 0;

      for (const record of records) {
        const {
          SERIALNUM,
          SHIPMENTID,
          CONTAINERID,
          ARRIVALWAREHOUSE,
          ITEMNAME,
          ITEMID,
          PURCHID,
          CLASSIFICATION,
          RCVDCONFIGID,
          RCVD_DATE,
          GTIN,
          RZONE,
          PALLET_DATE,
          PALLETCODE,
          BIN,
          REMARKS,
          POQTY,
          RCVQTY,
          REMAININGQTY
        } = record;

        if (!SERIALNUM) {
          continue; // Skip the record if SERIALNUM is missing
        }

        let query = `
          UPDATE dbo.tbl_Shipment_Received_CL
          SET `;

        const updateFields = [];
        const request = pool2.request();

        if (SHIPMENTID !== undefined) {
          updateFields.push('SHIPMENTID = @SHIPMENTID');
          request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);
        }

        if (CONTAINERID !== undefined) {
          updateFields.push('CONTAINERID = @CONTAINERID');
          request.input('CONTAINERID', sql.NVarChar, CONTAINERID);
        }

        if (ARRIVALWAREHOUSE !== undefined) {
          updateFields.push('ARRIVALWAREHOUSE = @ARRIVALWAREHOUSE');
          request.input('ARRIVALWAREHOUSE', sql.NVarChar, ARRIVALWAREHOUSE);
        }

        if (ITEMNAME !== undefined) {
          updateFields.push('ITEMNAME = @ITEMNAME');
          request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        }

        if (ITEMID !== undefined) {
          updateFields.push('ITEMID = @ITEMID');
          request.input('ITEMID', sql.NVarChar, ITEMID);
        }

        if (PURCHID !== undefined) {
          updateFields.push('PURCHID = @PURCHID');
          request.input('PURCHID', sql.NVarChar, PURCHID);
        }

        if (CLASSIFICATION !== undefined) {
          updateFields.push('CLASSIFICATION = @CLASSIFICATION');
          request.input('CLASSIFICATION', sql.Float, CLASSIFICATION);
        }

        if (RCVDCONFIGID !== undefined) {
          updateFields.push('RCVDCONFIGID = @RCVDCONFIGID');
          request.input('RCVDCONFIGID', sql.NVarChar, RCVDCONFIGID);
        }

        if (RCVD_DATE !== undefined) {
          updateFields.push('RCVD_DATE = @RCVD_DATE');
          request.input('RCVD_DATE', sql.Date, RCVD_DATE);
        }

        if (GTIN !== undefined) {
          updateFields.push('GTIN = @GTIN');
          request.input('GTIN', sql.NVarChar, GTIN);
        }

        if (RZONE !== undefined) {
          updateFields.push('RZONE = @RZONE');
          request.input('RZONE', sql.NVarChar, RZONE);
        }

        if (PALLET_DATE !== undefined) {
          updateFields.push('PALLET_DATE = @PALLET_DATE');
          request.input('PALLET_DATE', sql.Date, PALLET_DATE);
        }

        if (PALLETCODE !== undefined) {
          updateFields.push('PALLETCODE = @PALLETCODE');
          request.input('PALLETCODE', sql.NVarChar, PALLETCODE);
        }

        if (BIN !== undefined) {
          updateFields.push('BIN = @BIN');
          request.input('BIN', sql.NVarChar, BIN);
        }

        if (REMARKS !== undefined) {
          updateFields.push('REMARKS = @REMARKS');
          request.input('REMARKS', sql.NVarChar, REMARKS);
        }

        if (POQTY !== undefined) {
          updateFields.push('POQTY = @POQTY');
          request.input('POQTY', sql.Numeric(18, 0), POQTY);
        }

        if (RCVQTY !== undefined) {
          updateFields.push('RCVQTY = @RCVQTY');
          request.input('RCVQTY', sql.Numeric(18, 0), RCVQTY);
        }

        if (REMAININGQTY !== undefined) {
          updateFields.push('REMAININGQTY = @REMAININGQTY');
          request.input('REMAININGQTY', sql.Numeric(18, 0), REMAININGQTY);
        }

        if (updateFields.length === 0) {
          return res.status(400).send({ message: 'At least one field is required to update.' });
        }

        query += updateFields.join(', ');

        query += `
        WHERE SERIALNUM = @SERIALNUM
        `;

        request.input('SERIALNUM', sql.NVarChar, SERIALNUM);

        const result = await request.query(query);

        if (result.rowsAffected[0] === 1) {
          updatedCount += 1;
        }
      }

      if (updatedCount === 0) {
        return res.status(404).send({ message: 'No shipment records were updated.' });
      }

      res.status(200).send({ message: `${updatedCount} shipment record(s) updated successfully.` });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },





  // ----------------------------- tbl_Shipment_Received_CL END ----------------------------- //


  // ----------------------------- tbl_Shipment_Palletizing_CL START ----------------------------- //


  async getAllTblShipmentPalletizingCL(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Palletizing_CL
      `;
      let request = pool2.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async insertShipmentPalletizingDataCL(req, res, next) {
    try {
      const {
        ALS_PACKINGSLIPREF,
        ALS_TRANSFERORDERTYPE,
        TRANSFERID,
        INVENTLOCATIONIDFROM,
        INVENTLOCATIONIDTO,
        QTYTRANSFER,
        ITEMID,
        ITEMNAME,
        CONFIGID,
        WMSLOCATIONID,
        SHIPMENTID,
      } = req.query;

      const query = `
        INSERT INTO dbo.tbl_Shipment_Palletizing_CL
          (ALS_PACKINGSLIPREF, ALS_TRANSFERORDERTYPE, TRANSFERID, INVENTLOCATIONIDFROM, INVENTLOCATIONIDTO, QTYTRANSFER, ITEMID, ITEMNAME, CONFIGID, WMSLOCATIONID, SHIPMENTID)
        VALUES
          (@ALS_PACKINGSLIPREF, @ALS_TRANSFERORDERTYPE, @TRANSFERID, @INVENTLOCATIONIDFROM, @INVENTLOCATIONIDTO, @QTYTRANSFER, @ITEMID, @ITEMNAME, @CONFIGID, @WMSLOCATIONID, @SHIPMENTID)
      `;

      let request = pool2.request();
      request.input('ALS_PACKINGSLIPREF', sql.NVarChar, ALS_PACKINGSLIPREF);
      request.input('ALS_TRANSFERORDERTYPE', sql.Float, ALS_TRANSFERORDERTYPE);
      request.input('TRANSFERID', sql.NVarChar, TRANSFERID);
      request.input('INVENTLOCATIONIDFROM', sql.NVarChar, INVENTLOCATIONIDFROM);
      request.input('INVENTLOCATIONIDTO', sql.NVarChar, INVENTLOCATIONIDTO);
      request.input('QTYTRANSFER', sql.Float, QTYTRANSFER);
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      request.input('CONFIGID', sql.NVarChar, CONFIGID);
      request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
      request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);

      await request.query(query);
      res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  async updateShipmentPalletizingDataCL(req, res, next) {
    try {
      const {
        ALS_PACKINGSLIPREF,
        ALS_TRANSFERORDERTYPE,
        TRANSFERID,
        INVENTLOCATIONIDFROM,
        INVENTLOCATIONIDTO,
        QTYTRANSFER,
        ITEMID,
        ITEMNAME,
        CONFIGID,
        WMSLOCATIONID,
        SHIPMENTID,
      } = req.query;

      if (!TRANSFERID) {
        return res.status(400).send({ message: 'TRANSFERID is required.' });
      }

      let query = `
        UPDATE dbo.tbl_Shipment_Palletizing_CL
        SET `;

      const updateFields = [];
      const request = pool2.request();

      if (ALS_PACKINGSLIPREF !== undefined) {
        updateFields.push('ALS_PACKINGSLIPREF = @ALS_PACKINGSLIPREF');
        request.input('ALS_PACKINGSLIPREF', sql.NVarChar, ALS_PACKINGSLIPREF);
      }

      if (ALS_TRANSFERORDERTYPE !== undefined) {
        updateFields.push('ALS_TRANSFERORDERTYPE = @ALS_TRANSFERORDERTYPE');
        request.input('ALS_TRANSFERORDERTYPE', sql.Float, ALS_TRANSFERORDERTYPE);
      }

      if (INVENTLOCATIONIDFROM !== undefined) {
        updateFields.push('INVENTLOCATIONIDFROM = @INVENTLOCATIONIDFROM');
        request.input('INVENTLOCATIONIDFROM', sql.NVarChar, INVENTLOCATIONIDFROM);
      }

      if (INVENTLOCATIONIDTO !== undefined) {
        updateFields.push('INVENTLOCATIONIDTO = @INVENTLOCATIONIDTO');
        request.input('INVENTLOCATIONIDTO', sql.NVarChar, INVENTLOCATIONIDTO);
      }

      if (QTYTRANSFER !== undefined) {
        updateFields.push('QTYTRANSFER = @QTYTRANSFER');
        request.input('QTYTRANSFER', sql.Float, QTYTRANSFER);
      }

      if (ITEMID !== undefined) {
        updateFields.push('ITEMID = @ITEMID');
        request.input('ITEMID', sql.NVarChar, ITEMID);
      }

      if (ITEMNAME !== undefined) {
        updateFields.push('ITEMNAME = @ITEMNAME');
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      }

      if (CONFIGID !== undefined) {
        updateFields.push('CONFIGID = @CONFIGID');
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
      }

      if (WMSLOCATIONID !== undefined) {
        updateFields.push('WMSLOCATIONID = @WMSLOCATIONID');
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
      }

      if (SHIPMENTID !== undefined) {
        updateFields.push('SHIPMENTID = @SHIPMENTID');
        request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
        WHERE TRANSFERID = @TRANSFERID
      `;

      request.input('TRANSFERID', sql.NVarChar, TRANSFERID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Record not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  async deleteShipmentPalletizingDataCL(req, res, next) {
    try {
      const { TRANSFERID } = req.query;

      if (!TRANSFERID) {
        return res.status(400).send({ message: 'TRANSFERID is required.' });
      }

      const query = `
        DELETE FROM dbo.tbl_Shipment_Palletizing_CL
        WHERE TRANSFERID = @TRANSFERID
      `;

      const request = pool2.request();
      request.input('TRANSFERID', sql.NVarChar, TRANSFERID);
      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Record not found.' });
      }

      res.status(200).send({ message: 'Data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // ------------------------------ tbl_Shipment_Palletizing_CL END ------------------------------ //






  // ------------------------------ tbL_Picking_CL START ------------------------------ //


  async insertTblPickingDataCL(req, res, next) {
    try {
      const {
        PICKINGROUTEID,
        CUSTOMER,
        INVENTLOCATIONID,
        TRANSREFID,
        ITEMID,
        QTY,
        EXPEDITIONSTATUS,
        CONFIGID,
        WMSLOCATIONID,
        ITEMNAME,
        inventTransId
      } = req.query;

      const query = `
      INSERT INTO dbo.tbL_Picking_CL
        (PICKINGROUTEID, CUSTOMER, INVENTLOCATIONID, TRANSREFID, ITEMID, QTY, EXPEDITIONSTATUS, CONFIGID, WMSLOCATIONID, ITEMNAME, inventTransId)
      VALUES
        (@PICKINGROUTEID, @CUSTOMER, @INVENTLOCATIONID, @TRANSREFID, @ITEMID, @QTY, @EXPEDITIONSTATUS, @CONFIGID, @WMSLOCATIONID, @ITEMNAME, @inventTransId)
    `;

      let request = pool2.request();
      request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);
      request.input('CUSTOMER', sql.NVarChar, CUSTOMER);
      request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
      request.input('TRANSREFID', sql.NVarChar, TRANSREFID);
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('QTY', sql.Numeric, QTY);
      request.input('EXPEDITIONSTATUS', sql.Numeric, EXPEDITIONSTATUS);
      request.input('CONFIGID', sql.NVarChar, CONFIGID);
      request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
      request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      request.input('inventTransId', sql.NVarChar, inventTransId);

      await request.query(query);
      res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getAllTblPickingCL(req, res, next) {
    try {
      const query = `
        SELECT *
        FROM dbo.tbL_Picking_CL
      `;

      const request = pool2.request();
      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async updateTblPickingDataCL(req, res, next) {
    try {
      const {
        PICKINGROUTEID,
        CUSTOMER,
        INVENTLOCATIONID,
        TRANSREFID,
        ITEMID,
        QTY,
        EXPEDITIONSTATUS,
        CONFIGID,
        WMSLOCATIONID,
        ITEMNAME,
        inventTransId
      } = req.query;

      if (!PICKINGROUTEID) {
        return res.status(400).send({ message: 'PICKINGROUTEID is required.' });
      }

      let query = `
        UPDATE dbo.tbL_Picking_CL
        SET `;

      const updateFields = [];
      const request = pool2.request();

      if (CUSTOMER !== undefined) {
        updateFields.push('CUSTOMER = @CUSTOMER');
        request.input('CUSTOMER', sql.NVarChar, CUSTOMER);
      }

      if (INVENTLOCATIONID !== undefined) {
        updateFields.push('INVENTLOCATIONID = @INVENTLOCATIONID');
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
      }

      if (TRANSREFID !== undefined) {
        updateFields.push('TRANSREFID = @TRANSREFID');
        request.input('TRANSREFID', sql.NVarChar, TRANSREFID);
      }

      if (ITEMID !== undefined) {
        updateFields.push('ITEMID = @ITEMID');
        request.input('ITEMID', sql.NVarChar, ITEMID);
      }

      if (QTY !== undefined) {
        updateFields.push('QTY = @QTY');
        request.input('QTY', sql.Numeric, QTY);
      }

      if (EXPEDITIONSTATUS !== undefined) {
        updateFields.push('EXPEDITIONSTATUS = @EXPEDITIONSTATUS');
        request.input('EXPEDITIONSTATUS', sql.Numeric, EXPEDITIONSTATUS);
      }

      if (CONFIGID !== undefined) {
        updateFields.push('CONFIGID = @CONFIGID');
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
      }

      if (WMSLOCATIONID !== undefined) {
        updateFields.push('WMSLOCATIONID = @WMSLOCATIONID');
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
      }

      if (ITEMNAME !== undefined) {
        updateFields.push('ITEMNAME = @ITEMNAME');
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      }

      if (inventTransId !== undefined) {
        updateFields.push('inventTransId = @inventTransId');
        request.input('inventTransId', sql.NVarChar, inventTransId);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
        WHERE PICKINGROUTEID = @PICKINGROUTEID
      `;

      request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async deleteTblPickingDataCL(req, res, next) {
    try {
      const { PICKINGROUTEID } = req.query;

      if (!PICKINGROUTEID) {
        return res.status(400).send({ message: 'PICKINGROUTEID is required.' });
      }

      const query = `
        DELETE FROM dbo.tbL_Picking_CL
        WHERE PICKINGROUTEID = @PICKINGROUTEID
      `;

      const request = pool2.request();
      request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // ----------------------------- END OF PICKING CL COntrollers ----------------------------- //



  // ----------------------------- START OF tbl_Dispatching_CL Controllers ----------------------------- //

  // async insertTblDispatchingDataCL(req, res, next) {
  //   try {
  //     const {
  //       PACKINGSLIPID,
  //       VEHICLESHIPPLATENUMBER,
  //       INVENTLOCATIONID,
  //       INVENTSITEID,
  //       WMSLOCATIONID,
  //       ITEMID,
  //       QTY,
  //       REMAIN,
  //       NAME,
  //       CONFIGID,
  //       PICKINGROUTEID
  //     } = req.query;

  //     const query = `
  //       INSERT INTO dbo.tbl_Dispatching_CL
  //         (PACKINGSLIPID, VEHICLESHIPPLATENUMBER, INVENTLOCATIONID, INVENTSITEID, WMSLOCATIONID, ITEMID, QTY, REMAIN, NAME, CONFIGID, PICKINGROUTEID)
  //       VALUES
  //         (@PACKINGSLIPID, @VEHICLESHIPPLATENUMBER, @INVENTLOCATIONID, @INVENTSITEID, @WMSLOCATIONID, @ITEMID, @QTY, @REMAIN, @NAME, @CONFIGID, @PICKINGROUTEID)
  //     `;

  //     let request = pool2.request();
  //     request.input('PACKINGSLIPID', sql.NVarChar, PACKINGSLIPID);
  //     request.input('VEHICLESHIPPLATENUMBER', sql.NVarChar, VEHICLESHIPPLATENUMBER);
  //     request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
  //     request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
  //     request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
  //     request.input('ITEMID', sql.NVarChar, ITEMID);
  //     request.input('QTY', sql.Float, QTY);
  //     request.input('REMAIN', sql.Float, REMAIN);
  //     request.input('NAME', sql.NVarChar, NAME);
  //     request.input('CONFIGID', sql.NVarChar, CONFIGID);
  //     request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);

  //     await request.query(query);
  //     res.status(201).send({ message: 'Data inserted successfully.' });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ message: error.message });
  //   }
  // },

  async insertTblDispatchingDataCL(req, res, next) {
    try {
      const packingSlipArray = req.body;
      console.log(req?.token);

      for (const packingSlip of packingSlipArray) {
        const fields = [
          "PACKINGSLIPID",
          "VEHICLESHIPPLATENUMBER",
          ...(packingSlip.INVENTLOCATIONID ? ["INVENTLOCATIONID"] : []),
          ...(packingSlip.ITEMID ? ["ITEMID"] : []),
          ...(packingSlip.ORDERED ? ["ORDERED"] : []),
          ...(packingSlip.NAME ? ["NAME"] : []),
          ...(packingSlip.CONFIGID ? ["CONFIGID"] : []),
          ...(packingSlip.SALESID ? ["SALESID"] : []),
        ];

        if (!packingSlip.PACKINGSLIPID || !packingSlip.VEHICLESHIPPLATENUMBER) {
          return res.status(400).send({ message: "PACKINGSLIPID and VEHICLESHIPPLATENUMBER are required" });
        }

        let values = fields.map((field) => "@" + field);

        let query = `INSERT INTO [WBSSQL].[dbo].[tbl_Dispatching_CL] 
          (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
          `;

        let request = pool2.request();

        request.input("PACKINGSLIPID", sql.NVarChar, packingSlip.PACKINGSLIPID);
        request.input("VEHICLESHIPPLATENUMBER", sql.NVarChar, packingSlip.VEHICLESHIPPLATENUMBER);
        if (packingSlip.INVENTLOCATIONID) request.input("INVENTLOCATIONID", sql.NVarChar, packingSlip.INVENTLOCATIONID);
        if (packingSlip.ITEMID) request.input("ITEMID", sql.NVarChar, packingSlip.ITEMID);
        if (packingSlip.ORDERED) request.input("ORDERED", sql.Float, packingSlip.ORDERED);
        if (packingSlip.NAME) request.input("NAME", sql.NVarChar, packingSlip.NAME);
        if (packingSlip.CONFIGID) request.input("CONFIGID", sql.NVarChar, packingSlip.CONFIGID);
        if (packingSlip.SALESID) request.input("SALESID", sql.NVarChar, packingSlip.SALESID);

        await request.query(query);
      }

      return res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  async getAllTblDispatchingCL(req, res, next) {
    try {

      const query = `
        SELECT * FROM dbo.tbl_Dispatching_CL
       
      `;

      let request = pool2.request();

      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // TODO:  upate this updateTblDispatchingDataCL for new columns.
  async updateTblDispatchingDataCL(req, res, next) {
    try {
      const {
        PACKINGSLIPID,
        VEHICLESHIPPLATENUMBER,
        INVENTLOCATIONID,
        INVENTSITEID,
        WMSLOCATIONID,
        ITEMID,
        QTY,
        REMAIN,
        NAME,
        CONFIGID,
        PICKINGROUTEID
      } = req.query;

      if (!PACKINGSLIPID) {
        return res.status(400).send({ message: 'PACKINGSLIPID is required.' });
      }

      let query = `
        UPDATE dbo.tbl_Dispatching_CL
        SET `;

      const updateFields = [];
      const request = pool2.request();

      if (VEHICLESHIPPLATENUMBER !== undefined) {
        updateFields.push('VEHICLESHIPPLATENUMBER = @VEHICLESHIPPLATENUMBER');
        request.input('VEHICLESHIPPLATENUMBER', sql.NVarChar, VEHICLESHIPPLATENUMBER);
      }

      if (INVENTLOCATIONID !== undefined) {
        updateFields.push('INVENTLOCATIONID = @INVENTLOCATIONID');
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
      }

      if (INVENTSITEID !== undefined) {
        updateFields.push('INVENTSITEID = @INVENTSITEID');
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
      }

      if (WMSLOCATIONID !== undefined) {
        updateFields.push('WMSLOCATIONID = @WMSLOCATIONID');
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
      }

      if (ITEMID !== undefined) {
        updateFields.push('ITEMID = @ITEMID');
        request.input('ITEMID', sql.NVarChar, ITEMID);
      }

      if (QTY !== undefined) {
        updateFields.push('QTY = @QTY');
        request.input('QTY', sql.Float, QTY);
      }

      if (REMAIN !== undefined) {
        updateFields.push('REMAIN = @REMAIN');
        request.input('REMAIN', sql.Float, REMAIN);
      }

      if (NAME !== undefined) {
        updateFields.push('NAME = @NAME');
        request.input('NAME', sql.NVarChar, NAME);
      }

      if (CONFIGID !== undefined) {
        updateFields.push('CONFIGID = @CONFIGID');
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
      }

      if (PICKINGROUTEID !== undefined) {
        updateFields.push('PICKINGROUTEID = @PICKINGROUTEID');
        request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
        WHERE PACKINGSLIPID = @PACKINGSLIPID
      `;

      request.input('PACKINGSLIPID', sql.NVarChar, PACKINGSLIPID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async deleteTblDispatchingDataCL(req, res, next) {
    try {
      const { PACKINGSLIPID } = req.query;

      if (!PACKINGSLIPID) {
        return res.status(400).send({ message: 'PACKINGSLIPID is required.' });
      }

      const query = `
        DELETE FROM dbo.tbl_Dispatching_CL
        WHERE PACKINGSLIPID = @PACKINGSLIPID
      `;

      let request = pool2.request();
      request.input('PACKINGSLIPID', sql.NVarChar, PACKINGSLIPID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // ------------------------ tbl_Dispatching_CL Controllers END ------------------------ //


  // ------------------------ tbl_locations_CL Controllers START ------------------------ //



  async insertTblLocationsDataCL(req, res, next) {
    try {
      const {
        MAIN,
        WAREHOUSE,
        ZONE,
        BIN,
        ZONE_CODE,
        ZONE_NAME,
      } = req.query;

      const query = `
        INSERT INTO dbo.tbl_locations_CL
          ( MAIN, WAREHOUSE, ZONE, BIN, ZONE_CODE, ZONE_NAME)
        VALUES
          (@MAIN, @WAREHOUSE, @ZONE, @BIN, @ZONE_CODE, @ZONE_NAME)
      `;

      let request = pool2.request();
      request.input('MAIN', sql.VarChar, MAIN);
      request.input('WAREHOUSE', sql.VarChar, WAREHOUSE);
      request.input('ZONE', sql.VarChar, ZONE);
      request.input('BIN', sql.VarChar, BIN);
      request.input('ZONE_CODE', sql.VarChar, ZONE_CODE);
      request.input('ZONE_NAME', sql.VarChar, ZONE_NAME);

      await request.query(query);
      res.status(201).send({ message: 'Location data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getAllTblLocationsCL(req, res, next) {
    try {
      const query = `
        SELECT * FROM dbo.tbl_locations_CL
      `;

      let request = pool2.request();
      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'no Data found.' });
      }

      res.status(200).send(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async updateTblLocationsDataCL(req, res, next) {
    try {
      const {
        LOCATIONS_HFID,
        MAIN,
        WAREHOUSE,
        ZONE,
        BIN,
        ZONE_CODE,
        ZONE_NAME,
      } = req.query;

      if (!LOCATIONS_HFID) {
        return res.status(400).send({ message: 'LOCATIONS_HFID is required.' });
      }

      let query = `
        UPDATE dbo.tbl_locations_CL
        SET `;

      const updateFields = [];
      const request = pool2.request();

      if (MAIN !== undefined) {
        updateFields.push('MAIN = @MAIN');
        request.input('MAIN', sql.VarChar, MAIN);
      }

      if (WAREHOUSE !== undefined) {
        updateFields.push('WAREHOUSE = @WAREHOUSE');
        request.input('WAREHOUSE', sql.VarChar, WAREHOUSE);
      }

      if (ZONE !== undefined) {
        updateFields.push('ZONE = @ZONE');
        request.input('ZONE', sql.VarChar, ZONE);
      }

      if (BIN !== undefined) {
        updateFields.push('BIN = @BIN');
        request.input('BIN', sql.VarChar, BIN);
      }

      if (ZONE_CODE !== undefined) {
        updateFields.push('ZONE_CODE = @ZONE_CODE');
        request.input('ZONE_CODE', sql.VarChar, ZONE_CODE);
      }

      if (ZONE_NAME !== undefined) {
        updateFields.push('ZONE_NAME = @ZONE_NAME');
        request.input('ZONE_NAME', sql.VarChar, ZONE_NAME);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
  WHERE LOCATIONS_HFID = @LOCATIONS_HFID
`;

      request.input('LOCATIONS_HFID', sql.Numeric, LOCATIONS_HFID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Location record not found.' });
      }

      res.status(200).send({ message: 'Location data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  async deleteTblLocationsDataCL(req, res, next) {
    try {
      const { LOCATIONS_HFID } = req.query;

      const query = `
      DELETE FROM dbo.tbl_locations_CL
      WHERE LOCATIONS_HFID = @LOCATIONS_HFID
    `;

      let request = pool2.request();
      request.input('LOCATIONS_HFID', sql.Numeric, LOCATIONS_HFID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Location record not found.' });
      }

      res.status(200).send({ message: 'Location data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // ------------------------ tbl_locations_CL Controllers END ------------------------ //



  // ------------------------ tblUsers Controllers START ------------------------ //



  // POST request to insert user
  // POST request to insert user
  async insertTblUsersData(req, res, next) {
    try {
      const {
        UserID,
        UserPassword,
        Fullname,
        UserLevel,
        Loc,
      } = req.query;

      const hashedPassword = await bcrypt.hash(UserPassword, saltRounds);

      const query = `
      INSERT INTO dbo.tblUsers
      (UserID, UserPassword, Fullname, UserLevel, Loc)
      VALUES
      (@UserID, @UserPassword, @Fullname, @UserLevel, @Loc)
    `;

      let request = pool2.request();
      request.input('UserID', sql.VarChar(255), UserID);
      request.input('UserPassword', sql.VarChar(255), hashedPassword);
      request.input('Fullname', sql.VarChar(255), Fullname);
      request.input('UserLevel', sql.VarChar(255), UserLevel);
      request.input('Loc', sql.VarChar(255), Loc);

      await request.query(query);

      // Generate token
      const tokenPayload = {
        UserID,
        UserLevel,
        Loc,
      };
      let user = {
        UserID,
        Fullname,
        UserLevel,
        Loc,
      }
      const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiration });

      return res.cookie("accessToken", token, {
        httpOnly: true,
        path: '/',
        maxAge: cookieAge,

      }).status(201).send({ message: 'User inserted successfully.', user, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },
  // POST request to authenticate user
  async loginUser(req, res, next) {
    try {
      const {
        UserID,
        UserPassword,
      } = req.query;

      const query = `
      SELECT * FROM dbo.tblUsers
      WHERE UserID = @UserID
    `;

      let request = pool2.request();
      request.input('UserID', sql.VarChar(255), UserID);

      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'User not found.' });
      }

      const user = result.recordset[0];
      const isPasswordValid = await bcrypt.compare(UserPassword, user.UserPassword);

      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid password.' });
      }
      let tokenPayload = {
        UserID: user.UserID,
        UserLevel: user.UserLevel,
        Loc: user.Loc,
      };
      const token = jwt.sign(tokenPayload, jwtSecret,
        { expiresIn: jwtExpiration });



      delete user.UserPassword;
      return res.cookie("accessToken", token, {
        httpOnly: true,
        path: '/',
        maxAge: cookieAge,



      }).status(200).send({ message: 'Login successful.', user, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async logout(req, res) {
    res
      .clearCookie("accessToken", {
      })
      .status(200)
      .send({ message: "Logout successful." });
  },




  // PUT request to update user
  async updateTblUsersData(req, res, next) {
    try {
      const {
        UserID,
        UserPassword,
        Fullname,
        UserLevel,
        Loc,
      } = req.query;

      if (!UserID) {
        return res.status(400).send({ message: 'UserID is required.' });
      }



      let query = `
      UPDATE dbo.tblUsers
      SET `;

      const updateFields = [];
      const request = pool2.request();

      if (UserPassword !== undefined) {
        const hashedPassword = await bcrypt.hash(UserPassword, saltRounds);
        updateFields.push('UserPassword = @UserPassword');
        request.input('UserPassword', sql.VarChar(255), hashedPassword);
      }

      if (Fullname !== undefined) {
        updateFields.push('Fullname = @Fullname');
        request.input('Fullname', sql.VarChar(255), Fullname);
      }

      if (UserLevel !== undefined) {
        updateFields.push('UserLevel = @UserLevel');
        request.input('UserLevel', sql.VarChar(255), UserLevel);
      }

      if (Loc !== undefined) {
        updateFields.push('Loc = @Loc');
        request.input('Loc', sql.VarChar(255), Loc);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
      WHERE UserID = @UserID
    `;

      request.input('UserID', sql.VarChar(255), UserID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'User record not found.' });
      }

      res.status(200).send({ message: 'User updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // DELETE request to delete user
  async deleteTblUsersData(req, res, next) {
    try {
      const {
        UserID,
      } = req.query;

      if (!UserID) {
        return res.status(400).send({ message: 'UserID is required.' });
      }

      const query = `
      DELETE FROM dbo.tblUsers
      WHERE UserID = @UserID
    `;

      let request = pool2.request();
      request.input('UserID', sql.VarChar(255), UserID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'User record not found.' });
      }

      res.status(200).send({ message: 'User deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // GET request to fetch all users
  async getAllTblUsers(req, res, next) {
    try {
      const query = `
      SELECT * FROM dbo.tblUsers
    `;

      let request = pool2.request();

      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'No user records found.' });
      }

      res.status(200).send(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // GET request to fetch a single user by UserID
  async getSingleTblUsers(req, res, next) {
    try {
      const { UserID } = req.query;

      if (!UserID) {
        return res.status(400).send({ message: 'UserID is required.' });
      }

      const query = `
      SELECT * FROM dbo.tblUsers
      WHERE UserID = @UserID
    `;

      let request = pool2.request();
      request.input('UserID', sql.VarChar(255), UserID);

      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'User record not found.' });
      }

      res.status(200).send(result.recordset[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  // --------------- Alessa APIS for Mobile App Start ------------------


  async getDispatchingDataByPackingSlipId(req, res, next) {
    try {
      const packingSlipId = req.headers['packingslipid']; // Get PACKINGSLIPID from headers
      console.log(packingSlipId);
      let query = `
        SELECT * FROM dbo.tbl_Dispatching
        WHERE PACKINGSLIPID = @packingSlipId
      `;
      let request = pool1.request();
      request.input('packingSlipId', sql.NVarChar(255), packingSlipId); // Remove parseInt() from this line
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getInventTableWMSDataByItemId(req, res, next) {
    try {
      const itemId = req.headers['itemid']; // Get ITEMID from headers
      console.log(itemId);
      let query = `
        SELECT * FROM dbo.InventTableWMS
        WHERE ITEMID = @itemId
      `;
      let request = pool1.request();
      request.input('itemId', sql.NVarChar(255), itemId); // Assuming ITEMID is of type nvarchar(255)
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getmapBarcodeDataByItemCode(req, res, next) {
    try {
      const ItemCode = req.headers['itemcode']; // Get ITEMID from headers
      console.log(ItemCode);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE ItemCode  = @ItemCode
      `;
      let request = pool2.request();
      request.input('ItemCode', sql.NVarChar(100), ItemCode);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getmapBarcodeDataByuser(req, res, next) {
    try {
      // Get ITEMID from headers
      let currentUser = req?.token?.UserID;
      if (!currentUser) {
        res.status(401).send({ message: "Unauthorized! token is required" });
        return;
      }


      let query = `
      SELECT * FROM dbo.tblMappedBarcodes
      WHERE [User] = @User
      `;
      let request = pool2.request();
      request.input('User', sql.NVarChar, currentUser);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getmapBarcodeDataByBinLocation(req, res, next) {
    try {
      const { BinLocation } = req.query;
      console.log(BinLocation);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE BinLocation  = @BinLocation
      `;
      let request = pool2.request();
      request.input('BinLocation', sql.VarChar(200), BinLocation);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getDistinctMappedBarcodeBinLocations(req, res, next) {
    try {
      let query = `SELECT DISTINCT BinLocation FROM  tblMappedBarcodes ORDER BY BinLocation`
      let request = pool2.request();

      let data = await request.query(query)
      data = data.recordsets[0]

      if (data.length === 0) {
        return res.status(404).send({ message: "No Records Found!" })
      }

      return res.status(200).send(data)



    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }

  },


  async getAllTblMappedBarcodes(req, res, next) {
    try {

      let query = `
            SELECT * FROM dbo.tblMappedBarcodes
          `;
      let request = pool2.request();
      const data = await request.query(query);

      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }


      return res.status(200).send(data.recordsets[0]);
    }
    catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },
  async insertIntoMappedBarcode(req, res, next) {
    try {
      const {
        itemcode,
        itemdesc,
        gtin,
        remarks,
        classification,
        mainlocation,
        binlocation,
        intcode,
        itemserialno,
        mapdate,
        palletcode,
        reference,
        sid,
        cid,
        po,
        trans
      } = req.headers;



      let query = ` 
        INSERT INTO dbo.tblMappedBarcodes (ItemCode, ItemDesc, GTIN, Remarks, [User], Classification, MainLocation, BinLocation, IntCode, ItemSerialNo, MapDate, PalletCode, Reference, SID, CID, PO, Trans)
        VALUES (@itemCode, @itemDesc, @gtin, @remarks, @user, @classification, @mainLocation, @binLocation, @intCode, @itemSerialNo, @mapDate, @palletCode, @reference, @sid, @cid, @po, @trans)
      `;
      let request = pool2.request();
      request.input('itemCode', sql.VarChar(100), itemcode);
      request.input('itemDesc', sql.NVarChar(255), itemdesc);
      request.input('gtin', sql.VarChar(150), gtin);
      request.input('remarks', sql.VarChar(100), remarks);
      request.input('user', sql.VarChar(50), req.token.UserID);
      request.input('classification', sql.VarChar(150), classification);
      request.input('mainLocation', sql.VarChar(200), mainlocation);
      request.input('binLocation', sql.VarChar(200), binlocation);
      request.input('intCode', sql.VarChar(150), intcode);
      request.input('itemSerialNo', sql.VarChar(200), itemserialno);
      request.input('mapDate', sql.Date, mapdate);
      request.input('palletCode', sql.VarChar(255), palletcode);
      request.input('reference', sql.VarChar(100), reference);
      request.input('sid', sql.VarChar(50), sid);
      request.input('cid', sql.VarChar(50), cid);
      request.input('po', sql.VarChar(50), po);
      request.input('trans', sql.Numeric(10, 0), trans);

      await request.query(query);

      return res.status(201).send({ message: "Data Inserted Successfully." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async insertIntoMappedBarcode(req, res, next) {
    try {
      const {
        itemcode,
        itemdesc,
        gtin,
        remarks,
        classification,
        mainlocation,
        binlocation,
        intcode,
        itemserialno,
        mapdate,
        palletcode,
        reference,
        sid,
        cid,
        po,
        trans
      } = req.body;

      // Check if the required serial number exists
      if (!itemserialno) {
        return res.status(400).send({ message: "Serial number is required." });
      }

      let query = `
        IF EXISTS (SELECT 1 FROM dbo.tblMappedBarcodes WHERE ItemSerialNo = @itemSerialNo)
        BEGIN
          UPDATE dbo.tblMappedBarcodes
          SET ItemCode = @itemCode,
              ItemDesc = @itemDesc,
              GTIN = @gtin,
              Remarks = @remarks,
              [User] = @user,
              Classification = @classification,
              MainLocation = @mainLocation,
              BinLocation = @binLocation,
              IntCode = @intCode,
              MapDate = @mapDate,
              PalletCode = @palletCode,
              Reference = @reference,
              SID = @sid,
              CID = @cid,
              PO = @po,
              Trans = @trans
          WHERE ItemSerialNo = @itemSerialNo
        END
        ELSE
        BEGIN
          INSERT INTO dbo.tblMappedBarcodes (ItemCode, ItemDesc, GTIN, Remarks, [User], Classification, MainLocation, BinLocation, IntCode, ItemSerialNo, MapDate, PalletCode, Reference, SID, CID, PO, Trans)
          VALUES (@itemCode, @itemDesc, @gtin, @remarks, @user, @classification, @mainLocation, @binLocation, @intCode, @itemSerialNo, @mapDate, @palletCode, @reference, @sid, @cid, @po, @trans)
        END
      `;

      let request = pool2.request();
      request.input('itemCode', sql.VarChar(100), itemcode);
      request.input('itemDesc', sql.NVarChar(255), itemdesc);
      request.input('gtin', sql.VarChar(150), gtin);
      request.input('remarks', sql.VarChar(100), remarks);
      request.input('user', sql.VarChar(50), req.token.UserID);
      request.input('classification', sql.VarChar(150), classification);
      request.input('mainLocation', sql.VarChar(200), mainlocation);
      request.input('binLocation', sql.VarChar(200), binlocation);
      request.input('intCode', sql.VarChar(150), intcode);
      request.input('itemSerialNo', sql.VarChar(200), itemserialno);
      request.input('mapDate', sql.Date, mapdate);
      request.input('palletCode', sql.VarChar(255), palletcode);
      request.input('reference', sql.VarChar(100), reference);
      request.input('sid', sql.VarChar(50), sid);
      request.input('cid', sql.VarChar(50), cid);
      request.input('po', sql.VarChar(50), po);
      request.input('trans', sql.Numeric(10, 0), trans);

      await request.query(query);

      return res.status(201).send({ message: "Data inserted successfully." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },




  async insertManyIntoMappedBarcode(req, res, next) {

    const { records } = req.body;
    try {

      for (let record of records) {
        const {
          itemcode,
          itemdesc,
          gtin,
          remarks,
          classification,
          mainlocation,
          binlocation,
          intcode,
          itemserialno,
          mapdate,
          palletcode,
          reference,
          sid,
          cid,
          po,
          trans
        } = record;



        let query = ` 
        INSERT INTO dbo.tblMappedBarcodes (ItemCode, ItemDesc, GTIN, Remarks, [User], Classification, MainLocation, BinLocation, IntCode, ItemSerialNo, MapDate, PalletCode, Reference, SID, CID, PO, Trans)
        VALUES (@itemCode, @itemDesc, @gtin, @remarks, @user, @classification, @mainLocation, @binLocation, @intCode, @itemSerialNo, @mapDate, @palletCode, @reference, @sid, @cid, @po, @trans)
      `;
        let request = pool2.request();
        request.input('itemCode', sql.VarChar(100), itemcode);
        request.input('itemDesc', sql.NVarChar(255), itemdesc);
        request.input('gtin', sql.VarChar(150), gtin);
        request.input('remarks', sql.VarChar(100), remarks);
        request.input('user', sql.VarChar(50), req.token.UserID);
        request.input('classification', sql.VarChar(150), classification);
        request.input('mainLocation', sql.VarChar(200), mainlocation);
        request.input('binLocation', sql.VarChar(200), binlocation);
        request.input('intCode', sql.VarChar(150), intcode);
        request.input('itemSerialNo', sql.VarChar(200), itemserialno);
        request.input('mapDate', sql.Date, mapdate);
        request.input('palletCode', sql.VarChar(255), palletcode);
        request.input('reference', sql.VarChar(100), reference);
        request.input('sid', sql.VarChar(50), sid);
        request.input('cid', sql.VarChar(50), cid);
        request.input('po', sql.VarChar(50), po);
        request.input('trans', sql.Numeric(10, 0), trans);

        await request.query(query);
      }

      return res.status(201).send({ message: "Data Inserted Successfully." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },




  async updateTblMappedBarcodeByItemCode(req, res, next) {
    try {
      const {
        itemcode,
        itemdesc,
        gtin,
        remarks,
        user,
        classification,
        mainlocation,
        binlocation,
        intcode,
        itemserialno,
        mapdate,
        palletcode,
        reference,
        sid,
        cid,
        po,
        trans
      } = req.headers;

      if (!itemcode) {
        return res.status(400).send({ message: 'ItemCode is required.' });
      }

      let query = `
        UPDATE dbo.tblMappedBarcodes
        SET `;

      const updateFields = [];
      const request = pool2.request();

      if (itemdesc !== undefined) {
        updateFields.push('ItemDesc = @itemDesc');
        request.input('itemDesc', sql.NVarChar(255), itemdesc);
      }

      if (gtin !== undefined) {
        updateFields.push('GTIN = @gtin');
        request.input('gtin', sql.VarChar(150), gtin);
      }

      if (remarks !== undefined) {
        updateFields.push('Remarks = @remarks');
        request.input('remarks', sql.VarChar(100), remarks);
      }

      if (user !== undefined) {
        updateFields.push('[User] = @user');
        request.input('user', sql.VarChar(50), user);
      }

      if (classification !== undefined) {
        updateFields.push('Classification = @classification');
        request.input('classification', sql.VarChar(150), classification);
      }

      if (mainlocation !== undefined) {
        updateFields.push('MainLocation = @mainLocation');
        request.input('mainLocation', sql.VarChar(200), mainlocation);
      }

      if (binlocation !== undefined) {
        updateFields.push('BinLocation = @binLocation');
        request.input('binLocation', sql.VarChar(200), binlocation);
      }

      if (intcode !== undefined) {
        updateFields.push('IntCode = @intCode');
        request.input('intCode', sql.VarChar(150), intcode);
      }

      if (itemserialno !== undefined) {
        updateFields.push('ItemSerialNo = @itemSerialNo');
        request.input('itemSerialNo', sql.VarChar(200), itemserialno);
      }

      if (mapdate !== undefined) {
        updateFields.push('MapDate = @mapDate');
        request.input('mapDate', sql.Date, mapdate);
      }

      if (palletcode !== undefined) {
        updateFields.push('PalletCode = @palletCode');
        request.input('palletCode', sql.VarChar(255), palletcode);
      }

      if (reference !== undefined) {
        updateFields.push('Reference = @reference');
        request.input('reference', sql.VarChar(100), reference);
      }

      if (sid !== undefined) {
        updateFields.push('SID = @sid');
        request.input('sid', sql.VarChar(50), sid);
      }

      if (cid !== undefined) {
        updateFields.push('CID = @cid');
        request.input('cid', sql.VarChar(50), cid);
      }

      if (po !== undefined) {
        updateFields.push('PO = @po');
        request.input('po', sql.VarChar(50), po);
      }

      if (trans !== undefined) {
        updateFields.push('Trans = @trans');
        request.input('trans', sql.Numeric(10, 0), trans);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
        OUTPUT INSERTED.*
        WHERE ItemCode = @itemCode
      `;

      request.input('itemCode', sql.VarChar(100), itemcode);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.', data: result.recordset[0] });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async updateTblMappedBarcodeByGtin(req, res, next) {
    try {
      const {
        itemcode,
        itemdesc,
        gtin,
        remarks,
        user,
        classification,
        mainlocation,
        binlocation,
        intcode,
        itemserialno,
        mapdate,
        palletcode,
        reference,
        sid,
        cid,
        po,
        trans
      } = req.headers;

      if (!gtin) {
        return res.status(400).send({ message: 'GTIN is required.' });
      }

      let query = `
        UPDATE dbo.tblMappedBarcodes
        SET `;

      const updateFields = [];
      const request = pool2.request();

      if (itemcode !== undefined) {
        updateFields.push('ItemCode = @itemCode');
        request.input('itemCode', sql.VarChar(100), itemcode);
      }

      if (itemdesc !== undefined) {
        updateFields.push('ItemDesc = @itemDesc');
        request.input('itemDesc', sql.NVarChar(255), itemdesc);
      }

      if (remarks !== undefined) {
        updateFields.push('Remarks = @remarks');
        request.input('remarks', sql.VarChar(100), remarks);
      }

      if (user !== undefined) {
        updateFields.push('[User] = @user');
        request.input('user', sql.VarChar(50), user);
      }

      if (classification !== undefined) {
        updateFields.push('Classification = @classification');
        request.input('classification', sql.VarChar(150), classification);
      }

      if (mainlocation !== undefined) {
        updateFields.push('MainLocation = @mainLocation');
        request.input('mainLocation', sql.VarChar(200), mainlocation);
      }

      if (binlocation !== undefined) {
        updateFields.push('BinLocation = @binLocation');
        request.input('binLocation', sql.VarChar(200), binlocation);
      }

      if (intcode !== undefined) {
        updateFields.push('IntCode = @intCode');
        request.input('intCode', sql.VarChar(150), intcode);
      }

      if (itemserialno !== undefined) {
        updateFields.push('ItemSerialNo = @itemSerialNo');
        request.input('itemSerialNo', sql.VarChar(200), itemserialno);
      }

      if (mapdate !== undefined) {
        updateFields.push('MapDate = @mapDate');
        request.input('mapDate', sql.Date, mapdate);
      }

      if (palletcode !== undefined) {
        updateFields.push('PalletCode = @palletCode');
        request.input('palletCode', sql.VarChar(255), palletcode);
      }

      if (reference !== undefined) {
        updateFields.push('Reference = @reference');
        request.input('reference', sql.VarChar(100), reference);
      }

      if (sid !== undefined) {
        updateFields.push('SID = @sid');
        request.input('sid', sql.VarChar(50), sid);
      }

      if (cid !== undefined) {
        updateFields.push('CID = @cid');
        request.input('cid', sql.VarChar(50), cid);
      }

      if (po !== undefined) {
        updateFields.push('PO = @po');
        request.input('po', sql.VarChar(50), po);
      }

      if (trans !== undefined) {
        updateFields.push('Trans = @trans');
        request.input('trans', sql.Numeric(10, 0), trans);
      }
      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
        OUTPUT INSERTED.*
        WHERE GTIN = @gtin
      `;

      request.input('gtin', sql.VarChar(150), gtin);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.', data: result.recordset[0] });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async updateTblMappedBarcodeBinLocation(req, res, next) {
    try {
      const { oldbinlocation, newbinlocation } = req.headers;

      if (!oldbinlocation || !newbinlocation) {
        return res.status(400).send({ message: 'Both oldbinlocation and newbinlocation are required.' });
      }

      let query = `
            UPDATE dbo.tblMappedBarcodes
            SET BinLocation = @newbinlocation
            OUTPUT INSERTED.*
            WHERE BinLocation = @oldbinlocation
        `;

      const request = pool2.request();
      request.input('oldbinlocation', sql.VarChar(100), oldbinlocation);
      request.input('newbinlocation', sql.VarChar(100), newbinlocation);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.', data: result.recordset });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async updateTblMappedBarcodeBinLocationWithSelectionType(req, res, next) {
    try {
      const { oldbinlocation, newbinlocation, selectiontype, selectiontypevalue } = req.headers;

      if (!oldbinlocation || !newbinlocation || !selectiontype || !selectiontypevalue) {
        return res.status(400).send({ message: 'oldbinlocation, newbinlocation, selectiontype and selectiontypevalue are all required.' });
      }

      let additionalCondition = '';
      if (selectiontype === 'pallet') {
        additionalCondition = 'AND PalletCode = @selectiontypevalue';
      } else if (selectiontype === 'serial') {
        additionalCondition = 'AND ItemSerialNo = @selectiontypevalue';
      }

      let query = `
            UPDATE dbo.tblMappedBarcodes
            SET BinLocation = @newbinlocation
            OUTPUT INSERTED.*
            WHERE BinLocation = @oldbinlocation ${additionalCondition}
        `;

      const request = pool2.request();
      request.input('oldbinlocation', sql.VarChar(100), oldbinlocation);
      request.input('newbinlocation', sql.VarChar(100), newbinlocation);
      request.input('selectiontypevalue', sql.VarChar(100), selectiontypevalue);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.', data: result.recordset });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },




  async checkBarcodeValidityByItemSerialNo(req, res, next) {
    try {
      const ItemSerialNo = req.headers['itemserialno']; // Get ItemSerialNo from headers
      console.log(ItemSerialNo);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE ItemSerialNo = @ItemSerialNo
      `;
      let request = pool2.request();
      request.input('ItemSerialNo', sql.NVarChar(100), ItemSerialNo);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(200).send(false);
      }
      return res.status(200).send(true);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getItemInfoByItemSerialNo(req, res, next) {
    try {
      const ItemSerialNo = req.headers['itemserialno']; // Get ItemSerialNo from headers
      console.log(ItemSerialNo);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE ItemSerialNo = @ItemSerialNo
      `;
      let request = pool2.request();
      request.input('ItemSerialNo', sql.NVarChar(100), ItemSerialNo);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getMappedBarcodedsByItemSerialNoAndBinLocation(req, res, next) {
    try {
      const ItemSerialNo = req.headers['itemserialno']; // Get ItemSerialNo from headers
      const BinLoacation = req.headers['binlocation']; // Get ItemSerialNo from headers
      console.log(ItemSerialNo);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE ItemSerialNo = @ItemSerialNo
        AND BinLocation = @BinLoacation

      `;
      let request = pool2.request();
      request.input('ItemSerialNo', sql.NVarChar(100), ItemSerialNo);
      request.input('BinLoacation', sql.NVarChar, BinLoacation);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        // return res.status(404).send({ message: "No data found." });
        let query2 = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE ItemSerialNo = @ItemSerialNo1
      `;
        let request2 = pool2.request();
        request2.input('ItemSerialNo1', sql.NVarChar(100), ItemSerialNo);
        const data2 = await request2.query(query2);
        if (data2.recordsets[0].length === 0) {
          return res.status(404).send({ message: "Item does not exist." });
        }
        else {
          return res.status(400).send({ message: `ItemSerialNo is on the different bin location ${data2.recordsets[0][0].BinLocation}` });
        }
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },
  async getMappedBarcodedsByItemCodeAndBinLocation(req, res, next) {
    try {
      const ItemCode = req.headers['itemcode']; // Get ItemSerialNo from headers
      const BinLoacation = req.headers['binlocation']; // Get ItemSerialNo from headers
      console.log(ItemCode);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE ITEMCODE = @ItemCode
        AND BinLocation = @BinLoacation

      `;
      let request = pool2.request();
      request.input('ItemCode', sql.NVarChar, ItemCode);
      request.input('BinLoacation', sql.NVarChar, BinLoacation);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Controller 1 - Update bin location based on Serial Number
  async updateMappedBarcodesBinLocationBySerialNo(req, res, next) {
    try {
      const { oldBinLocation, newBinLocation, serialNumber } = req.body;

      // Your validation logic here

      let request = pool2.request();
      request.input('oldBinLocation', sql.NVarChar, oldBinLocation);
      request.input('newBinLocation', sql.NVarChar, newBinLocation);
      request.input('serialNumber', sql.NVarChar, serialNumber);

      // Update bin location
      await request.query(`
          UPDATE dbo.tblMappedBarcodes
          SET BinLocation = @newBinLocation
          WHERE BinLocation = @oldBinLocation AND ItemSerialNo = @serialNumber
      `);

      res.status(200).send({ message: 'Bin location updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  },

  // Controller 2 - Update bin location based on Pallet Code
  async updateMappedBarcodesBinLocationByPalletCode(req, res, next) {
    try {
      const { oldBinLocation, newBinLocation, palletCode } = req.body;

      // Your validation logic here

      let request = pool2.request();
      request.input('oldBinLocation', sql.NVarChar, oldBinLocation);
      request.input('newBinLocation', sql.NVarChar, newBinLocation);
      request.input('palletCode', sql.NVarChar, palletCode);

      // Update bin location
      await request.query(`
          UPDATE dbo.tblMappedBarcodes
          SET BinLocation = @newBinLocation
          WHERE BinLocation = @oldBinLocation AND PalletCode = @palletCode
      `);

      res.status(200).send({ message: 'Bin location updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  }
  ,
  async getItemInfoByPalletCode(req, res, next) {
    try {
      const PalletCode = req.headers['palletcode']; // Get ItemSerialNo from headers
      console.log(PalletCode);
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE PalletCode = @PalletCode
      `;
      let request = pool2.request();
      request.input('PalletCode', sql.NVarChar(100), PalletCode);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async getMappedBarcodedsByPalletCodeAndBinLocation(req, res, next) {
    try {
      const PalletCode = req.headers['palletcode']; // Get ItemSerialNo from headers
      const BinLoacation = req.headers['binlocation']; // Get ItemSerialNo from headers
      let query = `
        SELECT * FROM dbo.tblMappedBarcodes
        WHERE PalletCode = @PalletCode
        AND BinLocation = @BinLoacation

      `;
      let request = pool2.request();
      request.input('PalletCode', sql.NVarChar(100), PalletCode);
      request.input('BinLoacation', sql.NVarChar, BinLoacation);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Item found for this Pallete and Bin location" });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async deleteTblMappedBarcodesDataByItemCode(req, res, next) {
    try {
      const itemCode = req.headers['itemcode'];
      if (!itemCode) {
        return res.status(400).send({ message: 'itemCode is required.' });
      }

      const query = `
      DELETE FROM dbo.tblMappedBarcodes
      WHERE ItemCode = @itemCode
    `;

      let request = pool2.request();
      request.input('itemCode', sql.VarChar(100), itemCode);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Item record not found.' });
      }

      res.status(200).send({ message: 'Data deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async getAllTblRZones(req, res, next) {

    try {
      const query = `
        SELECT * FROM dbo.tbl_RZONES
      `;
      const data = await pool1.query(query);
      res.status(200).send(data.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },



  // ------ tb_location_CL table conroller Start --------
  async validateZoneCode(req, res) {
    try {
      const zoneCode = req.query.ZONECODE;
      const palletCode = req.query.PALLETCODE;

      if (!zoneCode) {
        return res.status(400).send({ message: 'ZONECODE is required in the query.' });
      }

      if (!palletCode) {
        return res.status(400).send({ message: 'PALLETCODE is required in the query.' });
      }

      // Fetch data from tbl_locations_CL based on ZONE_CODE
      //   const query = `
      //   SELECT * FROM tbl_locations_CL
      //   WHERE ZONE_CODE = @ZoneCode
      // `;

      //   const result = await pool2.request()
      //     .input('ZoneCode', sql.NVarChar, zoneCode)
      //     .query(query);

      //   const locations = result.recordset;

      //   if (locations.length === 0) {
      //     return res.status(404).send({ message: 'ZoneCode not found in tbl_locations.' });
      //   }

      // Check if Zone_Code is matched in tbl_Shipment_Received_CL based on PalletCode
      //   const shipmentQuery = `
      //   SELECT * FROM tbl_Shipment_Received_CL
      //   WHERE RZONE = @ZoneCode AND PalletCode = @PalletCode
      // `;
      const shipmentQuery = `
      SELECT * FROM tbl_Shipment_Received_CL
      WHERE PalletCode = @PalletCode
  `;

      const shipmentResult = await pool2.request()
        .input('PalletCode', sql.NVarChar, palletCode)
        .query(shipmentQuery);

      const shipments = shipmentResult.recordset;

      if (shipments.length === 0) {
        return res.status(404).send({ message: 'Zone_Code and PalletCode not matched in tbl_Shipment_Received_CL.' });
      }

      res.status(200).send({
        message: "Zone_Code and PalletCode matched in tbl_Shipment_Received_CL.",
        locations, shipments
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  },




  async sendEmail(req, res, next) {
    const { to, subject, body } = req.body;
    const attachments = req.files;

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: userEmail,
          pass: userPassword,
        },
      });

      const mailOptions = {
        from: userEmail,
        to,
        subject,
        html: body,
        attachments: attachments.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      };

      const info = await transporter.sendMail(mailOptions);

      // Delete the uploaded files after sending the email
      attachments.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      res.status(200).send({ message: 'Email sent successfully', info });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ message: 'Error sending email', error });
    }
  },




  async insertTblTransferBinToBinCL(req, res, next) {
    try {
      // Extract the array of records from the request body.
      const records = req.body;

      // For each record in the array
      for (const record of records) {
        let request = new sql.Request(pool2);

        // Add input parameters for each field. If the field is not provided in the record, set it to null.
        request.input('TRANSFERID', sql.NVarChar, record.TRANSFERID || null);
        request.input('TRANSFERSTATUS', sql.Int, record.TRANSFERSTATUS || null);
        request.input('INVENTLOCATIONIDFROM', sql.NVarChar, record.INVENTLOCATIONIDFROM || null);
        request.input('INVENTLOCATIONIDTO', sql.NVarChar, record.INVENTLOCATIONIDTO || null);
        request.input('ITEMID', sql.NVarChar, record.ITEMID || null);
        request.input('QTYTRANSFER', sql.Int, record.QTYTRANSFER || null);
        request.input('QTYRECEIVED', sql.Int, record.QTYRECEIVED || null);
        request.input('CREATEDDATETIME', sql.DateTime, record.CREATEDDATETIME ? new Date(record.CREATEDDATETIME) : null);
        request.input('ItemCode', sql.VarChar, record.ItemCode || null);
        request.input('ItemDesc', sql.NVarChar, record.ItemDesc || null);
        request.input('GTIN', sql.VarChar, record.GTIN || null);
        request.input('Remarks', sql.VarChar, record.Remarks || null);
        request.input('User', sql.VarChar, record.User || null);
        request.input('Classification', sql.VarChar, record.Classification || null);
        request.input('MainLocation', sql.VarChar, record.MainLocation || null);
        request.input('BinLocation', sql.VarChar, record.BinLocation || null);
        request.input('IntCode', sql.VarChar, record.IntCode || null);
        request.input('ItemSerialNo', sql.VarChar, record.ItemSerialNo || null);
        request.input('MapDate', sql.Date, record.MapDate ? new Date(record.MapDate) : null);
        request.input('PalletCode', sql.VarChar, record.PalletCode || null);
        request.input('Reference', sql.VarChar, record.Reference || null);
        request.input('SID', sql.VarChar, record.SID || null);
        request.input('CID', sql.VarChar, record.CID || null);
        request.input('PO', sql.VarChar, record.PO || null);
        request.input('Trans', sql.Numeric, record.Trans || null);
        request.input('SELECTTYPE', sql.VarChar, record.SELECTTYPE || null);


        const query = `
            INSERT INTO dbo.tbl_TransferBinToBin_CL
            (TRANSFERID, TRANSFERSTATUS, INVENTLOCATIONIDFROM, INVENTLOCATIONIDTO, ITEMID, QTYTRANSFER, QTYRECEIVED, CREATEDDATETIME, ItemCode, ItemDesc, GTIN, Remarks, [User], Classification, MainLocation, BinLocation, IntCode, ItemSerialNo, MapDate, PalletCode, Reference, SID, CID, PO, Trans, SELECTTYPE) 
            VALUES
            (@TRANSFERID, @TRANSFERSTATUS, @INVENTLOCATIONIDFROM, @INVENTLOCATIONIDTO, @ITEMID, @QTYTRANSFER, @QTYRECEIVED, @CREATEDDATETIME, @ItemCode, @ItemDesc, @GTIN, @Remarks, @User, @Classification, @MainLocation, @BinLocation, @IntCode, @ItemSerialNo, @MapDate, @PalletCode, @Reference, @SID, @CID, @PO, @Trans, @SELECTTYPE)
            `;

        // Execute the query
        await request.query(query);

        // Update STOCKQTY in dbo.[tbl_Stock_Master] 
        const updateQuery = `
            UPDATE dbo.[tbl_Stock_Master]
            SET STOCKQTY = STOCKQTY + 1
            OUTPUT INSERTED.*
            WHERE ITEMID = @itemid
          `;

        const updateRequest = new sql.Request(pool2);
        updateRequest.input('itemid', sql.NVarChar(255), record.ITEMID);

        const updateResult = await updateRequest.query(updateQuery);

        if (updateResult.rowsAffected[0] === 0) {
          console.log('Item not found in tbl_Stock_Master, ITEMID: ' + record.ITEMID);
        }
        // Update BinLocation in dbo.[tblMappedBarcode]
        const updateBinLocationQuery = `
          UPDATE dbo.[tblMappedBarcodes]
          SET BinLocation = @binlocation
          WHERE ItemSerialNo = @itemserialno
`;

        const updateBinLocationRequest = new sql.Request(pool2);
        updateBinLocationRequest.input('binlocation', sql.VarChar, record.BinLocation);
        updateBinLocationRequest.input('itemserialno', sql.VarChar, record.ItemSerialNo);

        const updateBinLocationResult = await updateBinLocationRequest.query(updateBinLocationQuery);

        if (updateBinLocationResult.rowsAffected[0] === 0) {
          console.log('Serial number not found in tblMappedBarcodes, ItemSerialNo: ' + record.ItemSerialNo);
        }


      }

      // After all records are inserted, send a response.
      res.status(201).send({ message: 'Data inserted and updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },




  // -------------- tbl_TransferJournal START --------------

  async getAllTransferJournal(req, res, next) {
    try {

      const query = `
      SELECT * from dbo.Transfer_journal`;
      let request = pool1.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "no Item found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getTransferJournalCLByJournalId(req, res, next) {
    try {
      const { JournalID } = req.query
      let query = `
        SELECT * FROM dbo.Transfer_journal
        WHERE JOURNALID = @JournalID
      `;
      let request = pool1.request();
      request.input('JournalID', sql.NVarChar(50), JournalID);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },




  // ------ tbl_TransferJournal_CL END ------



  // -------------- tbl_Item-Master CONTROLLERS START --------------


  async updateTblItemMaster(req, res, next) {
    try {
      const fieldTypes = {
        SHIPMENTID: sql.NVarChar(255),
        CONTAINERID: sql.NVarChar(255),
        ARRIVALWAREHOUSE: sql.NVarChar(255),
        ITEMNAME: sql.NVarChar(255),
        ITEMID: sql.NVarChar(255),
        PURCHID: sql.NVarChar(255),
        CLASSIFICATION: sql.Float,
        SERIALNUM: sql.VarChar(100),
        RCVDCONFIGID: sql.VarChar(50),
        RCVD_DATE: sql.Date,
        GTIN: sql.VarChar(50),
        RZONE: sql.VarChar(50),
        PALLET_DATE: sql.Date,
        PALLETCODE: sql.VarChar(50),
        BIN: sql.VarChar(50),
        REMARKS: sql.NVarChar(255),
        POQTY: sql.Numeric(18, 0),
        RCVQTY: sql.Numeric(18, 0),
        REMAININGQTY: sql.Numeric(18, 0),
        USERID: sql.NChar(20),
        TRXDATETIME: sql.DateTime,
        TRANSFERID: sql.NVarChar(20),
        TRANSFERSTATUS: sql.Int,
        INVENTLOCATIONIDFROM: sql.NVarChar(10),
        INVENTLOCATIONIDTO: sql.NVarChar(10),
        QTYTRANSFER: sql.Numeric(18, 0),
        QTYRECEIVED: sql.Numeric(18, 0),
        CREATEDDATETIME: sql.DateTime,
        SELECTTYPE: sql.NVarChar(50)
      };

      const { itemid, ...fieldsToUpdate } = req.body;

      if (!itemid) {
        return res.status(400).send({ message: 'ITEMID is required.' });
      }

      let query = `UPDATE dbo.[tbl_Item_Master] SET `;
      const updateFields = [];
      const request = pool2.request();

      for (const field in fieldsToUpdate) {
        if (fieldsToUpdate[field] !== undefined && fieldTypes[field]) {
          updateFields.push(`${field} = @${field}`);
          request.input(field, fieldTypes[field], fieldsToUpdate[field]);
        }
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += ` OUTPUT INSERTED.* WHERE ITEMID = @itemid`;
      request.input('itemid', sql.NVarChar(255), itemid);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.', data: result.recordset[0] });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // async updateQtyReceivedInTblItemMaster(req, res, next) {
  //   try {
  //     const { itemid, qty } = req.body;

  //     if (!itemid) {
  //       return res.status(400).send({ message: 'ITEMID is required.' });
  //     }
  //     if (qty === undefined) {
  //       return res.status(400).send({ message: 'qty is required.' });
  //     }

  //     const query = `
  //       UPDATE dbo.[tbl_Item_Master]
  //       SET QTYRECEIVED = QTYRECEIVED + @qty
  //       OUTPUT INSERTED.*
  //       WHERE ITEMID = @itemid
  //     `;

  //     const request = pool2.request();
  //     request.input('itemid', sql.NVarChar(255), itemid);
  //     request.input('qty', sql.Numeric(18, 0), qty);

  //     const result = await request.query(query);

  //     if (result.rowsAffected[0] === 0) {
  //       return res.status(404).send({ message: 'Data not found.' });
  //     }

  //     res.status(200).send({ message: 'Data updated successfully.', data: result.recordset[0] });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ message: error.message });
  //   }
  // },

  async updateQtyReceivedInTblStockMaster(req, res, next) {
    try {
      const { itemid, qty } = req.body;

      if (!itemid) {
        return res.status(400).send({ message: 'ITEMID is required.' });
      }
      if (qty === undefined) {
        return res.status(400).send({ message: 'qty is required.' });
      }

      const query = `
        UPDATE dbo.[tbl_Stock_Master]
        SET STOCKQTY = STOCKQTY + @qty
        OUTPUT INSERTED.*
        WHERE ITEMID = @itemid
      `;

      const request = pool2.request();
      request.input('itemid', sql.NVarChar(255), itemid);
      request.input('qty', sql.Numeric(18, 0), qty);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Data not found.' });
      }

      res.status(200).send({ message: 'Data updated successfully.', data: result.recordset[0] });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // --- tbl_Stock_Master Controller --- //


  async getAllTblStockMaster(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Stock_Master
      `;
      let request = pool2.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },

  async getTblStockMasterByItemId(req, res, next) {

    try {

      const { itemid } = req.query;
      if (!itemid) {
        return res.status(400).send({ message: "Please provide itemid." });
      }

      let query = `
      SELECT * FROM dbo.tbl_Stock_Master
      WHERE ITEMID=@ITEMID
      `;
      let request = pool2.request();
      request.input('ITEMID', sql.NVarChar, itemid);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "N0 data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },

  async insertStockMasterData(req, res, next) {
    try {
      const stockMasterDataArray = req.body;
      if (stockMasterDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < stockMasterDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          ITEMGROUPID,
          GROUPNAME,
        } = stockMasterDataArray[i];

        // Check if a record already exists
        let checkQuery = `
          SELECT * FROM [WBSSQL].[dbo].[tbl_Stock_Master] 
          WHERE ITEMID = @ITEMID
        `;
        let checkRequest = pool1.request();
        checkRequest.input('ITEMID', sql.NVarChar, ITEMID);
        let checkData = await checkRequest.query(checkQuery);

        if (checkData.recordsets[0].length > 0) {
          throw new Error(`Record already exists for ITEMID: ${ITEMID}`);
        }

        // Dynamic SQL query construction
        let fields = [
          "ITEMID",
          "ITEMNAME",
          "ITEMGROUPID",
          "GROUPNAME",
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[tbl_Stock_Master]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('ITEMGROUPID', sql.NVarChar, ITEMGROUPID);
        request.input('GROUPNAME', sql.NVarChar, GROUPNAME);

        await request.query(query);
      }
      return res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  async updateStockMasterData(req, res, next) {
    try {
      const {
        ITEMID,
        ITEMNAME,
        ITEMGROUPID,
        GROUPNAME,
      } = req.body;
      console.log(req.query);

      if (!ITEMID) {
        return res.status(400).send({ message: 'ITEMID is required.' });
      }

      let query = `
      UPDATE dbo.tbl_Stock_Master
      SET `;

      const updateFields = [];
      const request = pool2.request();

      if (ITEMNAME !== undefined) {
        updateFields.push('ITEMNAME = @ITEMNAME');
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      }

      if (ITEMGROUPID !== undefined) {
        updateFields.push('ITEMGROUPID = @ITEMGROUPID');
        request.input('ITEMGROUPID', sql.NVarChar, ITEMGROUPID);
      }

      if (GROUPNAME !== undefined) {
        updateFields.push('GROUPNAME = @GROUPNAME');
        request.input('GROUPNAME', sql.NVarChar, GROUPNAME);
      }

      if (updateFields.length === 0) {
        return res.status(400).send({ message: 'At least one field is required to update.' });
      }

      query += updateFields.join(', ');

      query += `
      WHERE ITEMID = @ITEMID
    `;

      request.input('ITEMID', sql.NVarChar, ITEMID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Stock Master record not found.' });
      }

      res.status(200).send({ message: 'Stock Master data updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async deleteStockMasterDataByItemId(req, res, next) {
    try {
      const { ITEMID } = req.query;

      if (!ITEMID) {
        return res.status(400).send({ message: 'ITEMID is required.' });
      }

      let query = ` DELETE FROM dbo.tbl_Stock_Master WHERE ITEMID = @ITEMID `;
      let request = pool2.request();

      request.input('ITEMID', sql.NVarChar, ITEMID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Stock Master record not found.' });
      }

      return res.status(200).send({ message: 'Stock Master data deleted successfully.' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },



  async manageItemsReallocation(req, res, next) {
    try {
      const { availablePallet, serialNumber, selectionType } = req.body;

      if (!availablePallet || !serialNumber || !selectionType) {
        return res.status(400).send({ message: 'Available pallet, serial number, and selection type are required.' });
      }

      const request = pool2.request();
      request.input('serialNumber', sql.NVarChar(255), serialNumber);
      request.input('availablePallet', sql.NVarChar(255), availablePallet); // Declare availablePallet

      let result;

      if (selectionType.toLowerCase() === 'allocation') {
        // Check if the serial number exists in the mapped barcodes table
        result = await request.query(`SELECT * FROM tblMappedBarcodes WHERE ItemSerialNo = @serialNumber`);

        if (result.recordset.length === 0) {
          return res.status(400).send({ message: 'Serial number not found.' });
        }

        if (result.recordset[0].PalletCode === availablePallet) {
          return res.status(400).send({ message: 'Pallet code is the same as available pallet.' });
        }

        // Update the pallet code in the mapped barcodes table
        await request.query(`UPDATE tblMappedBarcodes SET PalletCode = @availablePallet WHERE ItemSerialNo = @serialNumber`);

        return res.status(200).send({ message: 'Allocation updated successfully.', updatedRecord: result.recordset[0] });
      }

      if (selectionType.toLowerCase() === 'picking') {
        // Check if the serial number exists in the mapped barcodes table
        result = await request.query(`SELECT * FROM tblMappedBarcodes WHERE ItemSerialNo = @serialNumber`);

        if (result.recordset.length === 0) {
          return res.status(400).send({ message: 'Serial number not found.' });
        }

        if (result.recordset[0].PalletCode !== availablePallet) {
          return res.status(400).send({ message: 'Item is not on the available pallet.' });
        }

        // Insert into the ItemsReAllocationPicked table
        await request.query(`INSERT INTO tbl_ItemsReAllocationPicked SELECT * FROM tblMappedBarcodes WHERE ItemSerialNo = @serialNumber`);

        // Delete from the mapped barcodes table
        await request.query(`DELETE FROM tblMappedBarcodes WHERE ItemSerialNo = @serialNumber`);

        return res.status(200).send({ message: 'Serial updated successfully.', updatedRecord: result.recordset[0] });
      }

      return res.status(400).send({ message: 'Invalid selection type. Please select either "allocation" or "serial".' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  }
  ,
  async getStockMasterDataByItemId(req, res, next) {

    try {
      const { ITEMID } = req.query;

      if (!ITEMID) {
        return res.status(400).send({ message: "ITEMID is required." });
      }

      const query = `
        SELECT * FROM dbo.InventTableWMS
        WHERE ITEMID = @ITEMID
      `;
      let request = pool1.request();
      request.input('ITEMID', sql.NVarChar, ITEMID);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },






  // ---------tbl_ItemsReAllocationPicked ------------
  async getAllItemsReAllocationPicked(req, res, next) {
    try {

      const query = `
      SELECT * from tbl_ItemsReAllocationPicked`;
      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "no Item found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getAllTransferBinToBinCL(req, res, next) {
    try {

      const query = `
      SELECT *
      FROM tbl_TransferBinToBin_CL
      `;
      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "no Item found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  // ----- WMS_Sales_PickingList_CL Controller Start  -----
  // from Alessia Table
  async getAllWmsSalesPickingListClFromAlessia(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.WMS_Sales_PickingList
      `;
      let request = pool1.request();
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record available" });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },


  // from WBS Table
  async getAllWmsSalesPickingListClFromWBS(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.WMS_Sales_PickingList_CL
      WHERE ASSIGNEDTOUSERID=@ASSIGNEDTOUSERID
      
      `;
      let request = pool2.request();
      request.input('ASSIGNEDTOUSERID', sql.NVarChar, req?.token?.UserID);
      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record available" });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },
  //PICKINGROUTEID and userId
  async getAllWmsSalesPickingListClFromWBSByPickingRouteId(req, res, next) {
    try {
      const { PICKINGROUTEID } = req.query;
      if (!PICKINGROUTEID) {
        return res.status(400).send({ message: "Please provide data to insert" });
      }
      console.log(req?.token)
      console.log(req?.token?.UserID)

      let query = `
      SELECT * FROM dbo.WMS_Sales_PickingList_CL
      WHERE PICKINGROUTEID = @PICKINGROUTEID AND ASSIGNEDTOUSERID =@userId
      AND PICKSTATUS = 'Partial'
      `;

      let request = pool2.request();
      request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID)
      request.input('userId', sql.NVarChar, req.token?.UserID)

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record available" });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },




  // to inert into wbs
  async insertPickingListDataCLIntoWBS(req, res, next) {
    try {
      const pickingListDataArray = req.body;
      if (pickingListDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < pickingListDataArray.length; i++) {
        const {
          PICKINGROUTEID,
          INVENTLOCATIONID,
          CONFIGID,
          ITEMID,
          ITEMNAME,
          QTY,
          CUSTOMER,
          DLVDATE,
          TRANSREFID,
          EXPEDITIONSTATUS,
          ASSIGNEDTOUSERID,
          PICKSTATUS,
          QTYPICKED,
        } = pickingListDataArray[i];

        // Check if a record already exists
        let checkQuery = `
          SELECT * FROM [WBSSQL].[dbo].[WMS_Sales_PickingList_CL] 
          WHERE PICKINGROUTEID = @PICKINGROUTEID AND ASSIGNEDTOUSERID = @ASSIGNEDTOUSERID AND ITEMID =@ITEMID
        `;
        let checkRequest = pool1.request();
        checkRequest.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);
        checkRequest.input('ASSIGNEDTOUSERID', sql.NVarChar, ASSIGNEDTOUSERID);
        checkRequest.input('ITEMID', sql.NVarChar, ITEMID);
        let checkData = await checkRequest.query(checkQuery);

        if (checkData.recordsets[0].length > 0) {
          return res.status(400).send({ message: `Record already exists for PICKINGROUTEID: ${PICKINGROUTEID}, ASSIGNEDTOUSERID: ${ASSIGNEDTOUSERID} and ITEMID: ${ITEMID}` })
        }

        // Dynamic SQL query construction
        let fields = [
          "PICKINGROUTEID",
          "ITEMID",
          "QTY",
          "CUSTOMER",
          ...(INVENTLOCATIONID ? ['INVENTLOCATIONID'] : []),
          ...(CONFIGID ? ['CONFIGID'] : []),
          ...(ITEMNAME ? ['ITEMNAME'] : []),
          ...(DLVDATE ? ['DLVDATE'] : []),
          ...(TRANSREFID ? ['TRANSREFID'] : []),
          ...(EXPEDITIONSTATUS !== undefined ? ['EXPEDITIONSTATUS'] : []),
          ...(ASSIGNEDTOUSERID ? ['ASSIGNEDTOUSERID'] : []),
          ...(PICKSTATUS ? ['PICKSTATUS'] : []),
          ...(QTYPICKED ? ['QTYPICKED'] : []),
          "DATETIMEASSIGNED"
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Sales_PickingList_CL]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('QTY', sql.Float, QTY);
        request.input('CUSTOMER', sql.NVarChar, CUSTOMER);
        if (INVENTLOCATIONID) request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        if (CONFIGID) request.input('CONFIGID', sql.NVarChar, CONFIGID);
        if (ITEMNAME) request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        if (DLVDATE) request.input('DLVDATE', sql.Date, new Date(DLVDATE));
        if (TRANSREFID) request.input('TRANSREFID', sql.NVarChar, TRANSREFID);
        if (EXPEDITIONSTATUS !== undefined) request.input('EXPEDITIONSTATUS', sql.Int, EXPEDITIONSTATUS);
        if (ASSIGNEDTOUSERID) request.input('ASSIGNEDTOUSERID', sql.NVarChar, ASSIGNEDTOUSERID);
        if (PICKSTATUS) request.input('PICKSTATUS', sql.NVarChar, PICKSTATUS);
        if (QTYPICKED) request.input('QTYPICKED', sql.Float, QTYPICKED);

        // Add the current date and time to the input parameters.
        const currentDateTime = new Date();
        request.input('DATETIMEASSIGNED', sql.DateTime, currentDateTime);

        await request.query(query);
      }
      return res.status(201).send({ message: 'Picklist assigned to user successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },




  // packingsliptable_CL controller starts here


  async insertIntoPackingSlipTableClAndUpdateWmsSalesPickingListCl(req, res, next) {
    try {
      let PICKSTATUS;
      const packingSlipArray = req.body;
      const { PICKINGROUTEID, ITEMID, QTYPICKED, QTY } = req.query; // no need of this itemid now
      if (packingSlipArray.length === 0) {
        return res.status(400).send({ message: "No data available" });
      }

      let updateQty = QTY;
      let updateQtyPicked = QTYPICKED;

      for (const packingSlip of packingSlipArray) {

        if (!packingSlip.INVENTLOCATIONID && !packingSlip.ITEMID) {
          return res.status(400).send({ message: "Please provide INVENTLOCATIONID and ITEMID" });
        }


        const fields = [
          "INVENTLOCATIONID",
          "ORDERED",
          "PACKINGSLIPID",
          "ASSIGNEDUSERID",
          "ITEMID",
          ...(packingSlip.SALESID ? ["SALESID"] : []),
          ...(packingSlip.NAME ? ["NAME"] : []),
          ...(packingSlip.CONFIGID ? ["CONFIGID"] : []),
          ...(packingSlip.VEHICLESHIPPLATENUMBER ? ["VEHICLESHIPPLATENUMBER"] : []),
          ...(packingSlip.DATETIMECREATED ? ["DATETIMECREATED"] : []),
        ];

        let values = fields.map((field) => "@" + field);

        let query = `INSERT  INTO packingsliptable_CL 
        (${fields.join(', ')}) 
        VALUES 
          (${values.join(', ')})
        `;

        let request = pool2.request();

        request.input("INVENTLOCATIONID", sql.NVarChar, packingSlip.INVENTLOCATIONID);
        request.input("ORDERED", sql.Float, packingSlip.ORDERED);
        request.input("PACKINGSLIPID", sql.NVarChar, packingSlip.PACKINGSLIPID);
        request.input("ASSIGNEDUSERID", sql.NVarChar, packingSlip.ASSIGNEDUSERID);
        request.input("ITEMID", sql.NVarChar, packingSlip.ITEMID.trim());
        if (packingSlip.SALESID) request.input("SALESID", sql.NVarChar, packingSlip.SALESID);
        if (packingSlip.NAME) request.input("NAME", sql.NVarChar, packingSlip.NAME);
        if (packingSlip.CONFIGID) request.input("CONFIGID", sql.NVarChar, packingSlip.CONFIGID);
        if (packingSlip.VEHICLESHIPPLATENUMBER) request.input("VEHICLESHIPPLATENUMBER", sql.NVarChar, packingSlip.VEHICLESHIPPLATENUMBER);
        if (packingSlip.DATETIMECREATED) request.input("DATETIMECREATED", sql.DateTime, new Date(packingSlip.DATETIMECREATED));

        await request.query(query);

        let deleteQuery = `DELETE FROM tblMappedBarcodes WHERE ItemCode=@ITEMID AND BinLocation=@oldBinLocation AND ItemSerialNo = @ItemSerialNo`;

        let deleteRequest = pool2.request();
        deleteRequest.input("ITEMID", sql.NVarChar, packingSlip?.ITEMID.trim());
        deleteRequest.input("oldBinLocation", sql.NVarChar, packingSlip?.oldBinLocation);
        deleteRequest.input("ItemSerialNo", sql.NVarChar, packingSlip?.ItemSerialNo);

        await deleteRequest.query(deleteQuery);





        PICKSTATUS = updateQty == updateQtyPicked ? 'Picked' : 'Partial';
        // check if status is already picked
        const check = pool2.request()
        let checkQuery = `SELECT * FROM WMS_Sales_PickingList_CL WHERE PICKINGROUTEID = @CHECKPICKINGROUTEID AND ITEMID = @checkItemId AND PICKSTATUS = 'Picked' AND ASSIGNEDTOUSERID = @USERID`;
        check.input("CHECKPICKINGROUTEID", sql.NVarChar, PICKINGROUTEID);
        check.input("checkItemId", sql.NVarChar, packingSlip.ITEMID.trim());
        check.input("USERID", sql.NVarChar, req.token?.UserID)
        const checkResult = await check.query(checkQuery);
        if (checkResult.recordset.length > 0) {
          return res.status(400).send({ message: `Item with ITEMID ${packingSlip.ITEMID.trim()} is already picked` });
        }



        let checkQuery2 = `SELECT QTYPICKED, PICKSTATUS, QTY
                  FROM WMS_Sales_PickingList_CL
                  WHERE PICKINGROUTEID = @PICKINGROUTEID
                  AND ITEMID = @singleitemId AND ASSIGNEDTOUSERID = @USERID`;


        let updateQuery = `UPDATE WMS_Sales_PickingList_CL 
                  SET PICKSTATUS = CASE
                                    WHEN QTY = QTYPICKED THEN 'Picked'
                                    ELSE 'Partial'
                                  END,
                      QTYPICKED = CASE
                                    WHEN QTY = QTYPICKED THEN QTYPICKED
                                    ELSE ISNULL(QTYPICKED, 0) + 1
                                  END,
                      QTY = CASE 
                              WHEN QTY = QTYPICKED THEN QTY 
                              ELSE QTY - 1
                            END
                  WHERE PICKINGROUTEID = @PICKINGROUTEID 
                  AND ITEMID = @singleitemId 
                  AND ASSIGNEDTOUSERID = @USERID`;

        let request2 = pool2.request();
        request2.input("PICKINGROUTEID", sql.NVarChar, PICKINGROUTEID);
        request2.input("singleitemId", sql.NVarChar, packingSlip.ITEMID.trim());
        request2.input("USERID", sql.NVarChar, req.token?.UserID);

        request2.query(updateQuery, async (error, result) => {
          if (error) {
            // Handle the error
            console.error(error);
            return;
          }

          // Retrieve the updated values
          const checkResult = await request2.query(checkQuery2);
          const updatedQTYPICKED = checkResult.recordset[0].QTYPICKED;
          const updatedQTY = checkResult.recordset[0].QTY;
          console.log(checkResult.recordset[0])

          // Determine the updated PICKSTATUS
          const updatedPICKSTATUS = (updatedQTY == updatedQTYPICKED) ? 'Picked' : 'Partial';

          console.log("updatedPICKSTATUS" + " " + updatedPICKSTATUS + " " + "updatedQTY" + " " + updatedQTY + " " + "updatedqtypic" + " " + updatedQTYPICKED)
          // Update the PICKSTATUS in the database
          let updateStatusQuery = `UPDATE WMS_Sales_PickingList_CL
                          SET PICKSTATUS = @updatedPICKSTATUS
                          WHERE PICKINGROUTEID = @PICKINGROUTEID
                          AND ITEMID = @singleitemId
                          AND ASSIGNEDTOUSERID = @USERID`;

          let request3 = pool2.request();
          request3.input("updatedPICKSTATUS", sql.NVarChar, updatedPICKSTATUS);
          request3.input("PICKINGROUTEID", sql.NVarChar, PICKINGROUTEID);
          request3.input("singleitemId", sql.NVarChar, packingSlip.ITEMID.trim());
          request3.input("USERID", sql.NVarChar, req.token?.UserID);

          request3.query(updateStatusQuery, (error, result) => {
            if (error) {
              // Handle the error
              console.error(error);
              return;
            }

            console.log('Update successful.');
          });
        });




      };




      return res.status(201).send({ message: 'Data inserted successfully.' });

    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },





  async getPackingSlipTableByPackingSlipId(req, res, next) {
    try {
      const { packingSlipId } = req.query;

      if (!packingSlipId) {
        return res.status(400).send({ message: "packingSlipId is required" });
      }

      const query = `SELECT * FROM packingsliptable WHERE PACKINGSLIPID = @packingSlipId`;


      let request = pool1.request();
      request.input('packingSlipId', sql.NVarChar, packingSlipId)

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record available" });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });


    }
  },



  async insertIntoPackingSlipTableCl(req, res, next) {
    try {
      const packingSlipArray = req.body;
      console.log(req?.token);

      // Get VEHICLESHIPPLATENUMBER from query parameters
      const { vehicleShipPlateNumber } = req.query;

      if (!vehicleShipPlateNumber) {
        return res.status(400).send({ message: "vehicleShipPlateNumber is required" });
      }


      // Check if VEHICLESHIPPLATENUMBER is present in packingsliptable in pool1
      const checkVehicle = pool2.request();
      checkVehicle.input('vehicleShipPlateNumber', sql.NVarChar, vehicleShipPlateNumber)
      const vehicleResult = await checkVehicle.query(`SELECT TOP 1 PlateNo FROM WMS_TruckMaster WHERE PlateNo =@vehicleShipPlateNumber`);

      if (vehicleResult.recordset.length === 0) {
        return res.status(400).send({ message: 'VEHICLESHIPPLATENUMBER not found in the database' })
      }

      for (const packingSlip of packingSlipArray) {
        const fields = [
          "INVENTLOCATIONID",
          "ORDERED",
          "PACKINGSLIPID",
          "ASSIGNEDUSERID",
          ...(packingSlip.SALESID ? ["SALESID"] : []),
          ...(packingSlip.ITEMID ? ["ITEMID"] : []),
          ...(packingSlip.NAME ? ["NAME"] : []),
          ...(packingSlip.CONFIGID ? ["CONFIGID"] : []),
          "VEHICLESHIPPLATENUMBER",
          "DATETIMECREATED",
        ];

        let values = fields.map((field) => "@" + field);

        let query = `INSERT  INTO packingsliptable_CL 
            (${fields.join(', ')}) 
            VALUES 
              (${values.join(', ')})
            `;

        let request = pool2.request();

        request.input("INVENTLOCATIONID", sql.NVarChar, packingSlip.INVENTLOCATIONID);
        request.input("ORDERED", sql.Float, packingSlip.ORDERED);
        request.input("PACKINGSLIPID", sql.NVarChar, packingSlip.PACKINGSLIPID);
        request.input("ASSIGNEDUSERID", sql.NVarChar, req?.token?.UserID);
        if (packingSlip.SALESID) request.input("SALESID", sql.NVarChar, packingSlip.SALESID);
        if (packingSlip.ITEMID) request.input("ITEMID", sql.NVarChar, packingSlip.ITEMID);
        if (packingSlip.NAME) request.input("NAME", sql.NVarChar, packingSlip.NAME);
        if (packingSlip.CONFIGID) request.input("CONFIGID", sql.NVarChar, packingSlip.CONFIGID);
        request.input("VEHICLESHIPPLATENUMBER", sql.NVarChar, vehicleShipPlateNumber);
        request.input("DATETIMECREATED", sql.DateTime, new Date());

        await request.query(query);
      }

      return res.status(201).send({ message: 'Data inserted successfully.' });

    } catch (error) {
      return res.status(500).send({ message: error.message });
    }

  },


  // WMS_ReturnSalesOrder Controller  Start -----

  async getAllWmsReturnSalesOrder(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_ReturnSalesOrder `

      let request = pool1.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getWmsReturnSalesOrderByReturnItemNum(req, res, next) {

    try {
      const { RETURNITEMNUM } = req.query;

      if (!RETURNITEMNUM) {
        return res.status(400).send({ message: "RETURNITEMNUM is required." });
      }

      let query = `SELECT * FROM WMS_ReturnSalesOrder WHERE
       RETURNITEMNUM = @RETURNITEMNUM`

      let request = pool1.request();
      request.input('RETURNITEMNUM', sql.NVarChar, RETURNITEMNUM);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  // WMS_ReturnSalesOrder Controller  END ------- 




  // WMS_Journal_ProfitLost Controller Start -----

  async getAllWmsJournalProfitLost(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_ProfitLost `

      let request = pool1.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },



  // WMS_Journal_Movement Controller Start -----

  async getAllWmsJournalMovement(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Movement `

      let request = pool1.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  // WMS_Journal_Counting Controller Start -----

  async getAllWmsJournalCounting(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Counting `

      let request = pool1.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },






  // WMS_ReturnSalesOrder_CL Controller Start -----


  async getAllWmsReturnSalesOrderCl(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_ReturnSalesOrder_CL `

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getWmsReturnSalesOrderClByAssignedToUserId(req, res, next) {
    try {
      const AssignedToUserId = req?.token?.UserID;
      if (!AssignedToUserId) {
        return res.status(401).send({ message: "AssignedToUserId is required." });
      }
      let query = `SELECT * FROM WMS_ReturnSalesOrder_CL WHERE

      ASSIGNEDTOUSERID = @AssignedToUserId`

      let request = pool2.request();
      request.input('AssignedToUserId', sql.NVarChar, AssignedToUserId);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  async insertIntoWmsReturnSalesOrderCl(req, res, next) {
    try {
      const returnSalesOrderArray = req.body;
      let currentDateTime = new Date();

      for (const returnSalesOrder of returnSalesOrderArray) {
        let query = `INSERT INTO WMS_ReturnSalesOrder_CL
          ([ITEMID], [NAME], [EXPECTEDRETQTY], [SALESID], [RETURNITEMNUM],
          [INVENTSITEID], [INVENTLOCATIONID], [CONFIGID], [WMSLOCATIONID],
          [TRXDATETIME], [TRXUSERID], [ITEMSERIALNO], [ASSIGNEDTOUSERID])
          VALUES
          (@ITEMID, @NAME, @EXPECTEDRETQTY, @SALESID, @RETURNITEMNUM,
          @INVENTSITEID, @INVENTLOCATIONID, @CONFIGID, @WMSLOCATIONID,
          @TRXDATETIME, @TRXUSERID, @ITEMSERIALNO, @ASSIGNEDTOUSERID)`;

        let request = pool2.request();


        request.input("ITEMID", sql.NVarChar, returnSalesOrder.ITEMID);
        request.input("NAME", sql.NVarChar, returnSalesOrder.NAME);
        request.input("EXPECTEDRETQTY", sql.Float, returnSalesOrder.EXPECTEDRETQTY);
        request.input("SALESID", sql.NVarChar, returnSalesOrder.SALESID);
        request.input("RETURNITEMNUM", sql.NVarChar, returnSalesOrder.RETURNITEMNUM);
        request.input("INVENTSITEID", sql.NVarChar, returnSalesOrder.INVENTSITEID);
        request.input("INVENTLOCATIONID", sql.NVarChar, returnSalesOrder.INVENTLOCATIONID);
        request.input("CONFIGID", sql.NVarChar, returnSalesOrder.CONFIGID);
        request.input("WMSLOCATIONID", sql.NVarChar, returnSalesOrder.WMSLOCATIONID);
        request.input("TRXDATETIME", sql.DateTime, currentDateTime);
        request.input("TRXUSERID", sql.NVarChar, req?.token?.UserID);
        request.input("ITEMSERIALNO", sql.VarChar, returnSalesOrder.ITEMSERIALNO);
        // request.input("ASSIGNEDTOUSERID", sql.NVarChar, returnSalesOrder.ASSIGNEDTOUSERID);
        request.input("ASSIGNEDTOUSERID", sql.NVarChar, req?.token?.UserID);

        await request.query(query);
      }

      return res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },


  async generateBarcodeForRma(req, res, next) {
    try {

      const { RETURNITEMNUM, ITEMID, MODELNO } = req.body;
      // Fetch the last SSCC_AutoCounter from TblSysNo using pool2
      const query = `
      SELECT TOP 1 SSCC_AutoCounter AS LastSSCCAutoCounter FROM TblSysNo ORDER BY SSCC_AutoCounter DESC
    `;


      const result = await pool2.request().query(query);
      let SSCC_AutoCounter = result.recordset[0].LastSSCCAutoCounter;

      // If there is no number in SSCC_AutoCounter, use 1 as the starting counter
      if (!SSCC_AutoCounter) {
        SSCC_AutoCounter = 1;
      } else {
        SSCC_AutoCounter = parseInt(SSCC_AutoCounter) + 1;
      }
      //logic for code here

      let RMASERIALNO = RETURNITEMNUM + "-" + ITEMID + "-" + MODELNO + "-" + SSCC_AutoCounter;


      // Update or insert SSCC_AutoCounter in TblSysNo
      const updateTblSysNoQuery = `
       IF EXISTS (SELECT * FROM TblSysNo)
       BEGIN
         UPDATE TblSysNo SET SSCC_AutoCounter = @SSCC_AutoCounter
       END
       ELSE
       BEGIN
         INSERT INTO TblSysNo (SSCC_AutoCounter) VALUES (1)
       END
     `;

      await pool2.request()
        .input('SSCC_AutoCounter', sql.Int, SSCC_AutoCounter)
        .query(updateTblSysNoQuery);

      res.status(200).send({ RMASERIALNO });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  },



  //  ---------- WMS_Journal_Movement_CL Controller Start ----------


  async insertJournalMovementCLData(req, res, next) {
    try {
      const journalMovementDataArray = req.body;
      if (journalMovementDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < journalMovementDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          QTY,
          LEDGERACCOUNTIDOFFSET,
          JOURNALID,
          TRANSDATE,
          INVENTSITEID,
          INVENTLOCATIONID,
          CONFIGID,
          WMSLOCATIONID,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          ITEMSERIALNO,
          QTYSCANNED,
          QTYDIFFERENCE
        } = journalMovementDataArray[i];

        // Dynamic SQL query construction
        let fields = [
          "ITEMID",
          "ITEMNAME",
          "QTY",
          "LEDGERACCOUNTIDOFFSET",
          "JOURNALID",
          "TRANSDATE",
          "INVENTSITEID",
          "INVENTLOCATIONID",
          "CONFIGID",
          "WMSLOCATIONID",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "ITEMSERIALNO",
          "QTYSCANNED",
          "QTYDIFFERENCE"
        ];


        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_Movement_CL]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('QTY', sql.Float, QTY);
        request.input('LEDGERACCOUNTIDOFFSET', sql.NVarChar, LEDGERACCOUNTIDOFFSET);
        request.input('JOURNALID', sql.NVarChar, JOURNALID);
        request.input('TRANSDATE', sql.Date, TRANSDATE);
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
        request.input('TRXDATETIME', sql.DateTime, new Date());
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, req?.token?.UserID);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted into WMS_Journal_Movement_CL successfully' });

    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },


  async getAllWmsJournalMovementCl(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Movement_CL`

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async getAllWmsJournalCountingCL(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Counting_CL `

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  async getWmsJournalMovementClByAssignedToUserId(req, res, next) {
    try {
      const TRXUSERIDASSIGNED = req?.token?.UserID;
      if (!TRXUSERIDASSIGNED) {
        return res.status(401).send({ message: "TRXUSERIDASSIGNED is required." });
      }
      let query = `SELECT * FROM WMS_Journal_Movement_CL WHERE

      TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED`

      let request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async updateWmsJournalMovementClQtyScanned(req, res, next) {
    try {
      const { ITEMID, JOURNALID, TRXUSERIDASSIGNED } = req.body;
      // const { ITEMID, ITEMSERIALNO } = req.body;

      // Update QTYSCANNED and decrease QTYDIFFERENCE using parameterized query
      let updateQtyQuery = `
        UPDATE [WBSSQL].[dbo].[WMS_Journal_Movement_CL]
        SET QTYSCANNED = ISNULL(QTYSCANNED,0) + 1,
            QTYDIFFERENCE = QTY - (ISNULL(QTYSCANNED,0) + 1)
        OUTPUT inserted.* -- Include this line to return the updated row
        WHERE ITEMID = @ITEMID AND JOURNALID = @JOURNALID AND TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
      `;

      let request = pool2.request();
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('JOURNALID', sql.NVarChar, JOURNALID);
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      // request.input('ITEMSERIALNO', ITEMSERIALNO);

      // Execute the update query
      let result = await request.query(updateQtyQuery);

      // Access the updated row from the result object
      const updatedRow = result.recordset[0];

      return res.status(200).send({ message: "Quantity updated successfully.", updatedRow });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },


  //  ---------- WMS_Journal_Movement_CLDets Controller Start ----------




  async getAllWmsJournalMovementClDets(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Movement_CLDets`

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  async insertJournalMovementCLDets(req, res, next) {
    try {
      const journalMovementDataArray = req.body;

      if (!Array.isArray(journalMovementDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (journalMovementDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }



      for (let i = 0; i < journalMovementDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          QTY,
          LEDGERACCOUNTIDOFFSET,
          JOURNALID,
          TRANSDATE,
          INVENTSITEID,
          INVENTLOCATIONID,
          CONFIGID,
          WMSLOCATIONID,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          ITEMSERIALNO,
          QTYSCANNED,
          QTYDIFFERENCE
        } = journalMovementDataArray[i];

        // Dynamic SQL query construction
        let fields = [
          "ITEMID",
          "ITEMNAME",
          "QTY",
          "LEDGERACCOUNTIDOFFSET",
          "JOURNALID",
          "TRANSDATE",
          "INVENTSITEID",
          "INVENTLOCATIONID",
          "CONFIGID",
          "WMSLOCATIONID",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "ITEMSERIALNO",
          "QTYSCANNED",
          "QTYDIFFERENCE"
        ];


        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_Movement_CLDets]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('QTY', sql.Float, QTY);
        request.input('LEDGERACCOUNTIDOFFSET', sql.NVarChar, LEDGERACCOUNTIDOFFSET);
        request.input('JOURNALID', sql.NVarChar, JOURNALID);
        request.input('TRANSDATE', sql.Date, TRANSDATE);
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
        request.input('TRXDATETIME', sql.DateTime, new Date());
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, TRXUSERIDASSIGNEDBY);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });

    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },



  // ---------- WMS_Journal_ProfitLost_CL Controller Start ----------

  async insertJournalProfitLostCL(req, res, next) {
    try {
      const journalProfitLostDataArray = req.body;

      if (!Array.isArray(journalProfitLostDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (journalProfitLostDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < journalProfitLostDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          QTY,
          JOURNALID,
          TRANSDATE,
          INVENTSITEID,
          INVENTLOCATIONID,
          CONFIGID,
          WMSLOCATIONID,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          ITEMSERIALNO,
          QTYSCANNED,
          QTYDIFFERENCE
        } = journalProfitLostDataArray[i];

        let fields = [
          "ITEMID",
          "ITEMNAME",
          "QTY",
          "JOURNALID",
          "TRANSDATE",
          "INVENTSITEID",
          "INVENTLOCATIONID",
          "CONFIGID",
          "WMSLOCATIONID",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "ITEMSERIALNO",
          "QTYSCANNED",
          "QTYDIFFERENCE"
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_ProfitLost_CL]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('QTY', sql.Float, QTY);
        request.input('JOURNALID', sql.NVarChar, JOURNALID);
        request.input('TRANSDATE', sql.Date, TRANSDATE);
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
        request.input('TRXDATETIME', sql.DateTime, new Date());
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, req?.token?.UserID);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },


  async getAllWmsJournalProfitLostCL(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_ProfitLost_CL`

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },



  async getWmsJournalProfitLostCLByAssignedToUserId(req, res, next) {
    try {
      const TRXUSERIDASSIGNED = req?.token?.UserID;
      if (!TRXUSERIDASSIGNED) {
        return res.status(401).send({ message: "TRXUSERIDASSIGNED is required." });
      }
      let query = `SELECT * FROM WMS_Journal_ProfitLost_CL WHERE

      TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED`

      let request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async updateWmsJournalProfitLostClQtyScanned(req, res, next) {
    try {
      const { ITEMID, JOURNALID, TRXUSERIDASSIGNED } = req.body;

      // Update QTYSCANNED and decrease QTYDIFFERENCE using parameterized query
      let updateQtyQuery = `
        UPDATE [WBSSQL].[dbo].[WMS_Journal_ProfitLost_CL]
        SET QTYSCANNED = ISNULL(QTYSCANNED,0) + 1,
            QTYDIFFERENCE = QTY - (ISNULL(QTYSCANNED,0) + 1)
        OUTPUT inserted.* -- Include this line to return the updated row
        WHERE ITEMID = @ITEMID AND JOURNALID = @JOURNALID AND TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
      `;

      let request = pool2.request();

      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('JOURNALID', sql.NVarChar, JOURNALID);
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      // Execute the update query
      let result = await request.query(updateQtyQuery);

      // Access the updated row from the result object
      const updatedRow = result.recordset[0];

      return res.status(200).send({ message: "Quantity updated successfully.", updatedRow });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },




  // ---------- WMS_Journal_ProfitLost_CLDets Controller Start ----------

  async getAllWmsJournalProfitLostClDets(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_ProfitLost_CLDets`

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async insertJournalProfitLostClDets(req, res, next) {
    try {
      const journalProfitLostDataArray = req.body;

      if (!Array.isArray(journalProfitLostDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (journalProfitLostDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < journalProfitLostDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          QTY,
          JOURNALID,
          TRANSDATE,
          INVENTSITEID,
          INVENTLOCATIONID,
          CONFIGID,
          WMSLOCATIONID,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          ITEMSERIALNO,
          QTYSCANNED,
          QTYDIFFERENCE
        } = journalProfitLostDataArray[i];

        let fields = [
          "ITEMID",
          "ITEMNAME",
          "QTY",
          "JOURNALID",
          "TRANSDATE",
          "INVENTSITEID",
          "INVENTLOCATIONID",
          "CONFIGID",
          "WMSLOCATIONID",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "ITEMSERIALNO",
          "QTYSCANNED",
          "QTYDIFFERENCE"
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_ProfitLost_CLDets]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('QTY', sql.Float, QTY);
        request.input('JOURNALID', sql.NVarChar, JOURNALID);
        request.input('TRANSDATE', sql.Date, TRANSDATE);
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
        request.input('TRXDATETIME', sql.DateTime, new Date());
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, TRXUSERIDASSIGNEDBY);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },





  /// ---------- WMS_Journal_Counting Controller Start ----------


  async getAllWmsJournalCounting(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Counting`

      let request = pool1.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async insertWMSJournalCountingCL(req, res, next) {
    try {
      const journalCountingDataArray = req.body;

      if (!Array.isArray(journalCountingDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (journalCountingDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < journalCountingDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          QTY,
          INVENTONHAND,
          COUNTED,
          JOURNALID,
          TRANSDATE,
          INVENTSITEID,
          INVENTLOCATIONID,
          CONFIGID,
          WMSLOCATIONID,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          ITEMSERIALNO,
          QTYSCANNED,
          QTYDIFFERENCE
        } = journalCountingDataArray[i];

        let fields = [
          "ITEMID",
          "ITEMNAME",
          "QTY",
          "INVENTONHAND",
          "COUNTED",
          "JOURNALID",
          "TRANSDATE",
          "INVENTSITEID",
          "INVENTLOCATIONID",
          "CONFIGID",
          "WMSLOCATIONID",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "ITEMSERIALNO",
          "QTYSCANNED",
          "QTYDIFFERENCE"
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_Counting_CL]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('QTY', sql.Float, QTY);
        request.input('INVENTONHAND', sql.Float, INVENTONHAND);
        request.input('COUNTED', sql.Float, COUNTED);
        request.input('JOURNALID', sql.NVarChar, JOURNALID);
        request.input('TRANSDATE', sql.Date, TRANSDATE);
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
        request.input('TRXDATETIME', sql.DateTime, TRXDATETIME || new Date());
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, req?.token?.UserID);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },

  async getWmsJournalCountingCLByAssignedToUserId(req, res, next) {
    try {
      const TRXUSERIDASSIGNED = req?.token?.UserID;
      if (!TRXUSERIDASSIGNED) {
        return res.status(401).send({ message: "TRXUSERIDASSIGNED is required." });
      }
      let query = `SELECT * FROM WMS_Journal_Counting_CL WHERE

      TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED`

      let request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },

  async updateWmsJournalCountingCLQtyScanned(req, res, next) {
    try {
      const { ITEMID, JOURNALID, TRXUSERIDASSIGNED } = req.body;

      // Check if the item exists in the table d
      let checkItemQuery = `
        SELECT TOP 1 *
        FROM [WBSSQL].[dbo].[WMS_Journal_Counting_CL]
        WHERE ITEMID = @ITEMID AND JOURNALID = @JOURNALID AND TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
      `;

      let request = pool2.request();
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('JOURNALID', sql.NVarChar, JOURNALID);
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      let result = await request.query(checkItemQuery);
      if (result.recordset.length === 0) {
        return res.status(404).send({ message: 'Item not found.' });
      }

      // Update QTYSCANNED and decrease QTYDIFFERENCE using parameterized query
      let updateQtyQuery = `
        UPDATE [WBSSQL].[dbo].[WMS_Journal_Counting_CL]
        SET QTYSCANNED = ISNULL(QTYSCANNED,0) + 1,
            QTYDIFFERENCE = QTY - (ISNULL(QTYSCANNED,0) + 1)
        OUTPUT inserted.* -- Include this line to return the updated row
        WHERE ITEMID = @ITEMID AND JOURNALID = @JOURNALID AND TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
      `;

      request = pool2.request();
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('JOURNALID', sql.NVarChar, JOURNALID); // Missing declaration
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED); // Missing declaration

      // Execute the update query
      result = await request.query(updateQtyQuery);

      // Access the updated row from the result object
      const updatedRow = result.recordset[0];

      return res.status(200).send({ message: "Quantity updated successfully.", updatedRow });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },



  // ---------- WMS_Journal_CountingCLDets Controller End ----------

  async getAllWmsJournalCountingCLDets(req, res, next) {

    try {

      let query = `SELECT * FROM WMS_Journal_Counting_CL `

      let request = pool2.request();

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No Record found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  async insertWMSJournalCountingCLDets(req, res, next) {
    try {
      const journalCountingDataArray = req.body;

      if (!Array.isArray(journalCountingDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (journalCountingDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < journalCountingDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          QTY,
          INVENTONHAND,
          COUNTED,
          JOURNALID,
          TRANSDATE,
          INVENTSITEID,
          INVENTLOCATIONID,
          CONFIGID,
          WMSLOCATIONID,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          ITEMSERIALNO,
          QTYSCANNED,
          QTYDIFFERENCE
        } = journalCountingDataArray[i];

        let fields = [
          "ITEMID",
          "ITEMNAME",
          "QTY",
          "INVENTONHAND",
          "COUNTED",
          "JOURNALID",
          "TRANSDATE",
          "INVENTSITEID",
          "INVENTLOCATIONID",
          "CONFIGID",
          "WMSLOCATIONID",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "ITEMSERIALNO",
          "QTYSCANNED",
          "QTYDIFFERENCE"
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_Counting_CLDets]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('QTY', sql.Float, QTY);
        request.input('INVENTONHAND', sql.Float, INVENTONHAND);
        request.input('COUNTED', sql.Float, COUNTED);
        request.input('JOURNALID', sql.NVarChar, JOURNALID);
        request.input('TRANSDATE', sql.Date, TRANSDATE);
        request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
        request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
        request.input('TRXDATETIME', sql.DateTime, TRXDATETIME || new Date());
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, TRXUSERIDASSIGNEDBY);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },


  //------------------- WMS_Journal_Counting_OnlyCL Controller Start -------------------



  async insertIntoWmsJournalCountingOnlyCL(req, res, next) {
    try {
      const countingOnlyDataArray = req.body;

      if (!Array.isArray(countingOnlyDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (countingOnlyDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < countingOnlyDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          ITEMGROUPID,
          GROUPNAME,
          INVENTORYBY,
          TRXUSERIDASSIGNED,
          QTYSCANNED,
          QTYDIFFERENCE,
          QTYONHAND,
          BINLOCATION,
        } = countingOnlyDataArray[i];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkQuery = `
          SELECT *
          FROM [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCL]
          WHERE ITEMID = @ITEMID
            AND TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
            AND CONVERT(date, TRXDATETIME) = @TRXDATETIME
        `;

        const checkRequest = pool2.request();
        checkRequest.input('ITEMID', sql.NVarChar, ITEMID);
        checkRequest.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        checkRequest.input('TRXDATETIME', sql.Date, today);

        const checkResult = await checkRequest.query(checkQuery);

        if (checkResult.recordset.length > 0) {
          return res.status(400).send({ message: `Record with ITEMID '${ITEMID}' already exists for today` });
        }

        let fields = [
          "ITEMID",
          "ITEMNAME",
          "ITEMGROUPID",
          "GROUPNAME",
          "INVENTORYBY",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "QTYSCANNED",
          "QTYDIFFERENCE",
          "QTYONHAND",
          "BINLOCATION"

        ];

        let values = fields.map((field) => "@" + field);

        let insertQuery = `
          INSERT INTO [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCL]
            (${fields.join(', ')}) 
          VALUES 
            (${values.join(', ')})
        `;

        let insertRequest = pool2.request();
        insertRequest.input('ITEMID', sql.NVarChar, ITEMID);
        insertRequest.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        insertRequest.input('ITEMGROUPID', sql.NVarChar, ITEMGROUPID);
        insertRequest.input('GROUPNAME', sql.NVarChar, GROUPNAME);
        insertRequest.input('INVENTORYBY', sql.NVarChar, INVENTORYBY);

        insertRequest.input('TRXDATETIME', sql.DateTime, today);
        insertRequest.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        insertRequest.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, req?.token?.UserID);
        insertRequest.input('QTYSCANNED', sql.Float, QTYSCANNED);
        insertRequest.input('QTYDIFFERENCE', sql.Float, QTYDIFFERENCE);
        insertRequest.input('QTYONHAND', sql.Float, QTYONHAND);
        insertRequest.input('BINLOCATION', sql.NVarChar, BINLOCATION);

        await insertRequest.query(insertQuery);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },



  // Fetch all data from WMS_Journal_Counting_OnlyCL
  async getAllWmsJournalCountingOnlyCl(req, res, next) {
    try {
      let query = `
    SELECT * FROM [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCL]
    `;

      let request = pool2.request();
      const data = await request.query(query);

      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },

  async getWmsJournalCountingOnlyCLByBinLocation(req, res, next) {
    try {
      const BINLOCATION = req.query.binloacation;
      if (!BINLOCATION) {
        return res.status(401).send({ message: "binloacation is required." });

      }
      let query = `SELECT * FROM WMS_Journal_Counting_OnlyCL WHERE
      BINLOCATION = @BINLOCATION AND TRXUSERIDASSIGNED= @TRXUSERIDASSIGNED`

      let request = pool2.request();
      request.input('BINLOCATION', sql.NVarChar, BINLOCATION);
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, req?.token?.UserID);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },




  async getWmsJournalCountingOnlyCLByAssignedToUserId(req, res, next) {
    try {
      const TRXUSERIDASSIGNED = req?.token?.UserID;
      if (!TRXUSERIDASSIGNED) {
        return res.status(401).send({ message: "TRXUSERIDASSIGNED is required." });
      }
      let query = `SELECT * FROM WMS_Journal_Counting_OnlyCL WHERE

      TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED`

      let request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });

    }
  },


  async getBinLocationByUserIdFromJournalCountingOnlyCL(req, res, next) {
    try {
      const TRXUSERIDASSIGNED = req?.token?.UserID;
      if (!TRXUSERIDASSIGNED) {
        return res.status(401).send({ message: "TRXUSERIDASSIGNED is required." });
      }
      let query = `SELECT BINLOCATION FROM WMS_Journal_Counting_OnlyCL WHERE TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
      AND BINLOCATION IS NOT NULL AND BINLOCATION <> ''
      `;

      let request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);

      const data = await request.query(query);
      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "data not found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  //------------------- WMS_Journal_Counting_OnlyCLDets Controller Start -------------------

  async insertIntoWmsJournalCountingOnlyCLDets(req, res, next) {
    try {
      const countingOnlyCLDetsDataArray = req.body;

      if (!Array.isArray(countingOnlyCLDetsDataArray)) {
        return res.status(400).send({ message: 'Invalid input. Array expected.' });
      }

      if (countingOnlyCLDetsDataArray.length === 0) {
        return res.status(400).send({ message: "Please provide data to insert." });
      }

      for (let i = 0; i < countingOnlyCLDetsDataArray.length; i++) {
        const {
          ITEMID,
          ITEMNAME,
          ITEMGROUPID,
          GROUPNAME,
          JOURNALID,
          INVENTORYBY,
          TRXDATETIME,
          TRXUSERIDASSIGNED,
          TRXUSERIDASSIGNEDBY,
          CONFIGID,
          ITEMSERIALNO,
          QTYSCANNED,
          BINLOCATION
        } = countingOnlyCLDetsDataArray[i];

        let fields = [
          "ITEMID",
          "ITEMNAME",
          "ITEMGROUPID",
          "GROUPNAME",
          "JOURNALID",
          "INVENTORYBY",
          "TRXDATETIME",
          "TRXUSERIDASSIGNED",
          "TRXUSERIDASSIGNEDBY",
          "CONFIGID",
          "ITEMSERIALNO",
          "DATETIMESCANNED",
          "CURRENTUSERLOGGEDINID",
          "QTYSCANNED",
          "BINLOCATION"
        ];

        let values = fields.map((field) => "@" + field);

        let query = `
        INSERT INTO [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCLDets]
          (${fields.join(', ')}) 
        VALUES 
          (${values.join(', ')})
      `;

        let request = pool2.request();
        request.input('ITEMID', sql.NVarChar, ITEMID);
        request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
        request.input('ITEMGROUPID', sql.NVarChar, ITEMGROUPID);
        request.input('GROUPNAME', sql.NVarChar, GROUPNAME);
        request.input('JOURNALID', sql.Int, JOURNALID);
        request.input('INVENTORYBY', sql.NVarChar, INVENTORYBY);
        request.input('TRXDATETIME', sql.DateTime, TRXDATETIME);
        request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
        request.input('TRXUSERIDASSIGNEDBY', sql.NVarChar, TRXUSERIDASSIGNEDBY);
        request.input('CONFIGID', sql.NVarChar, CONFIGID);
        request.input('ITEMSERIALNO', sql.NVarChar, ITEMSERIALNO);
        request.input('DATETIMESCANNED', sql.DateTime, new Date());
        request.input('CURRENTUSERLOGGEDINID', sql.NVarChar, req?.token?.UserID);
        request.input('QTYSCANNED', sql.Float, QTYSCANNED);
        request.input('BINLOCATION', sql.NVarChar, BINLOCATION);
        await request.query(query);
      }

      return res.status(201).send({ message: 'Records inserted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },



  // Fetch all data from WMS_Journal_Counting_OnlyCLDets
  async getAllWmsJournalCountingOnlyCLDets(req, res, next) {
    try {
      let query = `
    SELECT * FROM [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCLDets]
    `;

      let request = pool2.request();
      const data = await request.query(query);

      if (data.recordsets[0].length === 0) {
        return res.status(404).send({ message: "No data found." });
      }
      return res.status(200).send(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },



  async validateItemSerialNumberForJournalCountingOnlyCLDets(req, res, next) {
    try {
      const { itemSerialNo } = req.body;

      if (!itemSerialNo) {
        return res.status(400).send({ message: "Please provide an itemSerialNo." });
      }

      let query = `
        SELECT * FROM [WBSSQL].[dbo].[tblMappedBarcodes]
        WHERE ItemSerialNo=@itemSerialNo
      `;

      let request = pool2.request();
      request.input('itemSerialNo', sql.NVarChar, itemSerialNo);
      const data = await request.query(query);

      if (data.recordset.length === 0) {
        return res.status(404).send({ message: "Serial number not exist in mapped barcode." });
      }

      query = `
        SELECT * FROM [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCLDets]
        WHERE ITEMSERIALNO=@itemSerialNo
      `;

      request = pool2.request();
      request.input('itemSerialNo', sql.NVarChar, itemSerialNo);
      const data2 = await request.query(query);

      if (data2.recordset.length !== 0) {
        return res.status(400).send({ message: "The serial number already exists." });
      }

      return res.status(200).send({ message: 'Serial number is validated.', data: data?.recordsets[0] });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },





  async incrementQTYSCANNEDInJournalCountingOnlyCL(req, res) {
    try {
      const { TRXUSERIDASSIGNED, ITEMID, TRXDATETIME } = req.body;

      // Check if required fields are provided
      if (!TRXUSERIDASSIGNED || !ITEMID || !TRXDATETIME) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      // Update QTYSCANNED by incrementing it by 1
      const query = `
        UPDATE [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCL]
        SET QTYSCANNED = ISNULL(QTYSCANNED,0) + 1
        OUTPUT INSERTED.*
        WHERE TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
        AND ITEMID = @ITEMID
        AND TRXDATETIME = @TRXDATETIME
      `;
      const request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('TRXDATETIME', sql.DateTime, TRXDATETIME);
      const result = await request.query(query);

      // Check if any rows were affected
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'No matching rows found.' });
      }

      // Return the updated data
      const updatedData = result.recordset[0];
      return res.status(200).json({ message: 'QTYSCANNED updated successfully.', data: updatedData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while updating QTYSCANNED.' });
    }
  },

  async incrementQTYSCANNEDInJournalCountingOnlyCLByBinLocation(req, res) {
    try {
      const { TRXUSERIDASSIGNED, BINLOCATION, TRXDATETIME } = req.body;

      // Check if required fields are provided
      if (!TRXUSERIDASSIGNED || !BINLOCATION || !TRXDATETIME) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      // Update QTYSCANNED by incrementing it by 1
      const query = `
        UPDATE [WBSSQL].[dbo].[WMS_Journal_Counting_OnlyCL]
        SET QTYSCANNED = ISNULL(QTYSCANNED,0) + 1
        OUTPUT INSERTED.*
        WHERE TRXUSERIDASSIGNED = @TRXUSERIDASSIGNED
        AND BINLOCATION = @BINLOCATION
        AND TRXDATETIME = @TRXDATETIME
      `;
      const request = pool2.request();
      request.input('TRXUSERIDASSIGNED', sql.NVarChar, TRXUSERIDASSIGNED);
      request.input('BINLOCATION', sql.NVarChar, BINLOCATION);
      request.input('TRXDATETIME', sql.DateTime, TRXDATETIME);
      const result = await request.query(query);

      // Check if any rows were affected
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'No matching rows found.' });
      }

      // Return the updated data
      const updatedData = result.recordset[0];
      return res.status(200).json({ message: 'QTYSCANNED updated successfully.', data: updatedData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while updating QTYSCANNED.' });
    }
  }







};


export default WBSDB;
