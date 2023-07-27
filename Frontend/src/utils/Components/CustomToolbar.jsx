import React from 'react';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import GetAppIcon from "@mui/icons-material/GetApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
    TotalCount,

}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <div>
                <IconButton onClick={handleMenuOpen} color="primary" aria-label="Export">
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
                        color="primary"
                        icon={<PictureAsPdfIcon color="primary" style={{ marginRight: '8px' }} />}
                        text="Export to PDF"
                        onClick={handlePdfExport}
                    />
                    <ExportMenuItem
                        color="primary"
                        icon={<GetAppIcon color="primary" style={{ marginRight: '8px' }} />}
                        text="Export to Excel"
                        onClick={handleExport}
                    />
                </Menu>
            </div>
            {TotalCount && (<Typography variant="body2" color="primary"

            >
                Total Count:
                <span style={{ color: "crimson" }}> {TotalCount}</span>
            </Typography>)}
        </GridToolbarContainer >
    );
};

export default CustomToolbar;
