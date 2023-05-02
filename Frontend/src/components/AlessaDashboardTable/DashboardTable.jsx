import "./DashboardTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
// import logo from "../../../images/download.png";
import CustomSnakebar from "../../utils/CustomSnakebar";
import { ReceiptsContext } from "../../contexts/ReceiptsContext";

const DashboardTable = ({
    columnsName,
    data,
    title,
    uniqueId,
}) => {
    const navigate = useNavigate();
    const [record, setRecord] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const { statedata, updateData } = useContext(ReceiptsContext);
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
    useEffect(() => {
        if (data) {
            setRecord(
                data.map((item, index) => ({ ...item, id: index + 1 }))
            );
        }
    }, [data]);



    console.log("see the data");
    console.log(data);



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

    const updateRowData = rowData => {
        rowData.POQTY = rowData.QTY;
        delete rowData.QTY;
        return rowData;
    };
    const handleRowClick = (rowData, idx) => {
        if (uniqueId === "receiptsManagement") {
            console.log("rowData", rowData);

            let newData = updateRowData(rowData);
            console.log("newData", newData);
            updateData(newData);
            navigate("/receiptsecond")
        }
        else {
            return
        }

    };

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







