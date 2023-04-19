
import { pool1, pool2 } from "../config/connection.js"; // import pool1 and pool2 from connection.js file
import sql from "mssql";
pool1.connect().catch((err) => console.log("Error connecting to config1:", err));
pool2.connect().catch((err) => console.log("Error connecting to config2:", err));

const WBSDB = {
  async getShipmentDataFromtShipmentReceiving(req, res, next) {
    try {
      if (!req.body.SHIPMENTID) {
        return res.status(400).send({ message: "SHIPMENTID is required." });
      }

      let query;
      if (req.body.CONTAINERID) {
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving
          WHERE SHIPMENTID = @SHIPMENTID AND CONTAINERID = @CONTAINERID
        `;
      } else {
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving
          WHERE SHIPMENTID = @SHIPMENTID
        `;
      }

      let request = pool1.request().input("SHIPMENTID", sql.VarChar, req.body.SHIPMENTID);

      if (req.body.CONTAINERID) {
        request = request.input("CONTAINERID", sql.VarChar, req.body.CONTAINERID);
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
      if (!req.body.SHIPMENTID) {
        return res.status(400).send({ message: "SHIPMENTID is required." });
      }

      let query;

      if (req.body.CONTAINERID) {
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving_CL
          WHERE SHIPMENTID = @SHIPMENTID AND CONTAINERID = @CONTAINERID
        `;
      } else {
        query = `
          SELECT * FROM dbo.tbl_Shipment_Receiving_CL
          WHERE SHIPMENTID = @SHIPMENTID
        `;
      }

      let request = pool2.request().input("SHIPMENTID", sql.VarChar, req.body.SHIPMENTID);

      if (req.body.CONTAINERID) {
        request = request.input("CONTAINERID", sql.VarChar, req.body.CONTAINERID);
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
  async getAllShipmentDataFromtShipmentReceivingCL(req, res, next) {

    try {
      let query = `
      SELECT * FROM dbo.tbl_Shipment_Receiving_CL
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
      } = req.body;

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
      } = req.body;

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
      } = req.body;

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
      } = req.body;

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
      const { SHIPMENTID } = req.body;

      if (!SHIPMENTID) {
        return res.status(400).send({ message: 'shipment ID is required' });
      }

      const query = `
      DELETE FROM dbo.tbl_Shipment_Receiving_CL
      WHERE SHIPMENTID = @SHIPMENTID
    `;

      let request = pool1.request();
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
      } = req.body;

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

  // post request to insert data 
  async insertShipmentRecievedDataCL(req, res, next) {
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
        BIN
      } = req.body;

      const query = `
        INSERT INTO dbo.tbl_Shipment_Received_CL
          (SHIPMENTID, CONTAINERID, ARRIVALWAREHOUSE, ITEMNAME, ITEMID, PURCHID, CLASSIFICATION, SERIALNUM, RCVDCONFIGID, RCVD_DATE, GTIN, RZONE, PALLET_DATE, PALLETCODE, BIN)
        VALUES
          (@SHIPMENTID, @CONTAINERID, @ARRIVALWAREHOUSE, @ITEMNAME, @ITEMID, @PURCHID, @CLASSIFICATION, @SERIALNUM, @RCVDCONFIGID, @RCVD_DATE, @GTIN, @RZONE, @PALLET_DATE, @PALLETCODE, @BIN)
      `;

      let request = pool2.request();
      request.input('SHIPMENTID', sql.NVarChar, SHIPMENTID);
      request.input('CONTAINERID', sql.NVarChar, CONTAINERID);
      request.input('ARRIVALWAREHOUSE', sql.NVarChar, ARRIVALWAREHOUSE);
      request.input('ITEMNAME', sql.NVarChar, ITEMNAME);
      request.input('ITEMID', sql.NVarChar, ITEMID);
      request.input('PURCHID', sql.NVarChar, PURCHID);
      request.input('CLASSIFICATION', sql.Float, CLASSIFICATION);
      request.input('SERIALNUM', sql.NVarChar, SERIALNUM);
      request.input('RCVDCONFIGID', sql.NVarChar, RCVDCONFIGID);
      request.input('RCVD_DATE', sql.Date, RCVD_DATE);
      request.input('GTIN', sql.NVarChar, GTIN);
      request.input('RZONE', sql.NVarChar, RZONE);
      request.input('PALLET_DATE', sql.Date, PALLET_DATE);
      request.input('PALLETCODE', sql.NVarChar, PALLETCODE);
      request.input('BIN', sql.NVarChar, BIN);

      await request.query(query);
      res.status(201).send({ message: 'Shipment data inserted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },


  async deleteShipmentRecievedDataCL(req, res, next) {
    try {
      const { SHIPMENTID } = req.body;

      if (!SHIPMENTID) {
        return res.status(400).send({ message: "SHIPMENTID is required." });
      }

      const query = `
        DELETE FROM dbo.tbl_Shipment_Received_CL
        WHERE SHIPMENTID = @SHIPMENTID
      `;

      let request = pool2.request();
      request.input('SHIPMENTID', sql.NVarChar(255), SHIPMENTID);

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: "No data found with the given SHIPMENTID." });
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
        BIN
      } = req.body;

      if (!SHIPMENTID) {
        return res.status(400).send({ message: 'SHIPMENTID is required.' });
      }

      let query = `
        UPDATE dbo.tbl_Shipment_Received_CL
        SET `;

      const updateFields = [];
      const request = pool2.request();

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

      if (SERIALNUM !== undefined) {
        updateFields.push('SERIALNUM = @SERIALNUM');
        request.input('SERIALNUM', sql.NVarChar, SERIALNUM);
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
      } = req.body;

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
      } = req.body;

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
      const { TRANSFERID } = req.body;

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
  }


  // ------------------------------ tbl_Shipment_Palletizing_CL END ------------------------------ //




};





export default WBSDB;
