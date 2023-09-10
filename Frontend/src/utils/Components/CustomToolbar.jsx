import React from 'react';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import GetAppIcon from "@mui/icons-material/GetApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import { Menu, MenuItem, Typography } from '@mui/material';

const ExportMenuItem = ({ icon, text, onClick }) => {
    return (
        <MenuItem onClick={onClick}>
            {icon}
            <Typography variant="body2" color="primary">
                {text}
            </Typography>
        </MenuItem>
    );
};

const CustomToolbar = ({
    handlePdfExport,
    handleExport,
    handleExcelImport,
    TotalCount,
    excelImport,
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
            handleExcelImport(file);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = null;
    };


    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <IconButton color="primary" aria-label="Export" onClick={handleMenuOpen}
                style={{ borderRadius: 0, padding: '4px 5px' }}
            >
                <GetAppIcon />
                <Typography variant="body2" color="primary">
                    Export
                </Typography>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <ExportMenuItem
                    icon={<PictureAsPdfIcon color="primary" style={{ marginRight: '8px' }} />}
                    text="Export to PDF"
                    onClick={handlePdfExport}
                />
                <ExportMenuItem
                    icon={<GetAppIcon color="primary" style={{ marginRight: '8px' }} />}
                    text="Export to Excel"
                    onClick={handleExport}
                />
            </Menu>
            {excelImport && (
                <IconButton
                    style={{ borderRadius: 0, padding: '4px 5px' }}
                    color="primary" component="span" onClick={() => fileInputRef.current.click()} aria-label="Import from Excel">
                    <FileUploadIcon />
                    <Typography variant="body2" color="primary">
                        Import From Excel
                    </Typography>
                </IconButton>)
            }
            <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".xlsx,.xls, .csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />
            {selectedFile && (
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                    <Typography variant="body2" color="primary">
                        {selectedFile}
                    </Typography>
                    <IconButton size="small" onClick={removeSelectedFile} color="primary"

                        style={{ marginBottom: '1px' }}
                    >
                        <CloseIcon fontSize="14px" />
                    </IconButton>
                </div>
            )}
            {TotalCount && (
                <Typography variant="body2" color="primary">
                    Total Count:
                    <span style={{ color: "crimson" }}> {TotalCount}</span>
                </Typography>
            )}
        </GridToolbarContainer>
    );
};

export default CustomToolbar;
