
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
      } = req.body;

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
      } = req.body;

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
      const { PICKINGROUTEID } = req.body;

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
      } = req.body;

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
      } = req.body;

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
      const { PACKINGSLIPID } = req.body;

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
      } = req.body;

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
      } = req.body;

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
      const { LOCATIONS_HFID } = req.body;

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





};





export default WBSDB;
