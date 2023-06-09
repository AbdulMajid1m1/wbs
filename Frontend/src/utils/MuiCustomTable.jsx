
import { DataGrid } from "@mui/x-data-grid";
import { alpha, styled } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';

const ODD_OPACITY = 0.2;
const EVEN_OPACITY = 0.5;

function customCheckbox(theme) {
    return {
        '& .MuiCheckbox-root svg': {
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            border: `1px solid ${theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'
                }`,
            borderRadius: 2,
        },
        '& .MuiCheckbox-root svg path': {
            display: 'none',
        },
        '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
        },
        '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
            position: 'absolute',
            display: 'table',
            border: '2px solid #fff',
            borderTop: 0,
            borderLeft: 0,
            transform: 'rotate(45deg) translate(-50%,-50%)',
            opacity: 1,
            transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
            content: '""',
            top: '50%',
            left: '39%',
            width: 5.71428571,
            height: 9.14285714,
        },
        '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
            width: 8,
            height: 8,
            backgroundColor: '#1890ff',
            transform: 'none',
            top: '39%',
            border: 0,
        },
    };
}


export const MuiCustomTable = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}`]: {
        '&.odd': {
            backgroundColor: '#B4E4FF',
            '&:hover': {
                backgroundColor: alpha('#B4E4FF', 0.5),
            },
            '&.Mui-selected': {
                backgroundColor: alpha('#9AC5F4', 0.8),
            },
        },
        '&.even': {
            backgroundColor: '#FFFFFF',
            '&:hover': {
                backgroundColor: alpha("#F8F6F4", 1),
            },
            '&.Mui-selected': {
                backgroundColor: alpha('#9AC5F4', 0.8),
            },
        },
    },
    [`& .${gridClasses.columnHeader}`]: {
        backgroundColor: '#0079FF',
        color: '#FFFFFF',
        '& .MuiDataGrid-columnMenuIcon': {
            color: '#FFFFFF',
        },
    },

    [`& .${gridClasses.iconButtonContainer}`]: {
        color: '#FFFFFF',
    },
    [`& .${gridClasses.sortIcon}`]: {
        color: '#FFFFFF !important',
    },
    [`& .${gridClasses.columnMenuIcon}`]: {
        color: '#FFFFFF !important',
    },
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#1d1d1d' : '#1d1d1d',
    },


    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: "1px solid #0079FF",
    },
    '& .MuiDataGrid-cell': {
        color: 'rgba(0,0,0,.85)'
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
    // make three dot filter icon white
    '& .MuiDataGrid-iconSeparator': {
        color: '#FFFFFF',
    },
    ...customCheckbox(theme),
}));
