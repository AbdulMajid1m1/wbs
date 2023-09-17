import express from "express";
const router = express.Router();
import WBSDB from "../controllers/controlletrsMSSQL.js";
import { checkAuthentication, checkRole } from "../helpers/apiAuth.js";

import dotenv from "dotenv";
import upload from "../config/multerConfig.js";
import roles from "../utils/roles.js";
dotenv.config();

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

// import upload from "../config/multerConfig.js";
// import { checkAuthentication, checkRole, generateToken } from "../helpers/apiAuth.js";
// import logoUpload from "../config/multerLogoConfig.js";


// not using this api
router.post("/getShipmentDataFromtShipmentReceiving", checkAuthentication, checkRole([roles[31]]), WBSDB.getShipmentDataFromtShipmentReceiving);

router.get("/getShipmentDataFromtShipmentReceivingByContainerId", checkAuthentication, WBSDB.getShipmentDataFromtShipmentReceivingByContainerId);

router.post("/getShipmentDataFromtShipmentReceivingCL", checkAuthentication, WBSDB.getShipmentDataFromtShipmentReceivingCL);
// not using this api
// getShipmentReceivingCLByShipmentId


router.get("/getAllShipmentDataFromtShipmentReceiving", checkAuthentication, checkRole([roles[20], roles[31]]), WBSDB.getAllShipmentDataFromtShipmentReceiving);

router.get("/getTblShipmentReceivingQty", checkAuthentication, checkRole([roles[20], roles[31]]), WBSDB.getTblShipmentReceivingQty);


router.get("/getAllShipmentDataFromtShipmentReceived", checkAuthentication, WBSDB.getAllShipmentDataFromtShipmentReceived);


// dbo.expectedShipments APIS Start
router.get("/getAllExpectedShipments", checkAuthentication, checkRole([roles[19]]), WBSDB.getAllExpectedShipments);


// dbo.expectedShipments APIS End

// expectedTransferOrder APIS Start

router.get("/getAllExpectedTransferOrder", checkAuthentication, checkRole([roles[21], roles[32]]), WBSDB.getAllExpectedTransferOrder);
// TODO: uncommit the original query
router.get("/getExpectedTransferOrderByTransferId", checkAuthentication, checkRole([roles[21], roles[32]]), WBSDB.getExpectedTransferOrderByTransferId);

// expectedTransferOrder APIS End

// dbo.pickinglist APIS Start
router.get("/getAllPickingList", checkAuthentication, WBSDB.getAllPickingList);
// dbo.pickinglist APIS End



// to get all the packing slips from the PackingSlipTable  
router.get("/getAllPackingSlips", checkAuthentication, checkRole([roles[22]]), WBSDB.getAllPackingSlips);

// to get all the dispatching data from the tbl_Dispatching
router.get("/getAllTblDispatchingData", checkAuthentication, WBSDB.getAllTblDispatchingData);

// to get all the palletizing data from the tbl_Shipment_Palletizing
router.get("/getAllTblShipmentPalletizing", checkAuthentication, checkRole([roles[23]]), WBSDB.getAllTblShipmentPalletizing);




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
router.get("/getAllTblShipmentReceivedCL", checkAuthentication, checkRole([roles[2]]), WBSDB.getAllTblShipmentReceivedCL);
router.get("/getTblShipmentReceivedCLStats", checkAuthentication, WBSDB.getTblShipmentReceivedCLStats);

router.get("/validateShipmentIdFromShipmentReceivedCl", checkAuthentication, WBSDB.validateShipmentIdFromShipmentReceivedCl);
router.get("/getShipmentRecievedClCountByPoqtyContainerIdAndItemId", checkAuthentication, WBSDB.getShipmentRecievedClCountByPoqtyContainerIdAndItemId);

router.get("/getShipmentRecievedClCountByPoqtyShipmentIdAndItemId", checkAuthentication, WBSDB.getShipmentRecievedClCountByPoqtyShipmentIdAndItemId);

router.get("/getRemainingQtyFromShipmentCounter", checkAuthentication, WBSDB.getRemainingQtyFromShipmentCounter);

router.post("/getShipmentRecievedCLDataCByShipmentId", checkAuthentication, WBSDB.getShipmentRecievedCLDataCByShipmentId)

router.get("/getShipmentRecievedCLDataCByItemId", checkAuthentication, WBSDB.getShipmentRecievedCLDataCByItemId)

router.get("/getShipmentRecievedCLDataCBySerialNumber", checkAuthentication, WBSDB.getShipmentRecievedCLDataCBySerialNumber)

router.post("/getShipmentRecievedCLDataByPalletCode", checkAuthentication, checkRole([roles[40]]), WBSDB.getShipmentRecievedCLDataByPalletCode)

router.get("/getShipmentRecievedCLDataByPalletCodeAndBinLocation", checkAuthentication, WBSDB.getShipmentRecievedCLDataByPalletCodeAndBinLocation)

router.get("/getShipmentRecievedCLDataBySerialNumberAndBinLocation", checkAuthentication, WBSDB.getShipmentRecievedCLDataBySerialNumberAndBinLocation)



router.post("/insertShipmentRecievedDataCL", checkAuthentication, WBSDB.insertShipmentRecievedDataCL);

router.post("/generateSerialNumberforReceving", checkAuthentication, WBSDB.generateSerialNumberforReceving);

router.post("/generateSerialNumberforStockMasterAndInsertIntoMappedBarcode", checkAuthentication, WBSDB.generateSerialNumberforStockMasterAndInsertIntoMappedBarcode);

router.delete("/deleteShipmentRecievedDataCL", checkAuthentication, WBSDB.deleteShipmentRecievedDataCL);

router.put("/updateShipmentRecievedDataCL", checkAuthentication, checkRole([roles[40]]), WBSDB.updateShipmentRecievedDataCL);

// ----------- tbl_Shipment_Received_CL APIS End -----------------


// ----------- tbl_Shipment_Palletizing_CL APIS Start -----------------

// to get all the palletizing data from the tbl_Shipment_Palletizing_CL
router.get("/getAllTblShipmentPalletizingCL", checkAuthentication, checkRole([roles[12]]), WBSDB.getAllTblShipmentPalletizingCL);

router.post("/insertShipmentPalletizingDataCL", checkAuthentication, checkRole([roles[12]]), WBSDB.insertShipmentPalletizingDataCL);

router.delete("/deleteShipmentPalletizingDataCL", checkAuthentication, checkRole([roles[12]]), WBSDB.deleteShipmentPalletizingDataCL);

router.put("/updateShipmentPalletizingDataCL", checkAuthentication, checkRole([roles[12]]), WBSDB.updateShipmentPalletizingDataCL);


// ----------- tbl_Shipment_Palletizing_CL APIS End -----------------


// ----------- tbL_Picking_CL APIS Start -----------------

router.get("/getAllTblPickingCL", checkAuthentication, checkRole([roles[11]]), WBSDB.getAllTblPickingCL);

router.post("/insertTblPickingDataCL", checkAuthentication, checkRole([roles[11]]), WBSDB.insertTblPickingDataCL);

router.delete("/deleteTblPickingDataCL", checkAuthentication, checkRole([roles[11]]), WBSDB.deleteTblPickingDataCL);

router.put("/updateTblPickingDataCL", checkAuthentication, checkRole([roles[11]]), WBSDB.updateTblPickingDataCL);


// ----------- tbL_Picking_CL APIS End -----------------

// ----------- tbl_Dispatching_CL APIS Start -----------------

router.get("/getAllTblDispatchingCL", checkAuthentication, checkRole([roles[3]]), WBSDB.getAllTblDispatchingCL);

router.post("/insertTblDispatchingDataCL", checkAuthentication, checkRole([roles[3], roles[43]]), WBSDB.insertTblDispatchingDataCL);

router.post("/insertTblDispatchingDetailsDataCL", checkAuthentication, checkRole([roles[3], roles[43]]), WBSDB.insertTblDispatchingDetailsDataCL);

router.delete("/deleteTblDispatchingDataCL", checkAuthentication, checkRole([roles[3]]), WBSDB.deleteTblDispatchingDataCL);

router.put("/updateTblDispatchingDataCL", checkAuthentication, checkRole([roles[3]]), WBSDB.updateTblDispatchingDataCL);



// ----------- tbl_Dispatching_CL APIS End -----------------


// ----------- tbl_locations_CL  APIS Start -----------------

router.get("/getAllTblLocationsCL", checkAuthentication, checkRole([roles[4]]), WBSDB.getAllTblLocationsCL);

router.post("/insertTblLocationsDataCL", checkAuthentication, checkRole([roles[4]]), WBSDB.insertTblLocationsDataCL);

router.delete("/deleteTblLocationsDataCL", checkAuthentication, checkRole([roles[4]]), WBSDB.deleteTblLocationsDataCL);

router.put("/updateTblLocationsDataCL", checkAuthentication, checkRole([roles[4]]), WBSDB.updateTblLocationsDataCL);

// ----------- tbl_locations_CL  APIS End -----------------


// ----- tblUsers APIS Start ----------------- 

router.get("/getAllTblUsers", checkAuthentication, checkRole([roles[36]]), WBSDB.getAllTblUsers);

router.get("/getSingleTblUsers", checkAuthentication, WBSDB.getSingleTblUsers);

router.post("/insertTblUsersData", WBSDB.insertTblUsersData);

router.get("/getAllUsers", checkAuthentication, WBSDB.getAllUsers);

router.delete("/deleteTblUsersData", checkAuthentication, WBSDB.deleteTblUsersData);

router.put("/updateTblUsersData", checkAuthentication, WBSDB.updateTblUsersData);

router.post("/login", WBSDB.loginUser);

router.post("/logout", WBSDB.logout);

// ----- tblUsers APIS End -----------------


// -------------   Alessa Project: API's for mobile app ------------------------

router.post("/getDispatchingDataByPackingSlipId", checkAuthentication, WBSDB.getDispatchingDataByPackingSlipId);// tbl_Dispatching


// InventTableWMS controller -------

router.get("/getAllTblItems", checkAuthentication, checkRole([roles[18]]), WBSDB.getAllTblItems);

router.post("/getInventTableWMSDataByItemId", checkAuthentication, checkRole([roles[18]]), WBSDB.getInventTableWMSDataByItemId); // InventTableWMS 

router.post("/getInventTableWMSDataByItemIdOrItemName", checkAuthentication, checkRole([roles[41]]), WBSDB.getInventTableWMSDataByItemIdOrItemName); // InventTableWMS 


router.get("/getStockMasterDataByItemId", checkAuthentication, checkRole([roles[18]]), WBSDB.getStockMasterDataByItemId);


// --------------- tblMappedBarcodes APIS Start ------

router.get("/getAllTblMappedBarcodes", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[41]]), WBSDB.getAllTblMappedBarcodes);

router.get("/getAllTblMappedBarcodesDeleted", checkAuthentication, WBSDB.getAllTblMappedBarcodesDeleted);

router.get("/getLimitedTblMappedBarcodes", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[41]]), WBSDB.getLimitedTblMappedBarcodes);

router.get("/getAllDistinctItemCodesFromTblMappedBarcodes", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[41]]), WBSDB.getAllDistinctItemCodesFromTblMappedBarcodes);


router.post("/getAllTblMappedBarcodesByValueAndOperator", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[41]]), WBSDB.getAllTblMappedBarcodesByValueAndOperator);

router.post("/getmapBarcodeDataByItemCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]], [roles[32], roles[49]]), WBSDB.getmapBarcodeDataByItemCode); // tblMappedBarcodes

router.post("/getDistinctMapBarcodeDataByItemCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]], [roles[32], roles[49]]), WBSDB.getDistinctMapBarcodeDataByItemCode); // tblMappedBarcodes
router.post("/getOneMapBarcodeDataByItemCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]], [roles[32], roles[49]]), WBSDB.getOneMapBarcodeDataByItemCode); // tblMappedBarcodes

router.get("/getmapBarcodeDataByuser", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getmapBarcodeDataByuser); // tblMappedBarcodes

router.get("/getmapBarcodeDataByBinLocation", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getmapBarcodeDataByBinLocation);
router.post("/getmapBarcodeDataByMultipleBinLocations", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getmapBarcodeDataByMultipleBinLocations);

router.post("/insertIntoMappedBarcode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.insertIntoMappedBarcode);

router.post("/insertManyIntoMappedBarcode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[46]]), WBSDB.insertManyIntoMappedBarcode);


router.put("/updateTblMappedBarcodeByItemCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.updateTblMappedBarcodeByItemCode);

router.put("/updateTblMappedBarcodeBinLocation", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[44], roles[45], roles[47], roles[48], roles[49]]), WBSDB.updateTblMappedBarcodeBinLocation);

router.put("/updateTblMappedBarcodeBinLocationWithSelectionType", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.updateTblMappedBarcodeBinLocationWithSelectionType);

router.put("/updateTblMappedBarcodeByGtin", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.updateTblMappedBarcodeByGtin);

router.post("/checkBarcodeValidityByItemSerialNo", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.checkBarcodeValidityByItemSerialNo);

router.post("/getItemInfoByItemSerialNo", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getItemInfoByItemSerialNo);

router.post("/getMappedBarcodedsByItemDesc", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getMappedBarcodedsByItemDesc);

router.post("/getMappedBarcodedsByItemSerialNoAndBinLocation", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getMappedBarcodedsByItemSerialNoAndBinLocation);

router.put("/updateMappedBarcodesBinLocationBySerialNo", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.updateMappedBarcodesBinLocationBySerialNo);

router.post("/insertIntoMappedBarcodeOrUpdateBySerialNo", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[41]]), WBSDB.insertIntoMappedBarcodeOrUpdateBySerialNo);

router.put("/updateMappedBarcodesBinLocationByPalletCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.updateMappedBarcodesBinLocationByPalletCode);

router.put("/updateMappedBarcodesByPalletCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.updateMappedBarcodesByPalletCode);

router.post("/getItemInfoByPalletCode", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getItemInfoByPalletCode);

router.post("/getMappedBarcodedsByPalletCodeAndBinLocation", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.getMappedBarcodedsByPalletCodeAndBinLocation);

router.post("/getMappedBarcodedsByItemCodeAndBinLocation", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[49]]), WBSDB.getMappedBarcodedsByItemCodeAndBinLocation);



router.delete("/deleteTblMappedBarcodesDataBySerialNumber", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35]]), WBSDB.deleteTblMappedBarcodesDataBySerialNumber);


router.get("/getDistinctMappedBarcodeBinLocations", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[39]]), WBSDB.getDistinctMappedBarcodeBinLocations);

router.get("/getDistinctMappedBarcodeItemIds", checkAuthentication, checkRole([roles[13], roles[32], roles[33], roles[34], roles[35], roles[39]]), WBSDB.getDistinctMappedBarcodeItemIds);

// ------------- tblMappedBarcodes APIS End -------- 



// ------------- tbl_RZONES APIS Start -------------

router.get("/getAllTblRZones", checkAuthentication, checkRole([roles[42]]), WBSDB.getAllTblRZones);

router.post("/insertIntoRzone", checkAuthentication, checkRole([roles[42]]), WBSDB.insertIntoRzone);

router.put("/updateRzoneData", checkAuthentication, checkRole([roles[42]]), WBSDB.updateRzoneData);

router.delete("/deleteRzoneData", checkAuthentication, checkRole([roles[42]]), WBSDB.deleteRzoneData);

// ------------- tbl_RZONES APIS End ---------------


// ------------- Transfer_Distribution APIS Start -------------


router.get("/getTransferDistributionByTransferId", checkAuthentication, WBSDB.getTransferDistributionByTransferId);

// ------------- Transfer_Distribution APIS End ---------------


// ------------- tbl_Shipment_Palletizing APIS Start -------------

router.get("/getShipmentPalletizingByTransferId", checkAuthentication, checkRole([roles[42]]), WBSDB.getShipmentPalletizingByTransferId);

router.get("/vaildatehipmentPalletizingSerialNumber", checkAuthentication, checkRole([roles[42]]), WBSDB.vaildatehipmentPalletizingSerialNumber);

router.post("/generateAndUpdatePalletIds", checkAuthentication, checkRole([roles[42]]), WBSDB.generateAndUpdatePalletIds);

// ------------- tbl_Shipment_Palletizing APIS End ---------------


// ------------- tbl_locations_CL APIS Start ------------- 


router.get("/validateZoneCode", checkAuthentication, WBSDB.validateZoneCode);


// ---------------- EMAIL API -----------------------------

router.post('/sendEmail', upload.array('attachments'), WBSDB.sendEmail);

// ---------------- EMAIL API -----------------------------




// ----------------- tbl_TransferBinToBin_CL APIS Start -----------------

router.post("/insertTblTransferBinToBinCL", checkAuthentication, WBSDB.insertTblTransferBinToBinCL);

router.get("/getQtyReceivedFromTransferBinToBinCl", checkAuthentication, WBSDB.getQtyReceivedFromTransferBinToBinCl);

// ----------------- tbl_TransferBinToBin_CL APIS End -----------------


// ----------------- tbl_TransferJournal APIS Start -----------------

router.get("/getTransferJournalCLByJournalId", checkAuthentication, checkRole([roles[34]]), WBSDB.getTransferJournalCLByJournalId);

router.get("/getAllTransferJournal", checkAuthentication, checkRole([roles[25]]), WBSDB.getAllTransferJournal);


// ----------------- tbl_TransferJournal_CL APIS End -----------------

//-------- tbl_Item-Master APIS Start -----------

router.put("/updateTblItemMaster", checkAuthentication, WBSDB.updateTblItemMaster);




// ---- item-Re-Allocation APIS Start ----

router.post("/manageItemsReallocation", checkAuthentication, WBSDB.manageItemsReallocation);
router.delete("/deleteItemsReAllocationPickedByItemSerialNo", checkAuthentication, WBSDB.deleteItemsReAllocationPickedByItemSerialNo);

// ---- item-Re-Allocation APIS End ----


// ------- tbl_Stock_Master APIS Start --------


router.get("/getAllTblStockMaster", checkAuthentication, checkRole([roles[1], roles[36]]), WBSDB.getAllTblStockMaster);

router.get("/getItemIdsbySearchText", checkAuthentication, checkRole([roles[1], roles[36]]), WBSDB.getItemIdsbySearchText);

router.get("/insertDataFromInventTableWmsToStockMaster", checkAuthentication, checkRole([roles[1], roles[36]]), WBSDB.insertDataFromInventTableWmsToStockMaster);
router.get("/insertDataFromTable1ToTable2", checkAuthentication, checkRole([roles[1], roles[36]]), WBSDB.insertDataFromTable1ToTable2);

router.get("/getTblStockMasterByItemId", checkAuthentication, WBSDB.getTblStockMasterByItemId);

router.post("/insertStockMasterData", checkAuthentication, WBSDB.insertStockMasterData);

router.put("/updateStockMasterData", checkAuthentication, WBSDB.updateStockMasterData);

router.put("/updateQtyReceivedInTblStockMaster", checkAuthentication, WBSDB.updateQtyReceivedInTblStockMaster);


router.delete("/deleteStockMasterDataByItemId", checkAuthentication, WBSDB.deleteStockMasterDataByItemId);
// --- tbl_ItemsReAllocationPicked APIS Start ---
router.get("/getAllItemsReAllocationPicked", checkAuthentication, checkRole([roles[14]]), WBSDB.getAllItemsReAllocationPicked);


// --- tbl_ItemsReAllocationPicked APIS End ---


/// ----- tbl_TransferBinToBin_CL APIS Start -----
router.get("/getAllTransferBinToBinCL", checkAuthentication, checkRole([roles[15]]), WBSDB.getAllTransferBinToBinCL);

// ----- WMS_Sales_PickingList_CL APIS Start -----

router.get("/getAllWmsSalesPickingListClFromAlessia", checkAuthentication, checkRole([roles[15], roles[24]]), WBSDB.getAllWmsSalesPickingListClFromAlessia);

router.get("/getAllWmsSalesPickingListClFromWBS", checkAuthentication, checkRole([roles[15], roles[26]]), WBSDB.getAllWmsSalesPickingListClFromWBS);

router.post("/insertPickingListDataCLIntoWBS", checkAuthentication, checkRole([roles[15]]), WBSDB.insertPickingListDataCLIntoWBS);

router.get("/getAllWmsSalesPickingListClFromWBSByPickingRouteId", checkAuthentication, checkRole([roles[15]], roles[26], roles[44]), WBSDB.getAllWmsSalesPickingListClFromWBSByPickingRouteId);


// packingsliptable_CL APIS Start -----
router.post("/insertIntoPackingSlipTableClAndUpdateWmsSalesPickingListCl", checkAuthentication, WBSDB.insertIntoPackingSlipTableClAndUpdateWmsSalesPickingListCl);
router.get("/getPackingSlipTableClByItemIdAndPackingSlipId", checkAuthentication, WBSDB.getPackingSlipTableClByItemIdAndPackingSlipId);
router.post("/insertIntoPackingSlipTableCl", checkAuthentication, WBSDB.insertIntoPackingSlipTableCl);


// packingsliptable APIS Start -----

router.get("/getPackingSlipTableByPackingSlipId", checkAuthentication, checkRole([roles[43]]), WBSDB.getPackingSlipTableByPackingSlipId);

export default router;



// WMS_ReturnSalesOrder APIS Start -----

router.get("/getWmsReturnSalesOrderByReturnItemNum", checkAuthentication, checkRole([roles[45], roles[48]]), WBSDB.getWmsReturnSalesOrderByReturnItemNum);

router.get("/getAllWmsReturnSalesOrder", checkAuthentication, checkRole([roles[27]]), WBSDB.getAllWmsReturnSalesOrder);



// WMS_ReturnSalesOrder_CL APIS Start -----

router.get("/getAllWmsReturnSalesOrderCl", checkAuthentication, checkRole([roles[8]]), WBSDB.getAllWmsReturnSalesOrderCl);

router.post("/insertIntoWmsReturnSalesOrderCl", checkAuthentication, checkRole([roles[8]]), WBSDB.insertIntoWmsReturnSalesOrderCl);

router.get("/getWmsReturnSalesOrderClByAssignedToUserId", checkAuthentication, checkRole([roles[8], roles[46]]), WBSDB.getWmsReturnSalesOrderClByAssignedToUserId);
router.post("/getWmsReturnSalesOrderClCountByItemIdAndReturnItemNumAndSalesId", checkAuthentication, checkRole([roles[8], roles[46]]), WBSDB.getWmsReturnSalesOrderClCountByItemIdAndReturnItemNumAndSalesId);

router.delete("/deleteMultipleRecordsFromWmsReturnSalesOrderCl", checkAuthentication, checkRole([roles[8], roles[46]]), WBSDB.deleteMultipleRecordsFromWmsReturnSalesOrderCl);

// WMS_Journal_ProfitLost APIS Start -----


router.get("/getAllWmsJournalProfitLost", checkAuthentication, checkRole([roles[28]]), WBSDB.getAllWmsJournalProfitLost);



// WMS_Journal_Movement APIS Start -----


router.get("/getAllWmsJournalMovement", checkAuthentication, checkRole([roles[29]]), WBSDB.getAllWmsJournalMovement);




// WMS_Journal_Counting APIS Start ----- .


router.get("/getAllWmsJournalCounting", checkAuthentication, checkRole([roles[30]]), WBSDB.getAllWmsJournalCounting);

router.post("/generateBarcodeForRma", checkAuthentication, WBSDB.generateBarcodeForRma);



//  ---------- WMS_Journal_Movement_CL API Start ----------

router.post("/insertJournalMovementCLData", checkAuthentication, checkRole([roles[5]]), WBSDB.insertJournalMovementCLData);

router.get("/getAllWmsJournalMovementCl", checkAuthentication, checkRole([roles[5]]), WBSDB.getAllWmsJournalMovementCl);

router.get("/getWmsJournalMovementClByAssignedToUserId", checkAuthentication, checkRole([roles[5], roles[47]]), WBSDB.getWmsJournalMovementClByAssignedToUserId);

router.put("/updateWmsJournalMovementClQtyScanned", checkAuthentication, checkRole([roles[5]]), WBSDB.updateWmsJournalMovementClQtyScanned);



//  ---------- WMS_Journal_Movement_CLDets API Start ----------


router.get("/getAllWmsJournalMovementClDets", checkAuthentication, checkRole([roles[5]]), WBSDB.getAllWmsJournalMovementClDets);

router.post("/validateItemSerialNumberForJournalMovementCLDets", checkAuthentication, WBSDB.validateItemSerialNumberForJournalMovementCLDets);

router.post("/insertJournalMovementCLDets", checkAuthentication, WBSDB.insertJournalMovementCLDets);



// ---- WMS_Journal_ProfitLost_CL APIS Start ----

router.post("/insertJournalProfitLostCL", checkAuthentication, checkRole([roles[6]]), WBSDB.insertJournalProfitLostCL);

router.get("/getAllWmsJournalProfitLostCL", checkAuthentication, checkRole([roles[6]]), WBSDB.getAllWmsJournalProfitLostCL);

router.get("/getWmsJournalProfitLostCLByAssignedToUserId", checkAuthentication, checkRole([roles[6], roles[48]]), WBSDB.getWmsJournalProfitLostCLByAssignedToUserId);

router.put("/updateWmsJournalProfitLostClQtyScanned", checkAuthentication, checkRole([roles[6]]), WBSDB.updateWmsJournalProfitLostClQtyScanned);

// ---- WMS_Journal_ProfitLost_CLDets APIS Start ----

router.get("/getAllWmsJournalProfitLostClDets", checkAuthentication, WBSDB.getAllWmsJournalProfitLostClDets);
router.post("/insertJournalProfitLostClDets", checkAuthentication, WBSDB.insertJournalProfitLostClDets);



/// ---------- WMS_Journal_Counting and CL API Start ----
router.get("/getAllWmsJournalCounting", checkAuthentication, WBSDB.getAllWmsJournalCounting);

router.get("/getAllWmsJournalCountingCL", checkAuthentication, checkRole([roles[7]]), WBSDB.getAllWmsJournalCountingCL);



router.post("/insertWMSJournalCountingCL", checkAuthentication, checkRole([roles[7]]), WBSDB.insertWMSJournalCountingCL);

router.get("/getWmsJournalCountingCLByAssignedToUserId", checkAuthentication, checkRole([roles[7], roles[49]]), WBSDB.getWmsJournalCountingCLByAssignedToUserId);

router.put("/updateWmsJournalCountingCLQtyScanned", checkAuthentication, checkRole([roles[7], roles[49]]), WBSDB.updateWmsJournalCountingCLQtyScanned);


// ---------- WMS_Journal_CountingCLDets API End ----------

router.get("/getAllWmsJournalCountingCLDets", checkAuthentication, WBSDB.getAllWmsJournalCountingCLDets);

router.post("/insertWMSJournalCountingCLDets", checkAuthentication, checkRole([roles[49]]), WBSDB.insertWMSJournalCountingCLDets);


// -------------- WMS_Journal_Counting_OnlyCL API Start --------------

router.post("/insertIntoWmsJournalCountingOnlyCL", checkAuthentication, checkRole([roles[9], roles[37], roles[38], roles[39]]), WBSDB.insertIntoWmsJournalCountingOnlyCL);

router.get("/getAllWmsJournalCountingOnlyCl", checkAuthentication, checkRole([roles[9], roles[37], roles[38]]), WBSDB.getAllWmsJournalCountingOnlyCl);

router.get("/getWmsJournalCountingOnlyCLByAssignedToUserId", checkAuthentication, checkRole([roles[9], roles[37], roles[38]]), WBSDB.getWmsJournalCountingOnlyCLByAssignedToUserId);

router.put("/incrementQTYSCANNEDInJournalCountingOnlyCL", checkAuthentication, checkRole([roles[9], roles[37], roles[38]]), WBSDB.incrementQTYSCANNEDInJournalCountingOnlyCL);

router.put("/incrementQTYSCANNEDInJournalCountingOnlyCLByBinLocation", checkAuthentication, checkRole([roles[9], roles[37], roles[38]]), WBSDB.incrementQTYSCANNEDInJournalCountingOnlyCLByBinLocation);

router.get("/getWmsJournalCountingOnlyCLByBinLocation", checkAuthentication, checkRole([roles[9], roles[37], roles[38]]), WBSDB.getWmsJournalCountingOnlyCLByBinLocation);

router.get("/getBinLocationByUserIdFromJournalCountingOnlyCL", checkAuthentication, checkRole([roles[9], roles[37], roles[38]]), WBSDB.getBinLocationByUserIdFromJournalCountingOnlyCL);


// -------------- WMS_Journal_Counting_OnlyCLDets API Start --------------


router.post("/insertIntoWmsJournalCountingOnlyCLDets", checkAuthentication, checkRole([roles[37], roles[38]]), WBSDB.insertIntoWmsJournalCountingOnlyCLDets);


router.get("/getAllWmsJournalCountingOnlyCLDets", checkAuthentication, WBSDB.getAllWmsJournalCountingOnlyCLDets);

router.post("/validateItemSerialNumberForJournalCountingOnlyCLDets", checkAuthentication, checkRole([roles[37], roles[38]]), WBSDB.validateItemSerialNumberForJournalCountingOnlyCLDets);



// ---------- WMS_TruckMaster API Start ----------

router.get("/getAllWmsTruckMaster", checkAuthentication, WBSDB.getAllWmsTruckMaster);

router.post("/insertTruckMasterData", checkAuthentication, WBSDB.insertTruckMasterData);

router.delete("/deleteTruckMasterData", checkAuthentication, WBSDB.deleteTruckMasterData);

router.put("/updateTruckMasterData", checkAuthentication, WBSDB.updateTruckMasterData);
// ---------- tblZones API Start ----------

router.get("/getAlltblZones", checkAuthentication, WBSDB.getAlltblZones);

router.post("/insertZonesData", checkAuthentication, WBSDB.insertZonesData);

router.put("/updateZonesData", checkAuthentication, WBSDB.updateZonesData);

router.delete("/deleteZonesData", checkAuthentication, WBSDB.deleteZonesData);

// ----- tblPalletMaster APIS Start -----

router.get("/getAlltblPalletMaster", checkAuthentication, WBSDB.getAlltblPalletMaster);

router.post("/insertPalletMasterData", checkAuthentication, WBSDB.insertPalletMasterData);

router.put("/updatePalletMasterData", checkAuthentication, WBSDB.updatePalletMasterData);

router.delete("/deletePalletMasterData", checkAuthentication, WBSDB.deletePalletMasterData);

// --------- tblBinLocation APIs start ---------

router.get("/getAlltblBinLocations", checkAuthentication, WBSDB.getAlltblBinLocation);

router.post("/insertBinLocationData", checkAuthentication, WBSDB.insertBinLocationData);

router.put("/updateBinLocationData", checkAuthentication, WBSDB.updateBinLocationData);

router.delete("/deleteBinLocationData", checkAuthentication, WBSDB.deleteBinLocationData);


// --------- tbl_TransactionHistory APIs start ---------


router.post("/insertTransactionHistoryData", checkAuthentication, WBSDB.insertTransactionHistoryData);

router.get("/getTransactionHistoryData", checkAuthentication, WBSDB.getTransactionHistoryData);


router.put("/updateTransactionHistoryData", checkAuthentication, WBSDB.updateTransactionHistoryData);

router.delete("/deleteTransactionHistoryData", checkAuthentication, WBSDB.deleteTransactionHistoryData);


// ---------- tblRoles API Start ----------

router.get("/getAlltblRoles", WBSDB.getAlltblRoles);


// ---------- tblUserRoles API Start ----------


router.get("/getAlltblUserRoles", checkAuthentication, WBSDB.getAlltblUserRoles);

router.post("/insertUserRoleData", checkAuthentication, WBSDB.insertUserRoleData);

// ----------- tblUserRolesAssignedToUser API Start ------------

router.get("/getRolesAssignedToUser", checkAuthentication, checkRole([roles[51]]), WBSDB.getRolesAssignedToUser);

router.post("/insertUserRoleAssignedData", checkAuthentication, checkRole([roles[51]]), WBSDB.insertUserRoleAssignedData);

router.delete("/deleteUserRoleAssignedData/:RoleId", checkAuthentication, checkRole([roles[51]]), WBSDB.deleteUserRoleAssignedData);


// --------- tbl_DZONES APIs start ---------

router.get("/getAllTblDZones", checkAuthentication, WBSDB.getAllTblDZones);

// POST - Add a new record to tbl_DZONES
router.post("/insertIntoDzone", checkAuthentication, WBSDB.insertIntoDzone);

// PUT - Update a record in tbl_DZONES
router.put("/updateDzoneData", checkAuthentication, WBSDB.updateDzoneData);

// DELETE - Delete a record from tbl_DZONES
router.delete("/deleteDzoneData", checkAuthentication, WBSDB.deleteDzoneData);
// --------- tbl_Shipment_Counter APIs start ---------

router.put("/updateRemainingQtyInTblShipmentCounter", checkAuthentication, WBSDB.updateRemainingQtyInTblShipmentCounter);

// --------- tbl_StockInventory APIs end ---------
router.get("/getAlltblStockInventory", checkAuthentication, WBSDB.getAlltblStockInventory);


// --------- tbl_StockInventory_Location  APIs start ---------
router.get("/getAlltbltblStockInventoryLocation", checkAuthentication, WBSDB.getAlltbltblStockInventoryLocation);
