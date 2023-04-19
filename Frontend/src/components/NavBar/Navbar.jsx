import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, Box, ButtonBase } from '@mui/material';
import { useTheme } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import alessa from "../../images/alessalogo2.png"

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const menuItems = [
        { title: 'Login', path: '/' },
        { title: 'Shipment', path: '/shipment' },
        { title: 'ShipmentId', path: '/shipmentid' },
        { title: 'ShipmentCL', path: '/shipmentcl' },
        { title: 'Items', path: '/items' },
    ];

    const handleClose = () => {
        setDrawerOpen(false);
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: 'white', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', elevation: 0, boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
                        {/* WBS */}
                        <img src={alessa} className='h-14 w-32' alt='' />
                    </Typography>  
                    {isMobile ? (
                        <>
                            <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)} sx={{ color: 'black' }}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={handleClose}>
                                <List>
                                    {menuItems.map((item, index) => (
                                        <ListItem key={index} component={ButtonBase} to={item.path} onClick={handleClose} sx={{ width: '100%' }}>
                                            <ListItemText primary={item.title} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        <Box>
                            {menuItems.map((item, index) => (
                                <Button key={index} color="inherit" component={RouterLink} to={item.path} sx={{ color: 'black', marginRight: 1 }}>
                                    {item.title}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavBar;
