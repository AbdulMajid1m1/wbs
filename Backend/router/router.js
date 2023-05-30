import express from "express";
const router = express.Router();
import WBSDB from "../controllers/controlletrsMSSQL.js";
import { checkAuthentication } from "../helpers/apiAuth.js";

import dotenv from "dotenv";
import upload from "../config/multerConfig.js";
dotenv.config();

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

// import upload from "../config/multerConfig.js";
// import { checkAuthentication, checkRole, generateToken } from "../helpers/apiAuth.js";
// import logoUpload from "../config/multerLogoConfig.js";


// not using this api
router.post("/getShipmentDataFromtShipmentReceiving", checkAuthentication, WBSDB.getShipmentDataFromtShipmentReceiving);
router.post("/getShipmentDataFromtShipmentReceivingCL", checkAuthentication, WBSDB.getShipmentDataFromtShipmentReceivingCL);
// not using this api
// getShipmentReceivingCLByShipmentId


router.get("/getAllShipmentDataFromtShipmentReceiving", checkAuthentication, WBSDB.getAllShipmentDataFromtShipmentReceiving);

router.get("/getTblShipmentReceivingQty", checkAuthentication, WBSDB.getTblShipmentReceivingQty);


router.get("/getAllShipmentDataFromtShipmentReceived", checkAuthentication, WBSDB.getAllShipmentDataFromtShipmentReceived);
router.get("/getAllTblItems", checkAuthentication, WBSDB.getAllTblItems);

// dbo.expectedShipments APIS Start
router.get("/getAllExpectedShipments", checkAuthentication, WBSDB.getAllExpectedShipments);


// dbo.expectedShipments APIS End

// expectedTransferOrder APIS Start

router.get("/getAllExpectedTransferOrder", checkAuthentication, WBSDB.getAllExpectedTransferOrder);
// TODO: uncommit the original query
router.get("/getExpectedTransferOrderByTransferId", checkAuthentication, WBSDB.getExpectedTransferOrderByTransferId);

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
router.get("/getTblShipmentReceivedCLStats", checkAuthentication, WBSDB.getTblShipmentReceivedCLStats);

router.post("/getShipmentRecievedCLDataCByShipmentId", checkAuthentication, WBSDB.getShipmentRecievedCLDataCByShipmentId)

router.get("/getShipmentRecievedCLDataCBySerialNumber", checkAuthentication, WBSDB.getShipmentRecievedCLDataCBySerialNumber)

router.post("/getShipmentRecievedCLDataByPalletCode", checkAuthentication, WBSDB.getShipmentRecievedCLDataByPalletCode)

router.get("/getShipmentRecievedCLDataByPalletCodeAndBinLocation", checkAuthentication, WBSDB.getShipmentRecievedCLDataByPalletCodeAndBinLocation)

router.get("/getShipmentRecievedCLDataBySerialNumberAndBinLocation", checkAuthentication, WBSDB.getShipmentRecievedCLDataBySerialNumberAndBinLocation)



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

router.post("/insertTblUsersData", WBSDB.insertTblUsersData);

router.delete("/deleteTblUsersData", checkAuthentication, WBSDB.deleteTblUsersData);

router.put("/updateTblUsersData", checkAuthentication, WBSDB.updateTblUsersData);

router.post("/login", WBSDB.loginUser);

router.post("/logout", WBSDB.logout);

// ----- tblUsers APIS End -----------------


// -------------   Alessa Project: API's for mobile app ------------------------

router.post("/getDispatchingDataByPackingSlipId", checkAuthentication, WBSDB.getDispatchingDataByPackingSlipId);// tbl_Dispatching



router.post("/getInventTableWMSDataByItemId", checkAuthentication, WBSDB.getInventTableWMSDataByItemId); // InventTableWMS 

// --------------- tblMappedBarcodes APIS Start ------

router.get("/getAllTblMappedBarcodes", checkAuthentication, WBSDB.getAllTblMappedBarcodes);

router.post("/getmapBarcodeDataByItemCode", checkAuthentication, WBSDB.getmapBarcodeDataByItemCode); // tblMappedBarcodes

router.get("/getmapBarcodeDataByBinLocation", checkAuthentication, WBSDB.getmapBarcodeDataByBinLocation);

router.post("/insertIntoMappedBarcode", checkAuthentication, WBSDB.insertIntoMappedBarcode);

router.post("/insertManyIntoMappedBarcode", checkAuthentication, WBSDB.insertManyIntoMappedBarcode);

router.put("/updateTblMappedBarcodeByItemCode", checkAuthentication, WBSDB.updateTblMappedBarcodeByItemCode);

router.put("/updateTblMappedBarcodeBinLocation", checkAuthentication, WBSDB.updateTblMappedBarcodeBinLocation);

router.put("/updateTblMappedBarcodeBinLocationWithSelectionType", checkAuthentication, WBSDB.updateTblMappedBarcodeBinLocationWithSelectionType);

router.put("/updateTblMappedBarcodeByGtin", checkAuthentication, WBSDB.updateTblMappedBarcodeByGtin);

router.post("/checkBarcodeValidityByItemSerialNo", checkAuthentication, WBSDB.checkBarcodeValidityByItemSerialNo);

router.post("/getItemInfoByItemSerialNo", checkAuthentication, WBSDB.getItemInfoByItemSerialNo);

router.post("/getMappedBarcodedsByItemSerialNoAndBinLocation", checkAuthentication, WBSDB.getMappedBarcodedsByItemSerialNoAndBinLocation);

router.put("/updateMappedBarcodesBinLocationBySerialNo", checkAuthentication, WBSDB.updateMappedBarcodesBinLocationBySerialNo);

router.put("/updateMappedBarcodesBinLocationByPalletCode", checkAuthentication, WBSDB.updateMappedBarcodesBinLocationByPalletCode);

router.post("/getItemInfoByPalletCode", checkAuthentication, WBSDB.getItemInfoByPalletCode);

router.post("/getMappedBarcodedsByPalletCodeAndBinLocation", checkAuthentication, WBSDB.getMappedBarcodedsByPalletCodeAndBinLocation);

router.post("/getMappedBarcodedsByItemCodeAndBinLocation", checkAuthentication, WBSDB.getMappedBarcodedsByItemCodeAndBinLocation);

router.delete("/deleteTblMappedBarcodesDataByItemCode", checkAuthentication, WBSDB.deleteTblMappedBarcodesDataByItemCode);


router.get("/getDistinctMappedBarcodeBinLocations", checkAuthentication, WBSDB.getDistinctMappedBarcodeBinLocations);

// ------------- tblMappedBarcodes APIS End -------- 



// ------------- tbl_RZONES APIS Start -------------

router.get("/getAllTblRZones", checkAuthentication, WBSDB.getAllTblRZones);


// ------------- tbl_RZONES APIS End ---------------


// ------------- Transfer_Distribution APIS Start -------------


router.get("/getTransferDistributionByTransferId", checkAuthentication, WBSDB.getTransferDistributionByTransferId);

// ------------- Transfer_Distribution APIS End ---------------


// ------------- tbl_Shipment_Palletizing APIS Start -------------

router.get("/getShipmentPalletizingByTransferId", checkAuthentication, WBSDB.getShipmentPalletizingByTransferId);

router.get("/vaildatehipmentPalletizingSerialNumber", checkAuthentication, WBSDB.vaildatehipmentPalletizingSerialNumber);

router.post("/generateAndUpdatePalletIds", checkAuthentication, WBSDB.generateAndUpdatePalletIds);

// ------------- tbl_Shipment_Palletizing APIS End ---------------


// ------------- tbl_locations_CL APIS Start ------------- 


router.get("/validateZoneCode", checkAuthentication, WBSDB.validateZoneCode);


// ---------------- EMAIL API -----------------------------

router.post('/sendEmail', upload.array('attachments'), WBSDB.sendEmail);

// ---------------- EMAIL API -----------------------------




// ----------------- tbl_TransferBinToBin_CL APIS Start -----------------

router.post("/insertTblTransferBinToBinCL", checkAuthentication, WBSDB.insertTblTransferBinToBinCL);


// ----------------- tbl_TransferBinToBin_CL APIS End -----------------


// ----------------- tbl_TransferJournal APIS Start -----------------

router.get("/getTransferJournalCLByJournalId", checkAuthentication, WBSDB.getTransferJournalCLByJournalId);

router.get("/getAllTransferJournal", checkAuthentication, WBSDB.getAllTransferJournal);


// ----------------- tbl_TransferJournal_CL APIS End -----------------

//-------- tbl_Item-Master APIS Start -----------

router.put("/updateTblItemMaster", checkAuthentication, WBSDB.updateTblItemMaster);




// ---- item-Re-Allocation APIS Start ----

router.post("/manageItemsReallocation", checkAuthentication, WBSDB.manageItemsReallocation);


// ---- item-Re-Allocation APIS End ----


// ------- tbl_Stock_Master APIS Start --------


router.get("/getAllTblStockMaster", checkAuthentication, WBSDB.getAllTblStockMaster);

router.get("/getTblStockMasterByItemId", checkAuthentication, WBSDB.getTblStockMasterByItemId);
router.get("/getStockMasterDataByItemId", checkAuthentication, WBSDB.getStockMasterDataByItemId);

router.post("/insertStockMasterData", checkAuthentication, WBSDB.insertStockMasterData);

router.put("/updateStockMasterData", checkAuthentication, WBSDB.updateStockMasterData);

router.put("/updateQtyReceivedInTblStockMaster", checkAuthentication, WBSDB.updateQtyReceivedInTblStockMaster);


router.delete("/deleteStockMasterDataByItemId", checkAuthentication, WBSDB.deleteStockMasterDataByItemId);
// --- tbl_ItemsReAllocationPicked APIS Start ---
router.get("/getAllItemsReAllocationPicked", checkAuthentication, WBSDB.getAllItemsReAllocationPicked);


// --- tbl_ItemsReAllocationPicked APIS End ---


/// ----- tbl_TransferBinToBin_CL APIS Start -----
router.get("/getAllTransferBinToBinCL", checkAuthentication, WBSDB.getAllTransferBinToBinCL);

// ----- WMS_Sales_PickingList_CL APIS Start -----

router.get("/getAllWmsSalesPickingListClFromAlessia", checkAuthentication, WBSDB.getAllWmsSalesPickingListClFromAlessia);

router.get("/getAllWmsSalesPickingListClFromWBS", checkAuthentication, WBSDB.getAllWmsSalesPickingListClFromWBS);

router.post("/insertPickingListDataCLIntoWBS", checkAuthentication, WBSDB.insertPickingListDataCLIntoWBS);

router.get("/getAllWmsSalesPickingListClFromWBSByPickingRouteId", checkAuthentication, WBSDB.getAllWmsSalesPickingListClFromWBSByPickingRouteId);


// packingsliptable_CL APIS Start -----
router.post("/insertIntoPackingSlipTableClAndUpdateWmsSalesPickingListCl", checkAuthentication, WBSDB.insertIntoPackingSlipTableClAndUpdateWmsSalesPickingListCl);

router.post("/insertIntoPackingSlipTableCl", checkAuthentication, WBSDB.insertIntoPackingSlipTableCl);


// packingsliptable APIS Start -----

router.get("/getPackingSlipTableByPackingSlipId", checkAuthentication, WBSDB.getPackingSlipTableByPackingSlipId);

export default router;



// WMS_ReturnSalesOrder APIS Start -----

router.get("/getWmsReturnSalesOrderByReturnItemNum", checkAuthentication, WBSDB.getWmsReturnSalesOrderByReturnItemNum);

router.get("/getAllWmsReturnSalesOrder", checkAuthentication, WBSDB.getAllWmsReturnSalesOrder);



// WMS_ReturnSalesOrder_CL APIS Start -----

router.get("/getAllWmsReturnSalesOrderCl", checkAuthentication, WBSDB.getAllWmsReturnSalesOrderCl);

router.post("/insertIntoWmsReturnSalesOrderCl", checkAuthentication, WBSDB.insertIntoWmsReturnSalesOrderCl);

router.get("/getWmsReturnSalesOrderClByAssignedToUserId", checkAuthentication, WBSDB.getWmsReturnSalesOrderClByAssignedToUserId);

// WMS_Journal_ProfitLost APIS Start -----


router.get("/getAllWmsJournalProfitLost", checkAuthentication, WBSDB.getAllWmsJournalProfitLost);



// WMS_Journal_Movement APIS Start -----


router.get("/getAllWmsJournalMovement", checkAuthentication, WBSDB.getAllWmsJournalMovement);




// WMS_Journal_Counting APIS Start ----- .


router.get("/getAllWmsJournalCounting", checkAuthentication, WBSDB.getAllWmsJournalCounting);

router.post("/generateBarcodeForRma", checkAuthentication, WBSDB.generateBarcodeForRma);



//  ---------- WMS_Journal_Movement_CL API Start ----------

router.post("/insertJournalMovementCLData", checkAuthentication, WBSDB.insertJournalMovementCLData);

router.get("/getAllWmsJournalMovementCl", checkAuthentication, WBSDB.getAllWmsJournalMovementCl);

router.get("/getWmsJournalMovementClByAssignedToUserId", checkAuthentication, WBSDB.getWmsJournalMovementClByAssignedToUserId);

router.put("/updateWmsJournalMovementClQtyScanned", checkAuthentication, WBSDB.updateWmsJournalMovementClQtyScanned);



//  ---------- WMS_Journal_Movement_CLDets API Start ----------


router.post("/insertJournalMovementCLDets", checkAuthentication, WBSDB.insertJournalMovementCLDets);

router.get("/getAllWmsJournalMovementClDets", checkAuthentication, WBSDB.getAllWmsJournalMovementClDets);


// ---- WMS_Journal_ProfitLost_CL APIS Start ----

router.post("/insertJournalProfitLostCL", checkAuthentication, WBSDB.insertJournalProfitLostCL);

router.get("/getAllWmsJournalProfitLostCL", checkAuthentication, WBSDB.getAllWmsJournalProfitLostCL);

router.get("/getWmsJournalProfitLostCLByAssignedToUserId", checkAuthentication, WBSDB.getWmsJournalProfitLostCLByAssignedToUserId);

router.put("/updateWmsJournalProfitLostClQtyScanned", checkAuthentication, WBSDB.updateWmsJournalProfitLostClQtyScanned);

// ---- WMS_Journal_ProfitLost_CLDets APIS Start ----

router.get("/getAllWmsJournalProfitLostClDets", checkAuthentication, WBSDB.getAllWmsJournalProfitLostClDets);
router.post("/insertJournalProfitLostClDets", checkAuthentication, WBSDB.insertJournalProfitLostClDets);



/// ---------- WMS_Journal_Counting and CL API Start ----
router.get("/getAllWmsJournalCounting", checkAuthentication, WBSDB.getAllWmsJournalCounting);

router.get("/getAllWmsJournalCountingCL", checkAuthentication, WBSDB.getAllWmsJournalCountingCL);



router.post("/insertWMSJournalCountingCL", checkAuthentication, WBSDB.insertWMSJournalCountingCL);

router.get("/getWmsJournalCountingCLByAssignedToUserId", checkAuthentication, WBSDB.getWmsJournalCountingCLByAssignedToUserId);

router.put("/updateWmsJournalCountingCLQtyScanned", checkAuthentication, WBSDB.updateWmsJournalCountingCLQtyScanned);


// ---------- WMS_Journal_CountingCLDets API End ----------

router.get("/getAllWmsJournalCountingCLDets", checkAuthentication, WBSDB.getAllWmsJournalCountingCLDets);
router.post("/insertWMSJournalCountingCLDets", checkAuthentication, WBSDB.insertWMSJournalCountingCLDets);


// -------------- WMS_Journal_Counting_OnlyCL API Start --------------

router.post("/insertIntoWmsJournalCountingOnlyCL", checkAuthentication, WBSDB.insertIntoWmsJournalCountingOnlyCL);

router.get("/getAllWmsJournalCountingOnlyCl", checkAuthentication, WBSDB.getAllWmsJournalCountingOnlyCl);

router.get("/getWmsJournalCountingOnlyCLByAssignedToUserId", checkAuthentication, WBSDB.getWmsJournalCountingOnlyCLByAssignedToUserId);

router.put("/incrementQTYSCANNEDInJournalCountingOnlyCL", checkAuthentication, WBSDB.incrementQTYSCANNEDInJournalCountingOnlyCL);

router.get("/getWmsJournalCountingOnlyCLByBinLocation", checkAuthentication, WBSDB.getWmsJournalCountingOnlyCLByBinLocation);
router.get("/getBinLocationByUserIdFromJournalCountingOnlyCL", checkAuthentication, WBSDB.getBinLocationByUserIdFromJournalCountingOnlyCL);


// -------------- WMS_Journal_Counting_OnlyCLDets API Start --------------


router.post("/insertIntoWmsJournalCountingOnlyCLDets", checkAuthentication, WBSDB.insertIntoWmsJournalCountingOnlyCLDets);

router.get("/getAllWmsJournalCountingOnlyCLDets", checkAuthentication, WBSDB.getAllWmsJournalCountingOnlyCLDets);

router.post("/validateItemSerialNumberForJournalCountingOnlyCLDets", checkAuthentication, WBSDB.validateItemSerialNumberForJournalCountingOnlyCLDets);



