import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
const CustomSnakebar = ({ message, severity, onClose }) => {

    const [state, setState] = React.useState({
        open: true,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;
    const handleClick = (newState) => () => {
        setState({ open: true, ...newState });
    };
    // let dateandtime = new Date().toLocaleString();
    // console.log(dateandtime);
    const handleClose = () => {
        setState({ ...state, open: false });
        if (onClose) onClose();
    };
    return (
        // <Snackbar
        //     anchorOrigin={{ vertical, horizontal }}
        //     open={open}
        //     onClose={handleClose}
        //     message="I love snacks"
        //     key={vertical + horizontal}
        // />
        <Snackbar open={open}
            key={message}
            anchorOrigin={{ vertical, horizontal }}
            TransitionComponent={Slide}
            autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity ?? "success"} sx={{ width: '100%' }}>

                {message ?? "something went wrong"}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnakebar