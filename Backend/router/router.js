import express from "express";
const router = express.Router();
import WBSDB from "../controllers/controlletrsMSSQL.js";
import { checkAuthentication } from "../helpers/apiAuth.js";

// import upload from "../config/multerConfig.js";
// import { checkAuthentication, checkRole, generateToken } from "../helpers/apiAuth.js";
// import logoUpload from "../config/multerLogoConfig.js";


// not using this api
router.post("/getShipmentDataFromtShipmentReceiving", checkAuthentication, WBSDB.getShipmentDataFromtShipmentReceiving);
router.post("/getShipmentDataFromtShipmentReceivingCL", checkAuthentication, WBSDB.getShipmentDataFromtShipmentReceivingCL);
// not using this api


router.get("/getAllShipmentDataFromtShipmentReceiving", checkAuthentication, WBSDB.getAllShipmentDataFromtShipmentReceiving);
router.get("/getAllShipmentDataFromtShipmentReceived", checkAuthentication, WBSDB.getAllShipmentDataFromtShipmentReceived);
router.get("/getAllTblItems", checkAuthentication, WBSDB.getAllTblItems);

// dbo.expectedShipments APIS Start
router.get("/getAllExpectedShipments", checkAuthentication, WBSDB.getAllExpectedShipments);


// dbo.expectedShipments APIS End

// expectedTransferOrder APIS Start
router.get("/getAllExpectedTransferOrder", checkAuthentication, WBSDB.getAllExpectedTransferOrder);
// expectedTransferOrder APIS End

// dbo.pickinglist APIS Start
router.get("/getAllPickingList", checkAuthentication, WBSDB.getAllPickingList);
// dbo.pickinglist APIS End



// to get all the packing slips from the PackingSlipTable  
router.get("/getAllPackingSlips", checkAuthentication, WBSDB.getAllPackingSlips);

// to get all the dispatching data from the tbl_Dispatching
router.get("/getAllTblDispatchingData", checkAuthentication, WBSDB.getAllTblDispatchingData);

// to get all the palletizing data from the tbl_Shipment_Palletizing
router.get("/getAllTblShipmentPalletizing", checkAuthentication, WBSDB.getAllTblShipmentPalletizing);




//  ----------- tbl_Shipment_Receiving_CL APIS Start -----------------


router.get("/getAllShipmentDataFromtShipmentReceivingCL", checkAuthentication, WBSDB.getAllShipmentDataFromtShipmentReceivingCL);

// insert data into the tbl_Shipment_Receiving_CL
router.post("/insertShipmentRecievingDataCL", checkAuthentication, WBSDB.insertShipmentRecievingDataCL);

// delete data from the tbl_Shipment_Receiving_CL
router.delete("/deleteShipmentRecievingDataCL", checkAuthentication, WBSDB.deleteShipmentRecievingDataCL);


// update data from the tbl_Shipment_Receiving_CL
router.put("/updateShipmentRecievingDataCL", checkAuthentication, WBSDB.updateShipmentRecievingDataCL);


//  ----------- tbl_Shipment_Receiving_CL APIS End -----------------




//  ----------- tbl_Items_CL APIS Start -----------------

router.get("/getAllTblItemsCL", checkAuthentication, WBSDB.getAllTblItemsCL);
router.post("/insertTblItemsCLData", checkAuthentication, WBSDB.insertTblItemsCLData);
router.delete("/deleteTblItemsCLData", checkAuthentication, WBSDB.deleteTblItemsCLData);
router.put("/updateTblItemsCLData", checkAuthentication, WBSDB.updateTblItemsCLData);

//  ----------- tbl_Items_CL APIS End -----------------



// ----------- tbl_Shipment_Received_CL APIS Start -----------------

router.get("/getAllTblShipmentReceivedCL", checkAuthentication, WBSDB.getAllTblShipmentReceivedCL);

router.post("/insertShipmentRecievedDataCL", checkAuthentication, WBSDB.insertShipmentRecievedDataCL);

router.delete("/deleteShipmentRecievedDataCL", checkAuthentication, WBSDB.deleteShipmentRecievedDataCL);

router.put("/updateShipmentRecievedDataCL", checkAuthentication, WBSDB.updateShipmentRecievedDataCL);

// ----------- tbl_Shipment_Received_CL APIS End -----------------


// ----------- tbl_Shipment_Palletizing_CL APIS Start -----------------

// to get all the palletizing data from the tbl_Shipment_Palletizing_CL
router.get("/getAllTblShipmentPalletizingCL", checkAuthentication, WBSDB.getAllTblShipmentPalletizingCL);

router.post("/insertShipmentPalletizingDataCL", checkAuthentication, WBSDB.insertShipmentPalletizingDataCL);

router.delete("/deleteShipmentPalletizingDataCL", checkAuthentication, WBSDB.deleteShipmentPalletizingDataCL);

router.put("/updateShipmentPalletizingDataCL", checkAuthentication, WBSDB.updateShipmentPalletizingDataCL);


// ----------- tbl_Shipment_Palletizing_CL APIS End -----------------


// ----------- tbL_Picking_CL APIS Start -----------------

router.get("/getAllTblPickingCL", checkAuthentication, WBSDB.getAllTblPickingCL);

router.post("/insertTblPickingDataCL", checkAuthentication, WBSDB.insertTblPickingDataCL);

router.delete("/deleteTblPickingDataCL", checkAuthentication, WBSDB.deleteTblPickingDataCL);
router.put("/updateTblPickingDataCL", checkAuthentication, WBSDB.updateTblPickingDataCL);


// ----------- tbL_Picking_CL APIS End -----------------

// ----------- tbl_Dispatching_CL APIS Start -----------------

router.get("/getAllTblDispatchingCL", checkAuthentication, WBSDB.getAllTblDispatchingCL);

router.post("/insertTblDispatchingDataCL", checkAuthentication, WBSDB.insertTblDispatchingDataCL);

router.delete("/deleteTblDispatchingDataCL", checkAuthentication, WBSDB.deleteTblDispatchingDataCL);

router.put("/updateTblDispatchingDataCL", checkAuthentication, WBSDB.updateTblDispatchingDataCL);



// ----------- tbl_Dispatching_CL APIS End -----------------


// ----------- tbl_locations_CL  APIS Start -----------------

router.get("/getAllTblLocationsCL", checkAuthentication, WBSDB.getAllTblLocationsCL);

router.post("/insertTblLocationsDataCL", checkAuthentication, WBSDB.insertTblLocationsDataCL);

router.delete("/deleteTblLocationsDataCL", checkAuthentication, WBSDB.deleteTblLocationsDataCL);

router.put("/updateTblLocationsDataCL", checkAuthentication, WBSDB.updateTblLocationsDataCL);

// ----------- tbl_locations_CL  APIS End -----------------


// ----- tblUsers APIS Start ----------------- 

router.get("/getAllTblUsers", checkAuthentication, WBSDB.getAllTblUsers);

router.get("/getSingleTblUsers", checkAuthentication, WBSDB.getSingleTblUsers);

router.post("/insertTblUsersData", checkAuthentication, WBSDB.insertTblUsersData);

router.delete("/deleteTblUsersData", checkAuthentication, WBSDB.deleteTblUsersData);

router.put("/updateTblUsersData", checkAuthentication, WBSDB.updateTblUsersData);

router.post("/login", WBSDB.loginUser);

// ----- tblUsers APIS End -----------------


// -------------   Alessa Project: API's for mobile app ------------------------

router.post("/getDispatchingDataByPackingSlipId", checkAuthentication, WBSDB.getDispatchingDataByPackingSlipId);// tbl_Dispatching



router.post("/getInventTableWMSDataByItemId", checkAuthentication, WBSDB.getInventTableWMSDataByItemId); // InventTableWMS 

// tblMappedBarcodes APIS Start

router.post("/getmapBarcodeDataByItemId", checkAuthentication, WBSDB.getmapBarcodeDataByItemId); // tblMappedBarcodes

router.post("/insertIntoMappedBarcode", checkAuthentication, WBSDB.insertIntoMappedBarcode);

router.put("/updateTblMappedBarcodeByItemId", checkAuthentication, WBSDB.updateTblMappedBarcodeByItemId);
router.put("/updateTblMappedBarcodeByGtin", checkAuthentication, WBSDB.updateTblMappedBarcodeByGtin);

router.post("/checkBarcodeValidityBySerialNo", checkAuthentication, WBSDB.checkBarcodeValidityBySerialNo);

router.post("/getItemInfoBySerialNo", checkAuthentication, WBSDB.getItemInfoBySerialNo);






export default router;

