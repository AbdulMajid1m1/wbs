import express from "express";
// import upload from "../config/multerConfig.js";
const router = express.Router();
import WBSDB from "../controllers/controlletrsMSSQL.js";
import { checkAuthentication, checkRole, generateToken } from "../helpers/apiAuth.js";
// import logoUpload from "../config/multerLogoConfig.js";


router.post("/getShipmentDataFromtShipmentReceiving", WBSDB.getShipmentDataFromtShipmentReceiving);
router.post("/getShipmentDataFromtShipmentReceivingCL", WBSDB.getShipmentDataFromtShipmentReceivingCL);
router.get("/getAllShipmentDataFromtShipmentReceiving", WBSDB.getAllShipmentDataFromtShipmentReceiving);
router.get("/getAllShipmentDataFromtShipmentReceived", WBSDB.getAllShipmentDataFromtShipmentReceived);
router.get("/getAllTblItems", WBSDB.getAllTblItems);
router.get("/getAllTblItemsCL", WBSDB.getAllTblItemsCL);

export default router;

