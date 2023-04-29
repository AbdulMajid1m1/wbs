import "./DashboardTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import logo from "../../../images/download.png";
import CustomSnakebar from "../../utils/CustomSnakebar";

const DashboardTable = ({
    columnsName,
    data,
    title,
}) => {
    const navigate = useNavigate();
    const [record, setRecord] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [qrcodeValue, setQRCodeValue] = useState('');
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [companyLogo, setLogo] = useState(null);
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState(null);
    const [error, setError] = useState(null);
    const resetSnakeBarMessages = () => {
        setError(null);
        setMessage(null);

    };

    // Retrieve the value with the key "myKey" from localStorage getvalue
    const myValue = localStorage.getItem("userId");
    // useEffect(() => {

    //     setRecord(() => {
    //         data.map((item, index) => {
    //             item.id = index + 1;
    //         });
    //         setRecord(
    //             data.map((item, index) => ({ ...item, id: index + 1 }))
    //         );
    //     });
    // }, [data]);
    useEffect(() => {
        if (data) { // add null check
          setRecord(() => {
            data.map((item, index) => {
              item.id = index + 1;
            });
            setRecord(
              data.map((item, index) => ({ ...item, id: index + 1 }))
            );
          });
        }
      }, [data]);


    console.log("see the data");
    console.log(data);


    const handleRowClick = (item) => {
        const index = item.id;
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

    // Remove the selected row when it is unselected
    //  const handleSelectionChange = (selection) => {
    //   if (selection.length === 0) {
    //     setSelectedRow([]);
    //   }
    // };
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

    return (
        <>
            {message && <CustomSnakebar message={message} severity="success" onClose={resetSnakeBarMessages} />}
            {error && <CustomSnakebar message={error} severity="error" onClose={resetSnakeBarMessages} />}

            <div className="dashBoardDatatable">
                <div className="datatableTitle">
                    {title}

                </div>

                <DataGrid

                    getRowHeight={({ }) => {
                        let x;
                        x = 50;
                        return x;
                    }
                    }
                    className="datagrid"
                    rows={record}
                    columns={

                        idColumn.concat(columnsWithCustomCell)
                    }
                    pageSize={30}

                    rowsPerPageOptions={[30]}

                    checkboxSelection={false}
                    onRowClick={(params, rowIdx) => {
                        // call your handle function and pass the row data as a parameter
                        handleRowClick(params.row, rowIdx);
                    }}
                />

                {/* Displaying myValue inside the table Value in center*/}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "-40px", marginLeft: "10px", }}>
                    <style>
                        {`
            @media (max-width: 480px) {
              h1 {
                display: none;
              }
            }
            `}
                    </style>
                </div>

            </div>
        </>

    );
};

export default DashboardTable;







