import express from "express";
const router = express.Router();
import WBSDB from "../controllers/controlletrsMSSQL.js";

// import upload from "../config/multerConfig.js";
// import { checkAuthentication, checkRole, generateToken } from "../helpers/apiAuth.js";
// import logoUpload from "../config/multerLogoConfig.js";


router.post("/getShipmentDataFromtShipmentReceiving", WBSDB.getShipmentDataFromtShipmentReceiving);
router.post("/getShipmentDataFromtShipmentReceivingCL", WBSDB.getShipmentDataFromtShipmentReceivingCL);
router.get("/getAllShipmentDataFromtShipmentReceiving", WBSDB.getAllShipmentDataFromtShipmentReceiving);
router.get("/getAllShipmentDataFromtShipmentReceived", WBSDB.getAllShipmentDataFromtShipmentReceived);
router.get("/getAllTblItems", WBSDB.getAllTblItems);


// to get all the packing slips from the PackingSlipTable  
router.get("/getAllPackingSlips", WBSDB.getAllPackingSlips);

// to get all the dispatching data from the tbl_Dispatching
router.get("/getAllTblDispatchingData", WBSDB.getAllTblDispatchingData);

// to get all the palletizing data from the tbl_Shipment_Palletizing
router.get("/getAllTblShipmentPalletizing", WBSDB.getAllTblShipmentPalletizing);




//  ----------- tbl_Shipment_Receiving_CL APIS Start -----------------


router.get("/getAllShipmentDataFromtShipmentReceivingCL", WBSDB.getAllShipmentDataFromtShipmentReceivingCL);

// insert data into the tbl_Shipment_Receiving_CL
router.post("/insertShipmentRecievingDataCL", WBSDB.insertShipmentRecievingDataCL);

// delete data from the tbl_Shipment_Receiving_CL
router.delete("/deleteShipmentRecievingDataCL", WBSDB.deleteShipmentRecievingDataCL);


// update data from the tbl_Shipment_Receiving_CL
router.put("/updateShipmentRecievingDataCL", WBSDB.updateShipmentRecievingDataCL);


//  ----------- tbl_Shipment_Receiving_CL APIS End -----------------




//  ----------- tbl_Items_CL APIS Start -----------------

router.get("/getAllTblItemsCL", WBSDB.getAllTblItemsCL);
router.post("/insertTblItemsCLData", WBSDB.insertTblItemsCLData);
router.delete("/deleteTblItemsCLData", WBSDB.deleteTblItemsCLData);
router.put("/updateTblItemsCLData", WBSDB.updateTblItemsCLData);

//  ----------- tbl_Items_CL APIS End -----------------



// ----------- tbl_Shipment_Received_CL APIS Start -----------------

router.get("/getAllTblShipmentReceivedCL", WBSDB.getAllTblShipmentReceivedCL);

router.post("/insertShipmentRecievedDataCL", WBSDB.insertShipmentRecievedDataCL);

router.delete("/deleteShipmentRecievedDataCL", WBSDB.deleteShipmentRecievedDataCL);

router.put("/updateShipmentRecievedDataCL", WBSDB.updateShipmentRecievedDataCL);

// ----------- tbl_Shipment_Received_CL APIS End -----------------


// ----------- tbl_Shipment_Palletizing_CL APIS Start -----------------

// to get all the palletizing data from the tbl_Shipment_Palletizing_CL
router.get("/getAllTblShipmentPalletizingCL", WBSDB.getAllTblShipmentPalletizingCL);

router.post("/insertShipmentPalletizingDataCL", WBSDB.insertShipmentPalletizingDataCL);

router.delete("/deleteShipmentPalletizingDataCL", WBSDB.deleteShipmentPalletizingDataCL);

router.put("/updateShipmentPalletizingDataCL", WBSDB.updateShipmentPalletizingDataCL);


// ----------- tbl_Shipment_Palletizing_CL APIS End -----------------


// ----------- tbL_Picking_CL APIS Start -----------------

router.get("/getAllTblPickingCL", WBSDB.getAllTblPickingCL);

router.post("/insertTblPickingDataCL", WBSDB.insertTblPickingDataCL);

router.delete("/deleteTblPickingDataCL", WBSDB.deleteTblPickingDataCL);
router.put("/updateTblPickingDataCL", WBSDB.updateTblPickingDataCL);


// ----------- tbL_Picking_CL APIS End -----------------

// ----------- tbl_Dispatching_CL APIS Start -----------------

router.get("/getAllTblDispatchingCL", WBSDB.getAllTblDispatchingCL);

router.post("/insertTblDispatchingDataCL", WBSDB.insertTblDispatchingDataCL);

router.delete("/deleteTblDispatchingDataCL", WBSDB.deleteTblDispatchingDataCL);

router.put("/updateTblDispatchingDataCL", WBSDB.updateTblDispatchingDataCL);



// ----------- tbl_Dispatching_CL APIS End -----------------


// ----------- tbl_locations_CL  APIS Start -----------------

router.get("/getAllTblLocationsCL", WBSDB.getAllTblLocationsCL);

router.post("/insertTblLocationsDataCL", WBSDB.insertTblLocationsDataCL);

router.delete("/deleteTblLocationsDataCL", WBSDB.deleteTblLocationsDataCL);

router.put("/updateTblLocationsDataCL", WBSDB.updateTblLocationsDataCL);

// ----------- tbl_locations_CL  APIS End -----------------


export default router;

