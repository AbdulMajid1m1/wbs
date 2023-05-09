
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
      SELECT * FROM dbo.tbl_Items
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

      // Define SQL query
      // TODO: uncommit the original query
      // let query = `
      //   SELECT * 
      //     FROM dbo.expectedTransferOrder
      //     WHERE TRANSFERID = @TRANSFERID
      // `;
      let query = `
        SELECT * 
          FROM dbo.expectedTransferOrderTable
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


  async generateAndUpdatePalletIds(req, res) {
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



  // async updateShipmentRecievedDataCL(req, res, next) {
  //   try {
  //     const {
  //       SHIPMENTID,
  //       CONTAINERID,
  //       ARRIVALWAREHOUSE,
  //       ITEMNAME,
  //       ITEMID,
  //       PURCHID,
  //       CLASSIFICATION,
  //       SERIALNUM,
  //       RCVDCONFIGID,
  //       RCVD_DATE,
  //       GTIN,
  //       RZONE,
  //       PALLET_DATE,
  //       PALLETCODE,
  //       BIN,
  //       REMARKS,
  //       POQTY,
  //       RCVQTY,
  //       REMAININGQTY
  //     } = req.query;

  //     if (!SERIALNUM) {
  //       return res.status(400).send({ message: 'SERIALNUM is required.' });
  //     }

  //     let query = `
  //       UPDATE dbo.tbl_Shipment_Received_CL
  //       SET `;

  //     const updateFields = [];
  //     const request = pool2.request();

  //     if (SHIPMENTID !== undefined) {
  //       updateFields.push('SHIPMENTID = @SHIPMENTID');
  //       request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);
  //     }

  //     if (CONTAINERID !== undefined) {
  //       updateFields.push('CONTAINERID = @CONTAINERID');
  //       request.input('CONTAINERID', sql.NVarChar, CONTAINERID);
  //     }

  //     if (ARRIVALWAREHOUSE !== undefined) {
  //       updateFields.push('ARRIVALWAREHOUSE = @ARRIVALWAREHOUSE');
  //       request.input('ARRIVALWAREHOUSE', sql.NVarChar, ARRIVALWAREHOUSE);
  //     }

  //     if (ITEMNAME !== undefined) {
  //       updateFields.push('ITEMNAME = @ITEMNAME');
  //       request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
  //     }

  //     if (ITEMID !== undefined) {
  //       updateFields.push('ITEMID = @ITEMID');
  //       request.input('ITEMID', sql.NVarChar, ITEMID);
  //     }

  //     if (PURCHID !== undefined) {
  //       updateFields.push('PURCHID = @PURCHID');
  //       request.input('PURCHID', sql.NVarChar, PURCHID);
  //     }

  //     if (CLASSIFICATION !== undefined) {
  //       updateFields.push('CLASSIFICATION = @CLASSIFICATION');
  //       request.input('CLASSIFICATION', sql.Float, CLASSIFICATION);
  //     }

  //     if (RCVDCONFIGID !== undefined) {
  //       updateFields.push('RCVDCONFIGID = @RCVDCONFIGID');
  //       request.input('RCVDCONFIGID', sql.NVarChar, RCVDCONFIGID);
  //     }

  //     if (RCVD_DATE !== undefined) {
  //       updateFields.push('RCVD_DATE = @RCVD_DATE');
  //       request.input('RCVD_DATE', sql.Date, RCVD_DATE);
  //     }

  //     if (GTIN !== undefined) {
  //       updateFields.push('GTIN = @GTIN');
  //       request.input('GTIN', sql.NVarChar, GTIN);
  //     }

  //     if (RZONE !== undefined) {
  //       updateFields.push('RZONE = @RZONE');
  //       request.input('RZONE', sql.NVarChar, RZONE);
  //     }

  //     if (PALLET_DATE !== undefined) {
  //       updateFields.push('PALLET_DATE = @PALLET_DATE');
  //       request.input('PALLET_DATE', sql.Date, PALLET_DATE);
  //     }

  //     if (PALLETCODE !== undefined) {
  //       updateFields.push('PALLETCODE = @PALLETCODE');
  //       request.input('PALLETCODE', sql.NVarChar, PALLETCODE);
  //     }

  //     if (BIN !== undefined) {
  //       updateFields.push('BIN = @BIN');
  //       request.input('BIN', sql.NVarChar, BIN);
  //     }

  //     if (REMARKS !== undefined) {
  //       updateFields.push('REMARKS = @REMARKS');
  //       request.input('REMARKS', sql.NVarChar, REMARKS);
  //     }

  //     if (POQTY !== undefined) {
  //       updateFields.push('POQTY = @POQTY');
  //       request.input('POQTY', sql.Numeric(18, 0), POQTY);
  //     }

  //     if (RCVQTY !== undefined) {
  //       updateFields.push('RCVQTY = @RCVQTY');
  //       request.input('RCVQTY', sql.Numeric(18, 0), RCVQTY);
  //     }

  //     if (REMAININGQTY !== undefined) {
  //       updateFields.push('REMAININGQTY = @REMAININGQTY');
  //       request.input('REMAININGQTY', sql.Numeric(18, 0), REMAININGQTY);
  //     }

  //     if (updateFields.length === 0) {
  //       return res.status(400).send({ message: 'At least one field is required to update.' });
  //     }

  //     query += updateFields.join(', ');

  //     query += `
  //     WHERE SERIALNUM = @SERIALNUM
  //     `;

  //     request.input('SERIALNUM', sql.NVarChar, SERIALNUM);

  //     const result = await request.query(query);

  //     if (result.rowsAffected[0] === 0) {
  //       return res.status(404).send({ message: 'Shipment record not found.' });
  //     }

  //     res.status(200).send({ message: 'Shipment data updated successfully.' });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ message: error.message });
  //   }
  // },




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

  async insertTblDispatchingDataCL(req, res, next) {
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

      const query = `
        INSERT INTO dbo.tbl_Dispatching_CL
          (PACKINGSLIPID, VEHICLESHIPPLATENUMBER, INVENTLOCATIONID, INVENTSITEID, WMSLOCATIONID, ITEMID, QTY, REMAIN, NAME, CONFIGID, PICKINGROUTEID)
        VALUES
          (@PACKINGSLIPID, @VEHICLESHIPPLATENUMBER, @INVENTLOCATIONID, @INVENTSITEID, @WMSLOCATIONID, @ITEMID, @QTY, @REMAIN, @NAME, @CONFIGID, @PICKINGROUTEID)
      `;

      let request = pool2.request();
      request.input('PACKINGSLIPID', sql.NVarChar, PACKINGSLIPID);
      request.input('VEHICLESHIPPLATENUMBER', sql.NVarChar, VEHICLESHIPPLATENUMBER);
      request.input('INVENTLOCATIONID', sql.NVarChar, INVENTLOCATIONID);
      request.input('INVENTSITEID', sql.NVarChar, INVENTSITEID);
      request.input('WMSLOCATIONID', sql.NVarChar, WMSLOCATIONID);
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('QTY', sql.Float, QTY);
      request.input('REMAIN', sql.Float, REMAIN);
      request.input('NAME', sql.NVarChar, NAME);
      request.input('CONFIGID', sql.NVarChar, CONFIGID);
      request.input('PICKINGROUTEID', sql.NVarChar, PICKINGROUTEID);

      await request.query(query);
      res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
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
      res.status(201).send({ message: 'User inserted successfully.' });
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
      res.status(200).send({ message: 'Login successful.', user, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
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
      request.input('ItemCode', sql.NVarChar(100), ItemCode); // Assuming ITEMID is of type nvarchar(255)
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
  // async getAllTblMappedBarcodes(req, res, next) {
  //   try {
  //     const cacheKey = "tblMappedBarcodes";

  //     // Try to get data from Redis cache
  //     const cachedData = await client.get(cacheKey);

  //     if (cachedData) {
  //       // Parse the cached data and return it
  //       const parsedData = JSON.parse(cachedData);
  //       return res.status(200).send(parsedData);
  //     } else {
  //       // Fetch data from the database if not in cache
  //       let query = `
  //         SELECT * FROM dbo.tblMappedBarcodes
  //       `;
  //       let request = pool2.request();
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

      return res.status(201).send({ message: "Data successfully added." });
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
        request.input('SHIPMENTID', sql.NVarChar, record.SHIPMENTID || null);
        request.input('CONTAINERID', sql.NVarChar, record.CONTAINERID || null);
        request.input('ARRIVALWAREHOUSE', sql.NVarChar, record.ARRIVALWAREHOUSE || null);
        request.input('ITEMNAME', sql.NVarChar, record.ITEMNAME || null);
        request.input('ITEMID', sql.NVarChar, record.ITEMID || null);
        request.input('PURCHID', sql.NVarChar, record.PURCHID || null);
        request.input('CLASSIFICATION', sql.Float, record.CLASSIFICATION || null);
        request.input('SERIALNUM', sql.VarChar, record.SERIALNUM || null);
        request.input('RCVDCONFIGID', sql.VarChar, record.RCVDCONFIGID || null);
        request.input('RCVD_DATE', sql.Date, record.RCVD_DATE ? new Date(record.RCVD_DATE) : null);
        request.input('GTIN', sql.VarChar, record.GTIN || null);
        request.input('RZONE', sql.VarChar, record.RZONE || null);
        request.input('PALLET_DATE', sql.Date, record.PALLET_DATE ? new Date(record.PALLET_DATE) : null);
        request.input('PALLETCODE', sql.VarChar, record.PALLETCODE || null);
        request.input('BIN', sql.VarChar, record.BIN || null);
        request.input('REMARKS', sql.NVarChar, record.REMARKS || null);
        request.input('POQTY', sql.Numeric, record.POQTY || null);
        request.input('RCVQTY', sql.Numeric, record.RCVQTY || null);
        request.input('REMAININGQTY', sql.Numeric, record.REMAININGQTY || null);
        request.input('USERID', sql.NChar, record.USERID || null);
        request.input('TRXDATETIME', sql.DateTime, record.TRXDATETIME ? new Date(record.TRXDATETIME) : null);
        request.input('TRANSFERID', sql.NVarChar, record.TRANSFERID || null);
        request.input('TRANSFERSTATUS', sql.Int, record.TRANSFERSTATUS || null);
        request.input('INVENTLOCATIONIDFROM', sql.NVarChar, record.INVENTLOCATIONIDFROM || null);
        request.input('INVENTLOCATIONIDTO', sql.NVarChar, record.INVENTLOCATIONIDTO || null);
        request.input('QTYTRANSFER', sql.Int, record.QTYTRANSFER || null);
        request.input('QTYRECEIVED', sql.Int, record.QTYRECEIVED || null);
        request.input('CREATEDDATETIME', sql.DateTime, record.CREATEDDATETIME ? new Date(record.CREATEDDATETIME) : null);
        request.input('SELECTTYPE', sql.NVarChar, record.SELECTTYPE || null);
        // Continue to add the rest of the columns here with the same pattern
        const query = `
            INSERT INTO dbo.tbl_TransferBinToBin_CL
            (SHIPMENTID, CONTAINERID, ARRIVALWAREHOUSE, ITEMNAME, ITEMID, PURCHID, CLASSIFICATION, SERIALNUM, RCVDCONFIGID, RCVD_DATE, GTIN, RZONE, PALLET_DATE, PALLETCODE, BIN, REMARKS, POQTY, RCVQTY, REMAININGQTY, USERID, TRXDATETIME, TRANSFERID, TRANSFERSTATUS, INVENTLOCATIONIDFROM, INVENTLOCATIONIDTO, QTYTRANSFER, QTYRECEIVED, CREATEDDATETIME,SELECTTYPE) 
            VALUES
            (@SHIPMENTID, @CONTAINERID, @ARRIVALWAREHOUSE, @ITEMNAME, @ITEMID, @PURCHID, @CLASSIFICATION, @SERIALNUM, @RCVDCONFIGID, @RCVD_DATE, @GTIN, @RZONE, @PALLET_DATE, @PALLETCODE, @BIN, @REMARKS, @POQTY, @RCVQTY, @REMAININGQTY, @USERID, @TRXDATETIME, @TRANSFERID, @TRANSFERSTATUS, @INVENTLOCATIONIDFROM, @INVENTLOCATIONIDTO, @QTYTRANSFER, @QTYRECEIVED, @CREATEDDATETIME,@SELECTTYPE)
            `;

        // Execute the query
        await request.query(query);
      }

      // After all records are inserted, send a response.
      res.status(201).send({ message: 'Data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },










};

export default WBSDB;
