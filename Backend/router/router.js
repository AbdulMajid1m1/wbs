import express from "express";
import upload from "../config/multerConfig.js";

const router = express.Router();

import FATSDBODBC from "../controllers/controllersODBC.js";


import FATSDB from "../controllers/controlletrsMSSQL.js";
import { checkAuthentication, checkRole, generateToken } from "../helpers/apiAuth.js";
import logoUpload from "../config/multerLogoConfig.js";

// //get all
// router.get("/getAllAssetMasterEncodeAssetCapture",FATSDBODBC.getAllAssetMasterEncodeAssetCapture);
// router.get("/getAllAssetMasterEncodeAssetCaptureFinal",FATSDBODBC.getAllAssetMasterEncodeAssetCaptureFinal);
// router.get("/getAllEmployeeList",FATSDBODBC.getAllEmployeeList);
// router.get("/getAllNewDepartmentLit",FATSDBODBC.getAllNewDepartmentLit);
// router.get("/getAllusers",FATSDBODBC.getAllusers);
// router.get("/getAllRegion",FATSDBODBC.getAllRegion);
// router.get("/getAllCity",FATSDBODBC.getAllCity);
// router.get("/getAllCityMaster",FATSDBODBC.getAllCityMaster);
// router.get("/getAllAssetRequestMaster",FATSDBODBC.getAllAssetRequestMaster);
// router.get("/getAllAssetRequestDetails",FATSDBODBC.getAllAssetRequestDetails);
// router.get("/getAllAssetCondition",FATSDBODBC.getAllAssetCondition);
// router.get("/getAllMAINCATEGORY",FATSDBODBC.getAllMAINCATEGORY);
// router.get("/getAllMAINSUBSeriesNo",FATSDBODBC.getAllMAINSUBSeriesNo);
// router.get("/getAllmakelist",FATSDBODBC.getAllmakelist);
// router.get("/getAllCountry",FATSDBODBC.getAllAssetMasterEncodeAssetCapture);
// router.get("/getAllInvJournalMaster",FATSDBODBC.getAllInvJournalMaster);
// router.get("/getAllLocationTags",FATSDBODBC.getAllLocationTags);
// router.get("/getAllUsersRoles",FATSDBODBC.getAllUsersRoles);
// router.get("/getAllUsersRolesAssigned",FATSDBODBC.getAllUsersRolesAssigned);
// router.get("/getAllUsersDepartment",FATSDBODBC.getAllUsersDepartment);
// router.get("/getAllfloors",FATSDBODBC.getAllfloors);
// router.get("/getAllassetsphoto",FATSDBODBC.getAllassetsphoto);
// //get by id
// router.get("/getAssetMasterEncodeAssetCaptureById",FATSDBODBC.getAssetMasterEncodeAssetCaptureById);
// router.get("/getAssetMasterEncodeAssetCaptureFinalById",FATSDBODBC.getAssetMasterEncodeAssetCaptureFinalById);
// router.get("/getEmployeeListById",FATSDBODBC.getEmployeeListById);
// router.get("/getNewDepartmentLitById",FATSDBODBC.getNewDepartmentLitById);
// router.get("/getusersById",FATSDBODBC.getusersById);
// router.get("/getRegionById",FATSDBODBC.getRegionById);
// router.get("/getCityById",FATSDBODBC.getCityById);
// router.get("/getCityMasterById",FATSDBODBC.getCityMasterById);
// router.get("/getAssetRequestMasterById",FATSDBODBC.getAssetRequestMasterById);
// router.get("/getAssetRequestDetailsById",FATSDBODBC.getAssetRequestDetailsById);
// router.get("/getAssetConditionById",FATSDBODBC.getAssetConditionById);
// router.get("/getMAINCATEGORYById",FATSDBODBC.getMAINCATEGORYById);
// router.get("/getMAINSUBSeriesNoById",FATSDBODBC.getMAINSUBSeriesNoById);
// router.get("/getmakelistById",FATSDBODBC.getmakelistById);
// router.get("/getCountryById",FATSDBODBC.getAssetMasterEncodeAssetCaptureById);
// router.get("/getInvJournalMasterById",FATSDBODBC.getInvJournalMasterById);
// router.get("/getLocationTagsById",FATSDBODBC.getLocationTagsById);
// router.get("/getUsersRolesById",FATSDBODBC.getUsersRolesById);
// router.get("/getUsersRolesAssignedById",FATSDBODBC.getUsersRolesAssignedById);
// router.get("/getUsersDepartmentById",FATSDBODBC.getUsersDepartmentById);
// router.get("/getfloorsById",FATSDBODBC.getfloorsById);
// router.get("/getassetsphotoById",FATSDBODBC.getassetsphotoById);
// // delete by id
// router.delete("/deleteAssetMasterEncodeAssetCaptureById",FATSDBODBC.deleteAssetMasterEncodeAssetCaptureById);
// router.delete("/deleteAssetMasterEncodeAssetCaptureFinalById",FATSDBODBC.deleteAssetMasterEncodeAssetCaptureFinalById);
// router.delete("/deleteEmployeeListById",FATSDBODBC.deleteEmployeeListById);
// router.delete("/deleteNewDepartmentLitById",FATSDBODBC.deleteNewDepartmentLitById);
// router.delete("/deleteusersById",FATSDBODBC.deleteusersById);
// router.delete("/deleteRegionById",FATSDBODBC.deleteRegionById);
// router.delete("/deleteCityById",FATSDBODBC.deleteCityById);
// router.delete("/deleteCityMasterById",FATSDBODBC.deleteCityMasterById);
// router.delete("/deleteAssetRequestMasterById",FATSDBODBC.deleteAssetRequestMasterById);
// router.delete("/deleteAssetRequestDetailsById",FATSDBODBC.deleteAssetRequestDetailsById);
// router.delete("/deleteAssetConditionById",FATSDBODBC.deleteAssetConditionById);
// router.delete("/deleteMAINCATEGORYById",FATSDBODBC.deleteMAINCATEGORYById);
// router.delete("/deleteMAINSUBSeriesNoById",FATSDBODBC.deleteMAINSUBSeriesNoById);
// router.delete("/deletemakelistById",FATSDBODBC.deletemakelistById);
// router.delete("/deleteCountryById",FATSDBODBC.deleteAssetMasterEncodeAssetCaptureById);
// router.delete("/deleteInvJournalMasterById",FATSDBODBC.deleteInvJournalMasterById);
// router.delete("/deleteLocationTagsById",FATSDBODBC.deleteLocationTagsById);
// router.delete("/deleteUsersRolesById",FATSDBODBC.deleteUsersRolesById);
// router.delete("/deleteUsersRolesAssignedById",FATSDBODBC.deleteUsersRolesAssignedById);
// router.delete("/deleteUsersDepartmentById",FATSDBODBC.deleteUsersDepartmentById);
// router.delete("/deletefloorsById",FATSDBODBC.deletefloorsById);
// router.delete("/deleteassetsphotoById",FATSDBODBC.deleteassetsphotoById);
// // post data
// router.post("/postAssetMasterEncodeAssetCapture",FATSDBODBC.postAssetMasterEncodeAssetCapture);
// router.post("/postAssetMasterEncodeAssetCaptureFinal",FATSDBODBC.postAssetMasterEncodeAssetCaptureFinal);
// router.post("/postEmployeeList",FATSDBODBC.postEmployeeList);
// router.post("/postNewDepartmentLit",FATSDBODBC.postNewDepartmentLit);
// router.post("/postusers",FATSDBODBC.postusers);
// router.post("/postRegion",FATSDBODBC.postRegion);
// router.post("/postCity",FATSDBODBC.postCity);
// router.post("/postCityMaster",FATSDBODBC.postCityMaster);
// router.post("/postAssetRequestMaster",FATSDBODBC.postAssetRequestMaster);
// router.post("/postAssetRequestDetails",FATSDBODBC.postAssetRequestDetails);
// router.post("/postAssetCondition",FATSDBODBC.postAssetCondition);
// router.post("/postMAINCATEGORY",FATSDBODBC.postMAINCATEGORY);
// router.post("/postMAINSUBSeriesNo",FATSDBODBC.postMAINSUBSeriesNo);
// router.post("/postmakelist",FATSDBODBC.postmakelist);
// router.post("/postCountry",FATSDBODBC.postAssetMasterEncodeAssetCapture);
// router.post("/postInvJournalMaster",FATSDBODBC.postInvJournalMaster);
// router.post("/postLocationTags",FATSDBODBC.postLocationTags);
// router.post("/postUsersRoles",FATSDBODBC.postUsersRoles);
// router.post("/postUsersRolesAssigned",FATSDBODBC.postUsersRolesAssigned);
// router.post("/postUsersDepartment",FATSDBODBC.postUsersDepartment);
// router.post("/postfloors",FATSDBODBC.postfloors);
// router.post("/postassetsphoto",FATSDBODBC.postassetsphoto);
// //Update
// router.put("/updateAssetMasterEncodeAssetCaptureById",FATSDBODBC.updateAssetMasterEncodeAssetCaptureById);
// router.put("/updateAssetMasterEncodeAssetCaptureFinalById",FATSDBODBC.updateAssetMasterEncodeAssetCaptureFinalById);
// router.put("/updateEmployeeListById",FATSDBODBC.updateEmployeeListById);
// router.put("/updateNewDepartmentLitById",FATSDBODBC.updateNewDepartmentLitById);
// router.put("/updateusersById",FATSDBODBC.updateusersById);
// router.put("/updateRegionById",FATSDBODBC.updateRegionById);
// router.put("/updateCityById",FATSDBODBC.updateCityById);
// router.put("/updateCityMasterById",FATSDBODBC.updateCityMasterById);
// router.put("/updateAssetRequestMasterById",FATSDBODBC.updateAssetRequestMasterById);
// router.put("/updateAssetRequestDetailsById",FATSDBODBC.updateAssetRequestDetailsById);
// router.put("/updateAssetConditionById",FATSDBODBC.updateAssetConditionById);
// router.put("/updateMAINCATEGORYById",FATSDBODBC.updateMAINCATEGORYById);
// router.put("/updateMAINSUBSeriesNoById",FATSDBODBC.updateMAINSUBSeriesNoById);
// router.put("/updatemakelistById",FATSDBODBC.updatemakelistById);
// router.put("/updateCountryById",FATSDBODBC.updateAssetMasterEncodeAssetCaptureById);
// router.put("/updateInvJournalMasterById",FATSDBODBC.updateInvJournalMasterById);
// router.put("/updateLocationTagsById",FATSDBODBC.updateLocationTagsById);
// router.put("/updateUsersRolesById",FATSDBODBC.updateUsersRolesById);
// router.put("/updateUsersRolesAssignedById",FATSDBODBC.updateUsersRolesAssignedById);
// router.put("/updateUsersDepartmentById",FATSDBODBC.updateUsersDepartmentById);
// router.put("/updatefloorsById",FATSDBODBC.updatefloorsById);
// router.put("/updateassetsphotoById",FATSDBODBC.updateassetsphotoById);

//mssql ..........................................................................................................................

//get all
router.get("/checkAuthentication", checkAuthentication, checkRole([1]), (req, res) => {
  res.status(200).send("authenticated");
});
router.get("/userRoles", checkAuthentication, (req, res) => {
  if (req.token.assignedRoles.length == 0) res.status(200).send([]);
  res.status(200).send(req.token.assignedRoles);
});


// company data 
router.post("/postCompanyData", checkAuthentication, checkRole([1]), logoUpload.single("logo"), FATSDB.postCompanyData);
router.get("/getCompanyData", checkAuthentication, checkRole([1]), FATSDB.getCompanyData);
router.get("/GetLogoImage", checkAuthentication, FATSDB.GetLogoImage);
router.get("/getAllAssetMasterEncodeAssetCaptureWithNoTag", checkAuthentication, FATSDB.getAllAssetMasterEncodeAssetCaptureWithNoTag)
router.get("/getToken", generateToken);
router.get(
  "/GetAllAssetMasterEncodeAssetCapture",
  checkAuthentication,
  checkRole([3, 1]),
  FATSDB.getAllAssetMasterEncodeAssetCapture
);
router.get(
  "/GetAllAssetMasterEncodeAssetCaptureFinal",
  checkAuthentication,
  checkRole([4, 1]),
  FATSDB.getAllAssetMasterEncodeAssetCaptureFinal
);
router.get(
  "/getAssetMasterEncodeAssetCaptureFinalByEmpId/:id",
  checkAuthentication,
  FATSDB.getAssetMasterEncodeAssetCaptureFinalByEmpId
);
router.get(
  "/getStats",
  checkAuthentication,
  checkRole([1]),
  FATSDB.getStats
);
router.get(
  "/getAssetMasterEncodeAssetCaptureFinalByLocationTag/:tag",
  checkAuthentication,
  checkRole([6, 1]),
  FATSDB.getAssetMasterEncodeAssetCaptureFinalByLocationTag
);

/// update tag numbers
router.get(
  "/UpdateAssetMasterEncodeAssetCaptureTagNumber",
  checkAuthentication,
  checkRole([2, 1]),
  FATSDB.UpdateAssetMasterEncodeAssetCaptureTagNumber
);
router.get(
  "/GetAllEmployeeList",
  checkAuthentication,
  FATSDB.getAllEmployeeList
);
router.get(
  "/GetAllNewDepartmentLit",
  checkAuthentication,
  FATSDB.getAllNewDepartmentLit
);
router.get("/GetAllusers", checkAuthentication,
  checkRole([1]),
  FATSDB.getAllusers);
router.post("/login", FATSDB.UserLoginAuth);
router.get("/GetAllRegion", checkAuthentication, FATSDB.getAllRegion);
router.get("/GetAllCity", checkAuthentication, FATSDB.getAllCity);
router.get("/GetAllCityMaster", checkAuthentication, FATSDB.getAllCityMaster);

router.get(
  "/GetAllAssetRequestMaster",
  checkAuthentication,
  FATSDB.getAllAssetRequestMaster
);
router.get(
  "/GetAllAssetRequestDetails",
  checkAuthentication,
  FATSDB.getAllAssetRequestDetails
);
router.get(
  "/GetAllAssetCondition",
  checkAuthentication,
  FATSDB.getAllAssetCondition
);
router.get(
  "/GetAllAssetConditionBought",
  checkAuthentication,
  FATSDB.getAllAssetConditionBought
);
router.get(
  "/GetAllMAINCATEGORY",
  checkAuthentication,
  FATSDB.getAllMAINCATEGORY
);
router.get(
  "/GetAllMAINSUBSeriesNo",
  checkAuthentication,
  FATSDB.getAllMAINSUBSeriesNo
);
router.get("/GetAllmakelist", checkAuthentication, FATSDB.getAllmakelist);
router.get("/GetAllCountry", checkAuthentication,
  checkRole([9, 1]),
  FATSDB.getAllCountry);
router.get(
  "/GetAllInvJournalMaster",
  checkAuthentication,
  FATSDB.getAllInvJournalMaster
);
router.get(
  "/GetAllLocationTags",
  checkAuthentication,
  FATSDB.getAllLocationTags
);
router.get("/GetAllUsersRoles", checkAuthentication, FATSDB.getAllUsersRoles);
router.get(
  "/GetAllUsersRolesAssigned",
  checkAuthentication,
  FATSDB.getAllUsersRolesAssigned
);
router.get(
  "/getAllUsersRolesAssignedToUser/:UserLoginID",
  checkAuthentication,
  FATSDB.getAllUsersRolesAssignedToUser
);
router.get(
  "/GetAllUsersDepartment",
  checkAuthentication,
  FATSDB.getAllUsersDepartment
);
router.get("/GetAllFloors", checkAuthentication, FATSDB.getAllFloors);
router.get("/GetAllAssetsPhoto", checkAuthentication, FATSDB.getAllAssetsPhoto);
//get by id
router.post(
  "/GetAssetMasterEncodeAssetCaptureById",
  checkAuthentication,
  FATSDB.getAssetMasterEncodeAssetCaptureById
);
router.get(
  "/GetAssetMasterEncodeAssetCaptureFinalById",
  checkAuthentication,
  FATSDB.getAssetMasterEncodeAssetCaptureFinalById
);
router.post(
  "/GetEmployeeListById",
  checkAuthentication,
  checkRole([5, 1]),
  FATSDB.getEmployeeListById
);
router.get(
  "/GetNewDepartmentLitById",
  checkAuthentication,
  FATSDB.getNewDepartmentLitById
);
router.get("/GetusersById", checkAuthentication, FATSDB.getUsersById);

router.post("/GetRegionById", checkAuthentication, FATSDB.getRegionById);
router.get("/GetCityById", checkAuthentication, FATSDB.getCityById);
router.get("/GetCityMasterById", checkAuthentication, FATSDB.getCityMasterById);
router.get(
  "/GetAssetRequestMasterById",
  checkAuthentication,
  FATSDB.getAssetRequestMasterById
);
router.get(
  "/GetAssetRequestDetailsById",
  checkAuthentication,
  FATSDB.getAssetRequestDetailsById
);
router.get(
  "/GetAssetConditionById",
  checkAuthentication,
  FATSDB.getAssetConditionById
);
router.get(
  "/GetMAINCATEGORYById",
  checkAuthentication,
  FATSDB.getMAINCATEGORYById
);
router.post(
  "/GetMAINSUBSeriesNoById",
  checkAuthentication,
  FATSDB.getMAINSUBSeriesNoById
);
router.post("/GetmakelistById", checkAuthentication, FATSDB.getMakeListById);
router.get(
  "/GetMAINSUBSeriesNoAssignedById",
  checkAuthentication,
  FATSDB.getMAINSUBSeriesNoAssignedById
);
router.get("/GetCountryById", checkAuthentication, FATSDB.getCountryById);
router.get(
  "/GetInvJournalMasterById",
  checkAuthentication,
  FATSDB.getInvJournalMasterById
);
router.get(
  "/GetLocationTagsById",
  checkAuthentication,
  FATSDB.getLocationTagsById
);
router.post("/GetUsersRolesById", checkAuthentication, FATSDB.getUsersRolesById);
router.get(
  "/GetUsersRolesAssignedById",
  checkAuthentication,
  FATSDB.getUsersRolesAssignedById
);
router.get(
  "/GetUsersDepartmentById",
  checkAuthentication,
  FATSDB.getUsersDepartmentById
);
router.get("/GetFloorsById", checkAuthentication, FATSDB.getFloorsById);
router.get(
  "/GetAssetsPhotoById",
  checkAuthentication,
  FATSDB.getAssetsPhotoById
);
// delete by id
router.delete(
  "/DeleteAssetMasterEncodeAssetCaptureById",
  checkAuthentication,
  FATSDB.deleteAssetMasterEncodeAssetCaptureById
);
router.delete(
  "/DeleteAssetMasterEncodeAssetCaptureFinalById",
  checkAuthentication,
  FATSDB.deleteAssetMasterEncodeAssetCaptureFinalById
);
router.delete(
  "/DeleteEmployeeListById",
  checkAuthentication,
  FATSDB.deleteEmployeeListById
);
router.delete(
  "/DeleteNewDepartmentLitById",
  checkAuthentication,
  FATSDB.deleteNewDepartmentLitById
);
router.delete("/DeleteusersById", checkAuthentication, checkRole([1]), FATSDB.deleteUsersById);
router.delete(
  "/DeleteRegionById",
  checkAuthentication,
  FATSDB.deleteRegionById
);
router.delete("/DeleteCityById", checkAuthentication, FATSDB.deleteCityById);
router.delete(
  "/DeleteCityMasterById",
  checkAuthentication,
  FATSDB.deleteCityMasterById
);
router.delete(
  "/DeleteAssetRequestMasterById",
  checkAuthentication,
  FATSDB.deleteAssetRequestMasterById
);
router.delete(
  "/DeleteAssetRequestDetailsById",
  checkAuthentication,
  FATSDB.deleteAssetRequestDetailsById
);
router.delete(
  "/DeleteAssetConditionById",
  checkAuthentication,
  FATSDB.deleteAssetConditionById
);
router.delete(
  "/DeleteMAINCATEGORYById",
  checkAuthentication,
  FATSDB.deleteMAINCATEGORYById
);
router.delete(
  "/DeleteMAINSUBSeriesNoById",
  checkAuthentication,
  checkRole([1]),
  FATSDB.deleteMAINSUBSeriesNoById
);
router.delete(
  "/DeleteMAINSUBSeriesNoAssignedById",
  checkAuthentication,
  FATSDB.deleteMAINSUBSeriesNoAssignedById
);
router.delete(
  "/DeletemakelistById",
  checkAuthentication,
  FATSDB.deleteMakeListById
);
router.delete(
  "/DeleteCountryById",
  checkAuthentication,
  FATSDB.deleteCountryById
);
router.delete(
  "/DeleteInvJournalMasterById",
  checkAuthentication,
  FATSDB.deleteInvJournalMasterById
);
router.delete(
  "/DeleteLocationTagsById",
  checkAuthentication,
  FATSDB.deleteLocationTagsById
);
router.delete(
  "/DeleteUsersRolesById",
  checkAuthentication,
  checkRole([1]),
  FATSDB.deleteUsersRolesById
);
router.delete(
  "/DeleteUsersRolesAssignedById",
  checkAuthentication,
  checkRole([1]),
  FATSDB.deleteUsersRolesAssignedById
);
router.delete(
  "/DeleteUsersDepartmentById",
  checkAuthentication,
  FATSDB.deleteUsersDepartmentById
);
router.delete(
  "/DeleteFloorsById",
  checkAuthentication,
  FATSDB.deleteFloorsById
);
router.delete(
  "/DeleteAssetsPhotoById",
  checkAuthentication,
  FATSDB.deleteAssetsPhotoById
);
// post data
router.post(
  "/PostAssetMasterEncodeAssetCapture",
  checkAuthentication,
  checkRole([9, 1]),
  FATSDB.postAssetMasterEncodeAssetCapture
);
router.post(
  "/PostAssetMasterEncodeAssetCaptureFinal",
  upload.array("images", 4),
  checkAuthentication,
  checkRole([8, 1]),
  FATSDB.postAssetMasterEncodeAssetCaptureFinal
);
router.post("/PostEmployeeList", checkAuthentication, FATSDB.postEmployeeList);
router.post(
  "/PostNewDepartmentLit",
  checkAuthentication,
  FATSDB.postNewDepartmentLit
);
router.post("/Postusers", checkAuthentication, checkRole([1]), FATSDB.postusers);
router.post("/PostRegion", checkAuthentication, FATSDB.postRegion);
router.post("/PostCity", checkAuthentication, FATSDB.postCity);
router.post("/PostCityMaster", checkAuthentication, FATSDB.postCityMaster);
router.post(
  "/PostAssetRequestMaster",
  checkAuthentication,
  FATSDB.postAssetRequestMaster
);
router.post(
  "/PostAssetRequestDetails",
  checkAuthentication,
  FATSDB.postAssetRequestDetails
);
router.post(
  "/PostAssetCondition",
  checkAuthentication,
  FATSDB.postAssetCondition
);
router.post("/PostMAINCATEGORY", checkAuthentication, FATSDB.postMAINCATEGORY);
router.post(
  "/PostMAINSUBSeriesNo",
  checkAuthentication,
  FATSDB.postMAINSUBSeriesNo
);
router.post(
  "/postMAINSUBSeriesNoAssigned",
  checkAuthentication,
  FATSDB.postMAINSUBSeriesNoAssigned
);
router.post("/PostMakeList", checkAuthentication, FATSDB.postMakeList);
router.post("/PostCountry", checkAuthentication, FATSDB.postCountry);
router.post(
  "/PostInvJournalMaster",
  checkAuthentication,
  FATSDB.postInvJournalMaster
);
router.post("/PostLocationTags", checkAuthentication, FATSDB.postLocationTags);
router.post("/PostUsersRoles", checkAuthentication, checkRole([1]), FATSDB.postUsersRoles);
router.post(
  "/PostUsersRolesAssigned",
  checkAuthentication,
  checkRole([1]),
  FATSDB.postUsersRolesAssigned
);
router.post(
  "/PostUsersDepartment",
  checkAuthentication,
  FATSDB.postUsersDepartment
);
router.post("/PostFloors", checkAuthentication, FATSDB.postFloors);
router.post("/PostAssetsPhoto", checkAuthentication, FATSDB.postAssetsPhoto);
//update
router.put(
  "/UpdateAssetMasterEncodeAssetCaptureById",
  checkAuthentication,
  FATSDB.updateAssetMasterEncodeAssetCaptureById
);
router.put(
  "/UpdateAssetMasterEncodeAssetCaptureFinalById",
  checkAuthentication,
  FATSDB.updateAssetMasterEncodeAssetCaptureFinalById
);
router.put(
  "/UpdateEmployeeListById",
  checkAuthentication,
  FATSDB.updateEmployeeListById
);
router.put(
  "/UpdateNewDepartmentLitById",
  checkAuthentication,
  FATSDB.updateNewDepartmentLitById
);
router.put("/UpdateUsersById", checkAuthentication, FATSDB.updateUsersById);
router.put("/UpdateRegionById", checkAuthentication, FATSDB.updateRegionById);
router.put("/UpdateCityById", checkAuthentication, FATSDB.updateCityById);
router.put(
  "/UpdateCityMasterById",
  checkAuthentication,
  FATSDB.updateCityMasterById
);
router.put(
  "/UpdateAssetRequestMasterById",
  checkAuthentication,
  FATSDB.updateAssetRequestMasterById
);
router.put(
  "/UpdateAssetRequestDetailsById",
  checkAuthentication,
  FATSDB.updateAssetRequestDetailsById
);
router.put(
  "/UpdateAssetConditionById",
  checkAuthentication,
  FATSDB.updateAssetConditionById
);
router.put(
  "/UpdateMAINCATEGORYById",
  checkAuthentication,
  FATSDB.updateMAINCATEGORYById
);
router.put(
  "/UpdateMAINSUBSeriesNoById",
  checkAuthentication,
  FATSDB.updateMAINSUBSeriesNoById
);
router.put(
  "/UpdateMAINSUBSeriesNoAssignedById",
  checkAuthentication,
  FATSDB.updateMAINSUBSeriesNoAssignedById
);
router.put(
  "/UpdateMakeListById",
  checkAuthentication,
  FATSDB.updateMakeListById
);
router.put("/UpdateCountryById", checkAuthentication, FATSDB.updateCountryById);
router.put(
  "/UpdateInvJournalMasterById",
  checkAuthentication,
  FATSDB.updateInvJournalMasterById
);
router.put(
  "/UpdateLocationTagsById",
  checkAuthentication,
  FATSDB.updateLocationTagsById
);
router.put(
  "/UpdateUsersRolesById",
  checkAuthentication,
  FATSDB.updateUsersRolesById
);
router.put(
  "/UpdateUsersRolesAssignedById",
  checkAuthentication,
  FATSDB.updateUsersRolesAssignedById
);
router.put(
  "/UpdateUsersDepartmentById",
  checkAuthentication,
  FATSDB.updateUsersDepartmentById
);
router.put("/UpdateFloorsById", checkAuthentication, FATSDB.updateFloorsById);
router.put(
  "/UpdateAssetsPhotoById",
  checkAuthentication,
  FATSDB.updateAssetsPhotoById
);

export default router;
