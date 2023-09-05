// import "./UserDataTable.scss";
import "./UserDataTable.css"
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../images/alessalogo2.png"

import { GridToolbar } from "@mui/x-data-grid";
import * as XLSX from 'xlsx';
import { MuiCustomTable } from "../../utils/MuiCustomTable";
import { ClipLoader } from 'react-spinners';
import CustomToolbar from "../../utils/Components/CustomToolbar";
import Swal from "sweetalert2";

const UserDataTable = ({
  columnsName = [],
  data,
  title,
  actionColumnVisibility,
  backButton,
  uniqueId,
  handleApiCall,
  deleteBtnEndPoint,
  ShipmentIdSearchEnable,
  ContainerIdSearchEnable,
  ExpectedStatusSearchEnable,
  buttonVisibility,
  addNewNavigation,
  printButton,
  emailButton,
  AddUser,
  UserName,
  checkboxSelection,
  handleRowClickInParent, // this is for journal movement cl function to get the row data on click
  handleSaveData,
  PrintName,
  printBarCode,
  printItemBarCode,
  printItemGtin,
  PrintBarCodeName,
  PrintGtin,
  detectAddRole,
  height,
  Refresh,
  handleRefresh,
  refreshLoading,
  TotalCount,
  loading,
  setIsLoading,
  secondaryColor,
  handleGenerateSerialPopUp,
  GenerateSerial,
  generateSerialPopUp,

}) => {
  const navigate = useNavigate();
  const [qrcodeValue, setQRCodeValue] = useState('');
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [record, setRecord] = useState([]);
  const [shipmentIdSearch, setShipmentIdSearch] = useState("");
  const [containerIdSearch, setContainerIdSearch] = useState("");
  const [expectedStatusSearch, setExpectedStatusSearch] = useState("");
  const [updatedRows, setUpdatedRows] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [muiFilteredData, setMuiFilteredData] = useState([]);
  const [serialQty, setSerialQty] = useState(0);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  const handleGenerateSerialBtnClicked = () => {
    if (selectedRow.length == 0) {
      setError("Please select a row")
      return;
    }
    handleGenerateSerialPopUp();
  }


  const handleGenerateSerial = async (data, serialQty) => {
    console.log(data);
    if (serialQty == 0) {
      setError("Please enter serial quantity")
      return;
    }
    handleGenerateSerialPopUp();
    try {
      const res = await userRequest.post('/generateSerialNumberforStockMasterAndInsertIntoMappedBarcode',
        // ITEMNAME, Width, Height, Length, Weight
        {
          ITEMID: data?.ITEMID,
          ITEMNAME: data?.ITEMNAME,
          Width: data?.Width,
          Height: data?.Height,
          Length: data?.Length,
          Weight: data?.Weight,
          SerialQTY: serialQty
        });
      console.log(res?.data);
      setMessage(res?.data?.message ?? "Serial Generated Successfully")
      setSerialQty(0);
      setSelectedRow([]);
      setRowSelectionModel([]);

    }
    catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? "Something went wrong")
    }


  }


  // if checkboxSelection is giving in props then use it other wise by default it is false
  const checkboxSelectionValue = checkboxSelection == 'disabled' ? false : true;

  const [filterModel, setFilterModel] = useState({ items: [] });

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    data.map((item, index) => {
      item.id = index + 1;
    });

    setRecord(
      data.map((item, index) => ({ ...item, id: index + 1 }))
    );

    setFilteredData(
      data.map((item, index) => ({ ...item, id: index + 1 }))
    );

  }, [data]);


  useEffect(() => {
    let filteredData = record;

    if (shipmentIdSearch && containerIdSearch && expectedStatusSearch) {
      filteredData = record.filter(
        (item) =>
          item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase()) &&
          item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase()) &&
          isMatched(item.EXPEDITIONSTATUS, expectedStatusSearch.toLowerCase())
      );
    } else if (shipmentIdSearch && containerIdSearch && !expectedStatusSearch) {
      filteredData = record.filter(
        (item) =>
          item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase()) &&
          item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase())
      );
    } else if (shipmentIdSearch && !containerIdSearch && expectedStatusSearch) {
      filteredData = record.filter(
        (item) =>
          item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase()) &&
          isMatched(item.EXPEDITIONSTATUS, expectedStatusSearch.toLowerCase())
      );
    } else if (!shipmentIdSearch && containerIdSearch && expectedStatusSearch) {
      filteredData = record.filter(
        (item) =>
          item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase()) &&
          isMatched(item.EXPEDITIONSTATUS, expectedStatusSearch.toLowerCase())
      );
    } else if (shipmentIdSearch && !containerIdSearch && !expectedStatusSearch) {
      filteredData = record.filter((item) =>
        item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase())
      );
    } else if (!shipmentIdSearch && containerIdSearch && !expectedStatusSearch) {
      filteredData = record.filter((item) =>
        item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase())
      );
    } else if (!shipmentIdSearch && !containerIdSearch && expectedStatusSearch) {
      filteredData = record.filter((item) =>
        isMatched(item.EXPEDITIONSTATUS.toString(), expectedStatusSearch.toLowerCase())
      );
    }

    setFilteredData(filteredData);
  }, [shipmentIdSearch, containerIdSearch, expectedStatusSearch, record]);

  const isMatched = (source, target) => {
    if (typeof source === 'string') {
      return source.toLowerCase().includes(target);
    }
    return false;
  };






  useEffect(() => {
    setMuiFilteredData(filteredData);
  }, [filteredData]);

  const handleFilterModelChange = async (newFilterModel) => {
    // Check if the newFilterModel is empty or has no filter items
    if (!newFilterModel || !newFilterModel.items || newFilterModel.items.length === 0) {
      // If no filters are applied, reset the filteredData state to the original data (record)
      setFilteredData(record);
      setFilterModel(newFilterModel); // Clear the filterModel state
      return;
    }
    const { field, operator, value } = newFilterModel.items.length > 0 ? newFilterModel.items[0] : {};
    setFilterModel(newFilterModel);
    console.log(newFilterModel)
    if (field === 'id') {
      const filteredRows = applyFiltering(filteredData, newFilterModel);
      console.log("Filtered rows:", filteredRows);
      setMuiFilteredData(filteredRows);
    } else {
      switch (uniqueId) {
        case "PrintPalletBarcode":
          setIsLoading(true)
          try {

            const res = await userRequest.post("/getAllTblMappedBarcodesByValueAndOperator", {
              value,
              operator,
              field,
            })

            console.log(res?.data);
            setMuiFilteredData(res?.data ?? [])
            setFilteredData(res?.data?.map((item, index) => ({ ...item, id: index + 1 })) || [])
            // data.map((item, index) => ({ ...item, id: index + 1 }))
          }
          catch (error) {
            console.log(error)
          }
          finally {
            setIsLoading(false)
          }
          break;
        case "PrintBarCode":
        case "ItemCode":
          setIsLoading(true)
          try {

            const res = await userRequest.post("/getAllTblMappedBarcodesByValueAndOperator", {
              value,
              operator,
              field,
            })

            console.log(res?.data);
            setMuiFilteredData(res?.data ?? [])
            setFilteredData(res?.data?.map((item, index) => ({ ...item, id: index + 1 })) || [])
            // data.map((item, index) => ({ ...item, id: index + 1 }))
          }
          catch (error) {
            console.log(error)
          }
          finally {
            setIsLoading(false)
          }
          break;
        default:
          // You can apply the filtering logic here and use the filtered rows for your other logic
          const filteredRows = applyFiltering(filteredData, newFilterModel);
          console.log("Filtered rows:", filteredRows);
          setMuiFilteredData(filteredRows);
          break;
      };
    }
  };

  const operatorFunctions = {
    contains: (cellValue, value) => cellValue !== null && cellValue.toString().includes(value),
    notContains: (cellValue, value) => cellValue !== null && !cellValue.toString().includes(value),
    equals: (cellValue, value) => cellValue !== null ? cellValue.toString() === value : cellValue === value,
    notEqual: (cellValue, value) => cellValue !== null ? cellValue.toString() !== value : cellValue !== value,
    greaterThan: (cellValue, value) => cellValue !== null && cellValue > value,
    greaterThanOrEqual: (cellValue, value) => cellValue !== null && cellValue >= value,
    lessThan: (cellValue, value) => cellValue !== null && cellValue < value,
    lessThanOrEqual: (cellValue, value) => cellValue !== null && cellValue <= value,
    startsWith: (cellValue, value) => cellValue !== null && cellValue.toString().startsWith(value),
    endsWith: (cellValue, value) => cellValue !== null && cellValue.toString().endsWith(value),
  };


  const applyFiltering = (filteredData, filterModel) => {
    if (!filterModel || !filterModel.items || filterModel.items.length === 0) {
      return filteredData;
    }

    return filteredData.filter((row) => {
      return filterModel.items.every((filter) => {
        const { field, operator, value } = filter;
        const cellValue = row[field];

        if (!operatorFunctions.hasOwnProperty(operator)) {
          console.warn(`Unknown filter operator: ${operator}`);
          return true;
        }

        return operatorFunctions[operator](cellValue, value);
      });
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      const newRows = await Promise.all(selectedRow.map(async (row) => {
        try {
          const response = await userRequest.get(`/getStockMasterDataByItemId?ITEMID=${row.data.ITEMID}`);
          const itemGroup = response?.data[0]?.GROUPNAME; // add optional chaining
          console.log(response)
          return { ...row, itemGroup: itemGroup || '' }; // add a fallback value for itemGroup

        } catch (error) {
          console.log("this is error in userdata table in useeffect with uniqueId")
          console.log(error);
        }
        return row; // if the API call fails, return the original row
      }));

      setUpdatedRows(newRows);
    };

    fetchData();
  }, [selectedRow]);


  const handlePrint = () => {
    if (selectedRow.length === 0) {
      // If no row is selected, show an alert message
      // alert('Please select a row to print.');
      setError('Please select a row to print.');
      return;
    }
    // Open a new window/tab with only the QR code
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Shipment Received</title>' +
      '<style>' +
      '@page { size: 4in 6in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.3; border: 1px solid black;}' +
      '#header { display: flex; justify-content: space-between; padding: 10px; border-top: 1px solid black;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#inside-heading { display: flex; justify-content: space-between; align-items: center; padding: 25px; margin-top: -30px; font-weight: 500; font-family: AwanZaman Regular;}' +
      '#first-QRCode { padding: 10px;}' +
      '#inside-header-second { display: flex; justify-content: space-between; align-items: center; padding: 25px; margin-top: -60px; font-weight: 500; font-family: AwanZaman Regular;}' +
      '#inside-header-third { padding: 25px; gap: 5px; margin-top: -50px; font-weight: 500; font-family: AwanZaman Regular;}' +
      '#inside-body { display: flex; justify-content: space-between; padding: 15px;}' +
      '#inside-QRCode { display: flex; justify-content: center; align-items: center; padding: 5px;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 5px;}' +

      //    '#from { padding: 25px; margin-top: -50px; font-weight: 500; font-family: AwanZaman Regular;}' +
      '#paragh { font-size: 15px; font-weight: 600; }' +
      '#paragh-header { display: flex; justify-content: center; align-items: center; font-size: 20px; font-weight: 600; }' +
      '#paragh-body { font-size: 21px; font-weight: 600; margin-top: -4px;}' +
      '#paragh-body-null { font-size: 21px; font-weight: 600; margin-top: -4px; visibility: hidden;}' +
      '</style>' +
      '</head><body>' +
      '<div style="">' +
      '</div>' +
      '<div style="">' +
      '<div id="barcode"></div>' +
      '</div>' +
      '<div id="qrcode"></div>' +
      '<p id="parag"></p>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('barcode');
    const barcode = document.getElementById('barcode').cloneNode(true);
    barcodeContainer.appendChild(barcode);


    // Add logo image to document
    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;

      printWindow.print();
      printWindow.close();
      setTimeout(() => {
        setSelectedRow([]);
        setRowSelectionModel([]);

      }, 500);
    };
  }

  const handleRowClick = (item) => {
    if (
      uniqueId === "journalMovementClId" ||
      uniqueId === "wProfitLostClId" ||
      uniqueId === "journalCountingClId" ||
      uniqueId === "wmsInventoryClId" ||
      uniqueId === "PICKINGROUTEID" ||
      uniqueId === "mobileWmsInventoryId"
    ) {
      handleRowClickInParent(item);
      return;
    }

    if (uniqueId === "wmsItemMappingId") {
      handleSaveData(item);
      return;
    } else {
      // Check for which component this code belongs to
      const index = item.id;
      // Set the value of qrcodeValue to the data of the clicked row
      setQRCodeValue(JSON.stringify(item));
      // setSelectedRow(data[index]);
      setSelectedRowIndex(index);
      console.log(item);
      return;
    }
  };





  const handleSearch = (e) => {
    if (e.target.name === "SHIPMENTID") {
      setShipmentIdSearch(e.target.value);
    } else if (e.target.name === "CONTAINERID") {
      setContainerIdSearch(e.target.value);
    } else if (e.target.name === "EXPEDITIONSTATUS") {
      setExpectedStatusSearch(e.target.value);
    }

    console.log(e.target.name, e.target.value);
    console.log(shipmentIdSearch, containerIdSearch, expectedStatusSearch);
  };


  // Retrieve the value with the key "myKey" from localStorage getvalue
  const myValue = localStorage.getItem("userId");
  console.log(myValue)


  const handleDelete = async (id, rowdata) => {

    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this record',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0079FF',
      confirmButtonText: 'Yes, delete it!'
    });
    if (confirmationResult.isConfirmed) {
      let success = false;

      switch (uniqueId) {
        case "SERIALNUM":
          // call the api to delete the data from the shipment table
          try {
            const response = await userRequest.delete(
              "deleteShipmentRecievedDataCL?SERIALNUM=" + rowdata.SERIALNUM
            );
            console.log(rowdata.SERIALNUM)
            console.log(response);

            const mappedbarcodeRes = await userRequest.delete(
              "/deleteTblMappedBarcodesDataBySerialNumber",
              {
                headers: {
                  "itemserialno": rowdata?.SERIALNUM,
                },
              }
            );
            console.log(mappedbarcodeRes?.data);


            const updateRemainingQty = await userRequest.put("/updateRemainingQtyInTblShipmentCounter?SHIPMENTID=" + rowdata?.SHIPMENTID)

            console.log(updateRemainingQty?.data);

            success = true; // to update the state of the table
          } catch (error) {
            console.log(error)
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        case "SHIPMENTID":
          // call the api to delete the data from the shipment table
          try {
            const response = await userRequest.delete(
              "deleteShipmentRecievingDataCL?SHIPMENTID=" + rowdata.SHIPMENTID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        case "locationTableId":
          try {
            const response = await userRequest.delete(
              "deleteTblLocationsDataCL?LOCATIONS_HFID=" + rowdata.LOCATIONS_HFID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the itemsCL table
        case "itemTableId":
          try {
            const response = await userRequest.delete(
              "/deleteStockMasterDataByItemId?ITEMID=" + rowdata.ITEMID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the itemsCL table
        case "PACKINGSLIPID":
          try {
            const response = await userRequest.delete(
              "deleteTblDispatchingDataCL?PACKINGSLIPID=" + rowdata.PACKINGSLIPID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the PickingCL table
        case "PICKINGROUTEID":
          try {
            const response = await userRequest.delete(
              "deleteTblPickingDataCL?PICKINGROUTEID=" + rowdata.PICKINGROUTEID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;



        // call the api to delete the data from the Mapped table
        case "ItemCode":
          try {
            const response = await userRequest.delete(
              "deleteTblMappedBarcodesDataBySerialNumber",
              {
                headers: {
                  ...userRequest.defaults.headers,
                  itemserialno: rowdata?.ItemSerialNo,
                },
              }
            );


            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // call the api to delete the data from the Palletizing table
        case "TRANSFERID":
          try {
            const response = await userRequest.delete(
              "deleteShipmentPalletizingDataCL?TRANSFERID=" + rowdata.TRANSFERID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // Truck Master data Delete Api 
        case "truckMasterId":
          try {
            const response = await userRequest.delete(
              "/deleteTruckMasterData?PlateNo=" + rowdata.PlateNo
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // Bin Master data Delete Api 
        case "binMasterId":
          try {
            const response = await userRequest.delete(
              "/deleteBinLocationData?BinNumber=" + rowdata.BinNumber
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;


        // Bin Master data Delete Api 
        case "zoneMasterId":
          try {
            const response = await userRequest.delete(
              "/deleteZonesData?Zones=" + rowdata.Zones
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // Pallet Master data Delete Api 
        case "palletMasterId":
          try {
            const response = await userRequest.delete(
              "/deletePalletMasterData?PalletNumber=" + rowdata.PalletNumber
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;

        // Zone Receiving data Delete Api 
        case "zoneReceivingId":
          try {
            const response = await userRequest.delete(
              "/deleteRzoneData?tbl_RZONESID=" + rowdata.tbl_RZONESID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;


        case "zoneDispatchingId":
          try {
            const response = await userRequest.delete(
              "/deleteDzoneData?tbl_DZONESID=" + rowdata.tbl_DZONESID
            );
            console.log(response);

            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
            success = false;
          }
          break;




        default:
          // do nothing
          break;
      }

      if (success) {
        setRecord(record.filter((item) => item.id !== id));
        setMessage("Record deleted successfully");
      }
    }
  };



  //Edit
  const handleEdit = async (rowData) => {
    // sessionStorage.setItem("edit", JSON.stringify(rowData));

    sessionStorage.setItem('edit', JSON.stringify(rowData));
    console.log(rowData)
    switch (uniqueId) {
      case "SERIALNUM":
        navigate("/shipmentupdate/" + rowData?.SHIPMENTID)
        break;
      case "SHIPMENTID":
        navigate("/update/" + rowData?.SHIPMENTID)
        break;
      case "ITEMNAME":
        navigate("/allitems/" + rowData?.ITEMNAME)
        break;
      case "itemTableId":
        navigate("/allitems/" + rowData?.ITEMID)
        break;
      case "locationTableId":
        navigate("/tblLocationupdate/" + rowData?.LOCATIONS_HFID)
        break;
      case "PACKINGSLIPID":
        navigate("/tbldispatchingupdates/" + rowData?.PACKINGSLIPID)
        break;
      case "PICKINGROUTEID":
        navigate("/tblpickingupdates/" + rowData?.PICKINGROUTEID)
        break;
      case "ItemCode":
        navigate("/tblmappedbarcodesupdates/" + rowData?.ItemCode)
        break;
      case "TRANSFERID":
        navigate("/updatepalletizing/" + rowData?.ALS_PACKINGSLIPREF)
        break;
      case "truckMasterId":
        navigate("/tbltrcukupdate/" + rowData?.PlateNo)
        break;
      case "binMasterId":
        navigate("/tblbinupdate/" + rowData?.BinNumber)
        break;
      case "zoneMasterId":
        navigate("/tblzoneupdate/" + rowData?.Zones)
        break;
      case "palletMasterId":
        navigate("/tblpalletupdate/" + rowData?.PalletNumber)
        break;
      case "zoneDispatchingId":
        navigate("/tblzonedispatchingupdate/" + rowData?.tbl_DZONESID)
        break;
      case "zoneReceivingId":
        navigate("/tblnewrzone/" + rowData?.tbl_RZONESID)
        break;

      case "usersAccountsId":
        navigate("/user-accounts/" + rowData?.UserID + "/" + rowData?.Fullname)

      default:
        // do nothing
        break;
    }
  };


  const CustomCell = (params) => {
    const style = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'auto',
      minWidth: 0,
      maxWidth: '100%',
      overflowX: 'auto',
    };
    return (
      <div style={{ ...style }}>
        {params.value}
      </div>
    );
  };
  const columnsWithCustomCell = columnsName.map((column) => {
    if (column.width) {
      return {
        ...column,
        renderCell: CustomCell,
      };
    }
    return column;
  });

  const idColumn = [
    {
      field: "id",
      headerName: "ID",
      width: 30,
    },
  ];
  const handleAddRole = async (rowdata) => {
    console.log(rowdata);
    // get userloginid from local session
    userRequest.post("/insertUserRoleAssignedData",
      [{
        "UserID": sessionStorage.getItem("assignRoleId"),
        "RoleName": rowdata?.RoleName,

      }]
    ).then((response) => {
      console.log(response);
      setMessage("Role added successfully");

      detectAddRole();
    }).catch((error) => {
      setError(error?.response?.data?.message ?? "Something went wrong")
    }
    )
  };

  const handleRemoveRole = async (rowdata) => {
    console.log(rowdata.RoleID);

    userRequest.delete("/deleteUserRoleAssignedData/" + rowdata?.RoleId,
    ).then((response) => {
      console.log(response);
      setMessage("Role removed successfully");

      // refresh the data table after adding the role
      detectAddRole();
    }).catch((error) => {

      setError(error?.response?.data?.message ?? "Something went wrong!")
    }
    )

  };


  const RemoveBtn = [
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleRemoveRole(params.row)}
            >
              REMOVE ROLE
            </div>

          </div>
        );
      },
    },
  ];
  const AddBtn = [
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleAddRole(params.row)}
            >
              ADD ROLE
            </div>

          </div>
        );
      },
    },
  ];
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: uniqueId === "usersAccountsId" ? 200 : 150,

      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id, params.row)}
            >
              Delete
            </div>
            <span
              onClick={() => handleEdit(params.row)}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">
                {uniqueId === "usersAccountsId" ? "Update Roles" : "Update"}
              </div>
            </span>
          </div>
        );
      },
    },
  ];

  const handleExport = (returnBlob = false) => {
    // get only the data from the record array which matsch columnsName field
    const data = muiFilteredData.map((item) => {
      const row = {};
      columnsName.forEach((column) => {
        row[column.field] = item[column.field];
      });

      return row;
    });
    // Create a new array that excludes the 'id' field
    const dataWithoutId = data.map(({ id, ...rest }) => rest);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataWithoutId); // Pass the new array to the 'json_to_sheet' method
    const validTitle = title.length > 31 ? title.substr(0, 31) : title;
    XLSX.utils.book_append_sheet(wb, ws, validTitle);
    if (returnBlob) {
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      return blob;
    } else {
      XLSX.writeFile(wb, `${title}.xlsx`); // Export the file
    }

  };





  const handlePdfExport = (returnBlob = false) => {
    const doc = new jsPDF("landscape");

    // Calculate the font size based on the number of columns
    const maxColumns = 10; // Maximum number of columns before font size starts to decrease
    const minFontSize = 4; // Minimum font size
    const maxFontSize = 8; // Maximum font size
    const fontSize = columnsName.length <= maxColumns ? maxFontSize : Math.max(minFontSize, maxFontSize - (columnsName.length - maxColumns));

    const tableData = muiFilteredData.map((item) => {
      const row = {};
      columnsName.forEach((column) => {
        row[column.field] = item[column.field];
      });
      return Object.values(row);
    });

    const headers = columnsName.map((column) => column.headerName);

    // Use autoTable to generate the table in the PDF
    doc.autoTable({
      head: [headers],
      body: tableData,
      theme: "grid",
      styles: { fontSize: fontSize },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      startY: 20,
      tableWidth: "auto", // Automatically adjust table width based on content
    });

    if (returnBlob) {
      const blob = doc.output("blob");
      return blob;
    } else {
      doc.save(`${title}.pdf`);
    }
  };

  const sendEmail = async (email, subject, remarks) => {
    const excelFile = handleExport(true);
    const pdfFile = handlePdfExport(true);
    let date = new Date().toISOString().slice(0, 10);
    const formData = new FormData();
    formData.append('to', email);
    formData.append('subject', subject + ' - ' + date);
    formData.append('body', remarks);
    formData.append('attachments', excelFile, `${title}.xlsx`);
    formData.append('attachments', pdfFile, `${title}.pdf`);

    try {
      const response = await userRequest.post('/sendEmail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setMessage('Email sent successfully');
      // Show success message
    } catch (error) {
      console.log(error);
      // Show error message
      setError('Email failed to send');
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail(email, subject, sendTo, remarks);
    handleClosePopup();
    // reset form
    setEmail('');
    setSubject('');
    setRemarks('');

  };





  const [isOpen, setIsOpen] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [subject, setSubject] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [roles, setRoles] = useState([]);


  const handleOpenPopup = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };



  const handleAddUserPopup = async () => {
    setAddUser(true);
    try {
      const res = await userRequest.get('/getAllTblUsers');
      setUsersList(res.data);
      console.log(res.data);
      console.log("wokf")
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || 'Something went wrong')

    };
  };


  useEffect(() => {
    userRequest
      .get("/getAllUsers")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const handleAddUserClose = () => {
    setAddUser(false);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    switch (uniqueId) {
      case "picklistAssignToUser":
      case "pickingSlipId":
        try {
          if (username === '') {
            setError('Please select a user');
            return;
          }
          handleAddUserClose();
          setUserName('');
          console.log(selectedRow)
          let newData = selectedRow.map(singleRowData => ({
            ...singleRowData.data,
            ASSIGNEDTOUSERID: username,
            // QTYPICKED:1,
          }));
          console.log('new Data', newData)

          // Make the API request
          const response = await userRequest.post('/insertPickingListDataCLIntoWBS', newData)

          // Handle the response from the API if needed
          console.log(response.data);
          setMessage(response?.data?.message || 'Picklist assigned to user successfully')
          // unselect the rows
          setSelectedRow([]);
          console.log('selected row')

          setRowSelectionModel([]);

        } catch (error) {
          setError(error?.response?.data?.message || 'Something went wrong')
          console.log(error)

        }

        // finally {


        // }
        break;

      case "journalUserAssigned":
        try {
          if (username === '') {
            setError('Please select a user');

            return;
          }
          handleAddUserClose();
          setUserName('');

          let newData = selectedRow.map(singleRowData => ({
            ...singleRowData.data,
            TRXUSERIDASSIGNED: username,
            // QTYPICKED:1,
          }));
          console.log('new Data', newData)

          // Make the API request
          userRequest.post('/insertJournalMovementCLData', newData)
            .then(response => {
              // Handle the response from the API if needed
              console.log(response.data);
              setMessage(response?.data?.message || 'Picklist assigned to user successfully')
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              setError(error?.response?.data?.message || 'Something went wrong')
            });
        } catch (error) {
          // Handle any errors that occur within the "SERIALNUM" case
        }
        break;



      // Journal Profit Lost Api Call 
      case "journalprofitlost":
        try {
          if (username === '') {
            setError('Please select a user');
            return;
          }
          handleAddUserClose();
          setUserName('');

          let newData = selectedRow.map(singleRowData => ({
            ...singleRowData.data,
            TRXUSERIDASSIGNED: username,
            // QTYPICKED:1,
          }));
          console.log('new Data', newData)

          // Make the API request
          userRequest.post('/insertJournalProfitLostCL', newData)
            .then(response => {
              // Handle the response from the API if needed
              console.log(response.data);
              setMessage(response?.data?.message || 'Journal Profit Lost to user successfully')
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              setError(error?.response?.data?.message || 'Something went wrong')
            });
        } catch (error) {
          // Handle any errors that occur within the "SERIALNUM" case
        }
        break;



      // Journal Counting User Api Call 
      case "journalCountingUser":
        try {
          if (username === '') {
            setError('Please select a user');
            return;
          }
          handleAddUserClose();
          setUserName('');

          let newData = selectedRow.map(singleRowData => ({
            ...singleRowData.data,
            TRXUSERIDASSIGNED: username,
            // QTYPICKED:1,
          }));
          console.log('new Data', newData)

          // Make the API request
          userRequest.post('/insertWMSJournalCountingCL', newData)
            .then(response => {
              // Handle the response from the API if needed
              console.log(response.data);
              setMessage(response?.data?.message || 'Journal Profit Lost to user successfully')
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              setError(error?.response?.data?.message || 'Something went wrong')
            });
        } catch (error) {
          // Handle any errors that occur within the "SERIALNUM" case
        }
        break;
      default:
        // Handle the default case if needed
        break;
    }

  };

  let smallHeightTableScreens = [
    'journalMovementClId',
    'PICKINGROUTEID',
    'barcodeDeletedId',
    'journalMovementClDetId',
    "wProfitLostClId",
    'wProfitLostClDetsId',
    'journalCountingClId',
    'journalCountingClDetsId',
    'wmsInventoryClId',
    'wmsInventoryClDetsId',

  ]
  let mediumHeightTableScreens = [

    'userRolesAssignedId',
    'userAccountRoleId',

  ]



  // Last Two Prinitng Buttons
  const handlePrintBarCode = () => {
    if (selectedRow.length === 0) {
      // If no row is selected, show an alert message
      // alert('Please select a row to print.');
      setError('Please select a row to print.');
      return;
    }
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Print Barcode</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.3; border: 1px solid black;}' +
      '#header { display: flex; justify-content: center; padding: 1px;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 5px;}' +
      '#paragh { font-size: 15px; font-weight: 600; }' +
      '</style>' +
      '</head><body>' +
      '<div id="printBarcode"></div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('printBarcode');
    const barcode = document.getElementById('barcode').cloneNode(true);
    barcodeContainer.appendChild(barcode);

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;

      printWindow.print();
      printWindow.close();
      setTimeout(() => {
        setSelectedRow([]);
        setRowSelectionModel([]);

      }, 500);
    };
  }



  const handlePrintItemBarcode = () => {
    if (selectedRow.length === 0) {
      setError('Please select a row to print.');
      return;
    }
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Print Barcode</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.1;}' +
      '#header { display: flex; justify-content: center;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#itemcode { font-size: 13px; font-weight: 600; display: flex; justify-content: center;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 1px;}' +
      '#itemSerialNo { font-size: 13px; display: flex; justify-content: center; font-weight: 600; margin-top: 3px;}' +
      '#main-print { height: 100%; width: 100%;}' +
      '</style>' +
      '</head><body>' +
      '<div id="printBarcode"></div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('printBarcode');
    const barcode = document.getElementById('barcode').cloneNode(true);
    barcodeContainer.appendChild(barcode);

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;
      printWindow.print();
      printWindow.close();
      setTimeout(() => {
        setSelectedRow([]);
        setRowSelectionModel([]);

      }, 500);
    };
  }
  const handlePrintGtin = () => {
    if (selectedRow.length === 0) {
      setError('Please select a row to print.');
      return;
    }
    const printWindow = window.open('', 'Print Window', 'height=400,width=800');
    const html = '<html><head><title>Print Barcode</title>' +
      '<style>' +
      '@page { size: 3in 2in; margin: 0; }' +
      'body { font-size: 13px; line-height: 0.1;}' +
      '#header { display: flex; justify-content: center;}' +
      '#imglogo {height: 40px; width: 100px;}' +
      '#itemcode { font-size: 13px; font-weight: 600; display: flex; justify-content: center;}' +
      '#inside-BRCode { display: flex; justify-content: center; align-items: center; padding: 1px;}' +
      '#gtinNo { font-size: 13px; display: flex; justify-content: center; font-weight: 600; margin-top: 3px;}' +
      '#main-print { height: 100%; width: 100%;}' +
      '</style>' +
      '</head><body>' +
      '<div id="printBarcode"></div>' +
      '</body></html>';

    printWindow.document.write(html);
    const barcodeContainer = printWindow.document.getElementById('printBarcode');
    const barcode = document.getElementById('printGtinId').cloneNode(true);
    barcodeContainer.appendChild(barcode);

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      printWindow.document.getElementById('imglogo').src = logoImg.src;

      printWindow.print();
      printWindow.close();
      setTimeout(() => {
        setSelectedRow([]);
        setRowSelectionModel([]);

      }, 500);
    };
  }


  const PrintLabelsBarCode = ({ selectedRow, index }) => {
    return (
      <div id="main-print">
        <div id="" key={index}>
          <div id="" className='hidden'>
            <div id='header'>
              <div>
                <img src={logo} id='imglogo' alt='' />
              </div>
            </div>
            <div>
              <p id="itemcode">{selectedRow.data.ItemCode}</p>
            </div>
            <div id='inside-BRCode'>
              <QRCodeSVG value={selectedRow.data.ItemSerialNo} width={100} height={50} />
            </div>
            <div id="itemSerialNo">
              <p>{selectedRow.data.ItemSerialNo}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const PrintLabelsGtin = ({ selectedRow, index }) => {
    return (
      <div id="main-print">
        <div id="" key={index}>
          <div id="" className='hidden'>
            <div id='header'>
              <div>
                <img src={logo} id='imglogo' alt='' />
              </div>
            </div>
            <div>
              <p id="itemcode">{selectedRow.data.ItemCode}</p>
            </div>
            <div id='inside-BRCode'>
              <Barcode value={selectedRow.data.GTIN} width={1} height={50} fontSize={14} />
            </div>
            {/* <div id="gtinNo">
              <p>{selectedRow?.data?.GTIN}</p>
            </div> */}
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="datatable"
        style={
          smallHeightTableScreens.includes(uniqueId) ? { height: '450px' } : mediumHeightTableScreens.includes(uniqueId) ? { height: '600px' } : { height: '93vh' }
        }
      >
        <div className="datatableTitle">
          <div className="left-div">
            <span>{title}</span>

            {ShipmentIdSearchEnable &&
              ShipmentIdSearchEnable === true ? <span>
              <input
                type="text"
                placeholder="SEARCH BY SHIPMENT ID"
                name="SHIPMENTID"
                className="searchInput"
                onChange={handleSearch}
              />
            </span> : null
            }

            {ContainerIdSearchEnable &&
              ContainerIdSearchEnable === true ? <span>
              <input
                type="text"
                name="CONTAINERID"
                placeholder="SEARCH BY CONTAINER ID"
                className="searchInput"
                onChange={handleSearch}
              />
            </span> : null}

            {ExpectedStatusSearchEnable &&
              ExpectedStatusSearchEnable === true ? <span>
              <input
                type="text"
                name="EXPEDITIONSTATUS"
                placeholder="SEARCH BY EXPEDITIONSTATUS"
                className="searchInput"
                onChange={handleSearch}
              />
            </span> : null}



          </div>

          <span className="leftDatatableTitle">
            {buttonVisibility !== false && <span className="leftDatatableTitle"
              onClick={uniqueId === "SERIALNUM" ?
                // cleart sessionStorage for receiptsData
                () => { sessionStorage.removeItem("receiptsData") }
                : null}

            >
              <Link to={addNewNavigation} className="link">
                Add New
              </Link>

              {Refresh && (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {refreshLoading ? (
                    <button onClick={handleRefresh} disabled style={{ width: '65px', position: 'relative' }}>
                      <ClipLoader color="#DC143C" loading={refreshLoading} size={16} />
                    </button>
                  ) : (
                    // Show the button when not refreshing
                    <button onClick={handleRefresh}>Refresh</button>
                  )}
                </span>
              )}
              {GenerateSerial && <button onClick={handleGenerateSerialBtnClicked}>Generate Serial</button>}
              {emailButton && <button onClick={handleOpenPopup}>Send to Email</button>}

            </span>
            }
            {printButton && <button onClick={handlePrint}>{PrintName}</button>}
            {AddUser && <button onClick={handleAddUserPopup}>{UserName}</button>}
            {printBarCode && <button onClick={handlePrintBarCode}>{PrintBarCodeName}</button>}
            {printItemBarCode && <button onClick={handlePrintItemBarcode}>{PrintBarCodeName}</button>}
            {printItemGtin && <button onClick={handlePrintGtin}>{PrintGtin}</button>}
            {backButton && <button onClick={() => { navigate(-1) }}>Go Back</button>}
          </span>
        </div>


        <MuiCustomTable
          loading={loading}
          secondaryColor={secondaryColor ? secondaryColor : null}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }

          // components={{
          //   Toolbar: CustomGridToolbarContainer,
          // }}

          slots={{
            toolbar: () => <CustomToolbar handlePdfExport={() => handlePdfExport(false)}
              handleExport={() => handleExport(false)}
              TotalCount={TotalCount}
            />
          }}
          // className="datatable"

          rows={filteredData}

          columns={
            actionColumnVisibility !== false
              ? idColumn.concat(columnsWithCustomCell.concat(actionColumn))
              : uniqueId === "userAccountRoleId" ? idColumn.concat(columnsWithCustomCell.concat(AddBtn))
                : uniqueId === "userRolesAssignedId" ? idColumn.concat(columnsWithCustomCell.concat(RemoveBtn))
                  : idColumn.concat(columnsWithCustomCell)
          }
          pageSize={30}
          rowsPerPageOptions={[30, 50, 100]}
          checkboxSelection={checkboxSelectionValue}

          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}


          // selectionModel={rowSelectionModel}
          // pass rowselectonModel to the table so that it can be used to unset the selection when set to empty array
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel); // Set the state with selected row ids
            console.log(newRowSelectionModel); // Logs the ids of selected rows
            const selectedRows = filteredData.filter((row) => newRowSelectionModel.includes(row.id));
            console.log(selectedRows)
            setSelectedRow(selectedRows.map((item, index) => ({ data: item, index }))); // Set the state with selected row data objects
            if (newRowSelectionModel.length > 0) {
              handleRowClick(selectedRows[selectedRows.length - 1]);
            }
          }}


        />

        {/* Email Screen */}
        {isOpen && (
          <div className="popup-container">
            <div className="popup">
              <div className="header">
                <h2>Shipment Receiving Email</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <select
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                >
                  <option value="">--Select Email--</option>
                  {roles.map((role) => (
                    <option key={role.UserID} value={role.Email}>
                      {role.Email}
                    </option>
                  ))}
                </select>

                <label htmlFor="subject">Subject:</label>
                <input
                  type="subject"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Subject"
                />

                <label htmlFor="remarks">Remarks:</label>
                <input
                  type="remarks"
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  placeholder="Remarks"
                />

                <div className="flex gap-3">
                  <button className="close-btn" type="button" onClick={handleClosePopup}>CANCEL</button>
                  <button type="submit"

                  >SEND</button>
                </div>
              </form>
            </div>
          </div>
        )}



        {addUser && (
          <div className="popup-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="popup bg-white rounded-lg shadow-xl overflow-hidden max-w-md m-4">
              <div className="header bg-blue-500 text-white font-bold py-4 px-6">
                <h2 style={{ color: "white" }}>LIST OF USERS</h2>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6">
                <label htmlFor="UserName" className="block mb-2 text-gray-700 text-sm">Name:</label>
                <select
                  id="UserName"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">--Select User--</option>
                  {usersList.map((user) => (
                    <option key={user.UserID} value={user.UserID}>
                      {user?.Fullname} - {user?.UserID}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3 mt-6">
                  <button className="close-btn text-white bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2" type="button" onClick={handleAddUserClose}>CANCEL</button>
                  <button className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-6 py-2" type="submit">SEND</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {generateSerialPopUp && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleGenerateSerialPopUp}></div>

            {/* Popup */}
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl w-11/12 md:w-1/2 z-10">
              <h1 className="text-xl md:text-2xl font-bold mb-4">Generate Serial</h1>
              <div className="mb-4">
                <p><strong>Item ID:</strong>{selectedRow[selectedRow.length - 1]?.data?.ITEMID}</p>
                <p><strong>Item Description:</strong> {selectedRow[selectedRow.length - 1]?.data?.ITEMNAME}</p>
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Enter Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={serialQty}
                  onChange={(e) => setSerialQty(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-200"
                  onClick={handleGenerateSerialPopUp}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleGenerateSerial(selectedRow[selectedRow.length - 1]?.data, serialQty)}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}







        {selectedRow.length > 0 && (
          <div id="barcode">
            {selectedRow.map((selectedRow, index) => (
              <div id="barcode" className='hidden' key={index}>
                {uniqueId === "SERIALNUM" ? <PrintingShipmentReceived selectedRow={selectedRow} index={index} /> :
                  uniqueId === "PrintPalletBarcode" ? <PrintPalletBarCode selectedRow={selectedRow} index={index} /> :
                    uniqueId === "PrintBarCode" || uniqueId === "PrintItemlabels" ? <PrintLabelsBarCode selectedRow={selectedRow} index={index} /> :
                      uniqueId === "PrintReturnSalesOrder" ? <PrintReturnSalesOrder selectedRow={selectedRow} index={index} /> : null}

              </div>
            ))}
          </div>
        )}

        {selectedRow.length > 0 && (
          <div id="printGtinId">
            {selectedRow.map((selectedRow, index) => (
              <div id="printGtinId" className='hidden' key={index}>
                {/* <PrintLabelsBarCode selectedRow={selectedRow} index={index} />  */}
                <PrintLabelsGtin selectedRow={selectedRow} index={index} />

              </div>
            ))}
          </div>
        )}


      </div >
    </>

  );
};

export default UserDataTable;


const PrintingShipmentReceived = ({ selectedRow, index }) => {
  return (

    <div>
      <style>
        {`
            ..css-ptiqhd-MuiSvgIcon-root {
             color: #ffffff !important;
             }
      `}
      </style>
      {/* {selectedRow.length > 0 && ( */}
      <div id="barcode">
        {/* {selectedRow.map((selectedRow, index) => ( */}
        <div id="barcode" className='hidden' key={index + "barcode"}>
          <div id='header'>
            <div>
              <img src={logo} id='imglogo' alt='' />
            </div>
            <div id='first-QRCode'>
              <QRCodeSVG value="http://www.alessa.com.sa" width={40} height={32} />
            </div>
          </div>
          <div id='inside-heading'>
            <div>
              <p>PO NUMBER</p>
              <p id='paragh'>{selectedRow.data.PURCHID}</p>
            </div>
            <div>
              <p>GROUP NAME</p>
              {/* <p id='paragh'>{selectedRow.data.ITEMID}</p> */}
              <p id='paragh'>{selectedRow.itemGroup}</p>
            </div>
          </div>

          <div id='inside-header-second'>
            <div>
              <p>BATCH/LOT</p>
              <p id='paragh'>Batch</p>
            </div>
            <div>
              <p>COUNT</p>
              <p id='paragh'>{selectedRow.data.USERID}</p>
            </div>
            <div>
              <p>PROD DATE</p>
              <p id='paragh'>{selectedRow.data.PALLET_DATE}</p>
            </div>
          </div>

          <div id='inside-header-third'>
            <p>SSCC</p>
            <p id='paragh-header'>{selectedRow.data.PALLETCODE}</p>
          </div>
          <hr />

          <div id='inside-body'>
            <div>
              <p id='paragh-body'>{selectedRow.data.SHIPMENTID}</p>
              <p id='paragh'>{selectedRow.data.ITEMID}</p>
              <br />
              {/* <p id='paragh'>HITACHI WASHING MACHINE <br /><br /><br /><br /> AUTOMATIC 230V, Inverter</p> */}
              {/* Add this line */}
              <p id='paragh' style={{ width: '250px', lineHeight: '1', marginTop: '-0.5px' }}>{selectedRow.data.ITEMNAME}</p>

            </div>
            <div id='inside-QRCode'>
              <QRCodeSVG value={selectedRow.data.SERIALNUM} width={70} height={40} />
            </div>
          </div>
          <hr />

          <div id='inside-BRCode'>
            <Barcode value={selectedRow.data.PALLETCODE} width={2.3} height={100} />
          </div>
        </div>
        {/* ))} */}
      </div>
      {/* )} */}
    </div>
  );
};




// const PrintLabelsBarCode = ({ selectedRow, index }) => {
//   return (
//     <div>
//       <div id="barcode" key={index}>
//         <div id="barcode" className='hidden'>
//           <div id='header'>
//             <div>
//               <img src={logo} id='imglogo' alt='' />
//             </div>
//           </div>
//           <div id="itemcode">
//               <p>{selectedRow.data.ItemCode}</p>
//           </div>
//           <div id='inside-BRCode'>
//             <QRCodeSVG value={selectedRow.data.ItemSerialNo} width={100} height={70} />
//           </div>
//           <div id="itemcode">
//               <p>{selectedRow.data.ItemSerialNo}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



const PrintReturnSalesOrder = ({ selectedRow, index }) => {
  return (
    <div>
      <div id="barcode" key={index}>
        <div id="barcode" className='hidden'>
          <div id='header'>
            <div>
              <img src={logo} id='imglogo' alt='' />
            </div>
          </div>
          <div id='inside-BRCode'>
            <Barcode value={selectedRow.data.ITEMSERIALNO} width={1.3} height={60} />
          </div>
        </div>
      </div>
    </div>
  );
};



const PrintPalletBarCode = ({ selectedRow, index }) => {
  return (
    <div>
      {/* <div id="barcode" key={index}>
          <div id="barcode" className='hidden'>
                <div id='header'>
                  <div>
                    <img src={logo} id='imglogo' alt='' />
                  </div>
                </div>
                <div id='inside-BRCode'>
              <Barcode value={selectedRow.data.PalletCode} width={1.3} height={60} />
            </div>
          </div>
        </div> */}

      <div id="barcode">
        <div id="barcode" className='hidden' key={index + "barcode"}>
          <div id='header'>
            <div>
              <img src={logo} id='imglogo' alt='' />
            </div>
            <div id='first-QRCode'>
              <QRCodeSVG value="http://www.alessa.com.sa" width={40} height={32} />
            </div>
          </div>
          <div id='inside-heading'>
            <div>
              <p>PO NUMBER</p>
              <p id='paragh'>{selectedRow.data.PO}</p>
            </div>
            <div>
              <p>GROUP NAME</p>
              {/* <p id='paragh'>{selectedRow.data.ITEMID}</p> */}
              <p id='paragh'>{selectedRow.itemGroup}</p>
            </div>
          </div>

          <div id='inside-header-second'>
            <div>
              <p>BATCH/LOT</p>
              <p id='paragh'>Batch</p>
            </div>
            <div>
              <p>COUNT</p>
              <p id='paragh'>{selectedRow.data.USERID}</p>
            </div>
            <div>
              <p>PROD DATE</p>
              <p id='paragh'>{selectedRow.data.MapDate}</p>
            </div>
          </div>

          <div id='inside-header-third'>
            <p>SSCC</p>
            <p id='paragh-header'>{selectedRow.data.PalletCode}</p>
          </div>
          <hr />

          <div id='inside-body'>
            <div>
              {/* <p id='paragh-body'>{selectedRow.data.SID}</p>
              <p id='paragh'>{selectedRow.data.ItemCode}</p>
              <br />
              <p id='paragh' style={{ width: '250px', lineHeight: '1' }}>{selectedRow.data.ItemSerialNo}</p> */}

              {/* Display "N/A" if selectedRow.data.SID is null or undefined */}
              <p id='paragh-body'>{selectedRow.data.SID || <p id="paragh-body-null">.</p>}</p>

              {/* Display "N/A" if selectedRow.data.ItemCode is null or undefined */}
              <p id='paragh'>{selectedRow.data.ItemCode || <p id="paragh-body-null">.</p>}</p>
              <br />

              {/* Display "N/A" if selectedRow.data.ItemSerialNo is null or undefined */}
              <p id='paragh' style={{ width: '250px', lineHeight: '1' }}>{selectedRow.data.ItemSerialNo || <p id="paragh-body-null">.</p>}</p>

            </div>
            <div id='inside-QRCode'>
              <QRCodeSVG value={selectedRow.data.ItemSerialNo} width={70} height={40} />
            </div>
          </div>
          <hr />

          <div id='inside-BRCode'>
            <Barcode value={selectedRow.data.PalletCode} width={2.3} height={100} />
          </div>
        </div>
      </div>

    </div>
  );
};
