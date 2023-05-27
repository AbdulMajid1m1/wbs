// import "./UserDataTable.scss";
import "./UserDataTable.css"
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import userRequest from "../../utils/userRequest";
import CustomSnakebar from "../../utils/CustomSnakebar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../images/alessalogo2.png"

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import * as XLSX from 'xlsx';
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
  buttonVisibility,
  addNewNavigation,
  printButton,
  emailButton,
  detectAddRole,
  AddUser,
  UserName,
  checkboxSelection,
  handleJournalMovementClRowClick, // this is for journal movement cl function to get the row data on click

}) => {
  const navigate = useNavigate();
  const [qrcodeValue, setQRCodeValue] = useState('');
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [record, setRecord] = useState([]);
  const [shipmentIdSearch, setShipmentIdSearch] = useState("");
  const [containerIdSearch, setContainerIdSearch] = useState("");
  const [updatedRows, setUpdatedRows] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [muiFilteredData, setMuiFilteredData] = useState([]);
  const resetSnakeBarMessages = () => {
    setError(null);
    setMessage(null);

  };

  // if checkboxSelection is giving in props then use it other wise by default it is false
  const checkboxSelectionValue = checkboxSelection == 'disabled' ? false : true;

  const [filterModel, setFilterModel] = useState({ items: [] });

  const handleFilterModelChange = (newFilterModel) => {
    setFilterModel(newFilterModel);

    // You can apply the filtering logic here and use the filtered rows for your other logic
    const filteredRows = applyFiltering(filteredData, newFilterModel);
    console.log("Filtered rows:", filteredRows);
    setMuiFilteredData(filteredRows);
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
          return { ...row, itemGroup: itemGroup || '' }; // add a fallback value for itemGroup
        } catch (error) {
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
      '#header { display: flex; justify-content: space-between; padding: 10px;}' +
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
    };
  }


  const handleRowClick = (item) => {
    if (uniqueId === "journalMovementClId") {
      handleJournalMovementClRowClick(item);
      return;
    }
    const index = item.id;
    let itemGroup;

    userRequest.get('/getStockMasterDataByItemId?ITEMID=23CHP130')
      .then((response) => {
        itemGroup = response.data[0].ITEMGROUP

      })
      .catch(err => {
        console.log(err)
      })

    // Set the value of qrcodeValue to the data of the clicked row
    setQRCodeValue(JSON.stringify(item));
    setSelectedRow(data[index]);
    setSelectedRowIndex(index);
    console.log(item);

    // Check if the row is already selected
    const selectedIndex = selectedRow.findIndex(selectedItem => selectedItem.index === index);
    if (selectedIndex > -1) {
      // If the row is already selected, remove it from the selectedRows array
      const newSelectedRows = [...selectedRow];
      newSelectedRows.splice(selectedIndex, 1);
      setSelectedRow(newSelectedRows);
    } else {
      // If the row is not selected, add it to the selectedRows array
      setSelectedRow([...selectedRow, { data: item, index }]);
    }
  };





  useEffect(() => {
    data.map((item, index) => {
      item.id = index + 1;
    });
    setRecord(
      data.map((item, index) => ({ ...item, id: index + 1 }))
    );
  }, [data]);

  const filteredData = shipmentIdSearch && containerIdSearch
    ? record.filter((item) =>
      item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase()) && item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase())
    )
    : shipmentIdSearch && !containerIdSearch
      ? record.filter((item) =>
        item.SHIPMENTID.toLowerCase().includes(shipmentIdSearch.toLowerCase())
      )
      : !shipmentIdSearch && containerIdSearch
        ? record.filter((item) =>
          item.CONTAINERID.toLowerCase().includes(containerIdSearch.toLowerCase())
        )
        : record;

  useEffect(() => {
    setMuiFilteredData(filteredData);
  }, [filteredData]);



  const handleSearch = (e) => {
    // setShipmentIdSearch(e.target.value);
    e.target.name === "SHIPMENTID" ? setShipmentIdSearch(e.target.value) : setContainerIdSearch(e.target.value);
    console.log(e.target.name, e.target.value);
    console.log(shipmentIdSearch, containerIdSearch);
  };
  // Retrieve the value with the key "myKey" from localStorage getvalue
  const myValue = localStorage.getItem("userId");
  console.log(myValue)


  const handleDelete = async (id, rowdata) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      let success = false;

      switch (uniqueId) {
        case "SERIALNUM":
          // call the api to delete the data from the shipment table
          try {
            const response = await userRequest.delete(
              "deleteShipmentRecievedDataCL?SERIALNUM=" + rowdata.SERIALNUM
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
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
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;

        case "locationTableId":
          try {
            const response = await userRequest.delete(
              "deleteTblLocationsDataCL?LOCATIONS_HFID=" + rowdata.LOCATIONS_HFID
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
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
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
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
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
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
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;



        // call the api to delete the data from the Mapped table
        case "ItemCode":
          try {
            const response = await userRequest.delete(
              "deleteTblMappedBarcodesDataByItemCode",
              {
                headers: {
                  ...userRequest.defaults.headers,
                  ItemCode: rowdata.ItemCode,
                },
              }
            );
            console.log(response);
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
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
            setMessage(response?.data?.message ?? "User deleted successfully");
            success = true; // to update the state of the table
          } catch (error) {
            setError(error?.message ?? "Something went wrong");
            success = false;
          }
          break;


        default:
          // do nothing
          break;
      }

      if (success) {
        setRecord(record.filter((item) => item.id !== id));
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
        navigate("/shipmentupdate/" + rowData.SHIPMENTID)
        break;
      case "SHIPMENTID":
        navigate("/update/" + rowData.SHIPMENTID)
        break;
      case "ITEMNAME":
        navigate("/allitems/" + rowData.ITEMNAME)
        break;
      case "itemTableId":
        navigate("/allitems/" + rowData.ITEMID)
        break;
      case "locationTableId":
        navigate("/tblLocationupdate/" + rowData.LOCATIONS_HFID)
        break;
      case "PACKINGSLIPID":
        navigate("/tbldispatchingupdates/" + rowData.PACKINGSLIPID)
        break;
      case "PICKINGROUTEID":
        navigate("/tblpickingupdates/" + rowData.PICKINGROUTEID)
        break;
      case "ItemCode":
        navigate("/tblmappedbarcodesupdates/" + rowData.ItemCode)
        break;
      case "TRANSFERID":
        navigate("/updatepalletizing/" + rowData.ALS_PACKINGSLIPREF)
        break;

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
      minWidth: 0, // add this property
      maxWidth: '100%', // add this property
    };
    return (
      <div style={{ ...style, overflowX: 'auto' }}>
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


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
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
              <div className="viewButton">Update</div>
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
    XLSX.utils.book_append_sheet(wb, ws, title);
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



  const handleAddUserClose = () => {
    setAddUser(false);
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();

    switch (uniqueId) {
      case "picklistAssignToUser":
        try {
          if (username === '') {
            setError('Please select a user');
            return;
          }
          handleAddUserClose();
          setUserName('');

          let newData = selectedRow.map(singleRowData => ({
            ...singleRowData.data,
            ASSIGNEDTOUSERID: username,
            // QTYPICKED:1,
          }));
          console.log('new Data', newData)

          // Make the API request
          userRequest.post('/insertPickingListDataCLIntoWBS', newData)
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
      default:
        // Handle the default case if needed
        break;
    }

  };




  return (
    <>
      {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
      {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

      <div className="datatable"
        style={
          uniqueId === 'journalMovementClId' || uniqueId === 'journalMovementClDetId' ? { height: '450px' } : null
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
              <button onClick={handleOpenPopup}>Send to Email</button>
              <button onClick={() => handleExport(false)}>Export to Excel</button>
              <button onClick={() => handlePdfExport(false)}
              >Export to Pdf</button>
              {printButton && <button onClick={handlePrint}>Print Shipment</button>}
            </span>
            }
            {AddUser && <button onClick={handleAddUserPopup}>{UserName}</button>}
            {backButton && <button onClick={() => { navigate(-1) }}>Go Back</button>}
          </span>
        </div>


        <DataGrid
          slots={{ toolbar: GridToolbar }}

          className="datagrid"
          rows={filteredData}

          columns={
            actionColumnVisibility !== false
              ? idColumn.concat(columnsWithCustomCell.concat(actionColumn))
              // ? idColumn.concat(columnsWithCustomCell.concat(RemoveBtn))
              : idColumn.concat(columnsWithCustomCell)
          }
          pageSize={30}
          rowsPerPageOptions={[30, 50, 100]}
          checkboxSelection={checkboxSelectionValue}

          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          onRowClick={(params, rowIdx) => {
            // call your handle function and pass the row data as a parameter
            handleRowClick(params.row, rowIdx);
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
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                />

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
                <h2 style={{ color: "white" }}>Add User</h2>
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
                      {user.Fullname}
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





        {updatedRows.length > 0 && (
          <div id="barcode">
            {updatedRows.map((selectedRow, index) => (
              <div id="barcode" className='hidden' key={index}>
                <div id='header'>
                  <div>
                    <img src={logo} id='imglogo' alt='' />
                  </div>
                  <div id='first-QRCode'>
                    <QRCodeSVG value="http://localhost:3006/" width={20} height={20} />
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
                    <p id='paragh'>HITACHI WASHING MACHINE <br /><br /><br /><br /> AUTOMATIC 230V, Inverter</p>
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
            ))}
          </div>
        )}
      </div >
    </>

  );
};

export default UserDataTable;
