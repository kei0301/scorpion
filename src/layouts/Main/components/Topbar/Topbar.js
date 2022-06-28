import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { ConnectWallet } from './components';
import { default as ThemeModeToggler } from '../ThemeModeToggler';
import Logo from 'assets/logo.png';

const useStyles = makeStyles({
  root: {
    textDecoration: 'none',
    textDecorationColor: 'transparent !important',
    fontWeight: 700
  },
});

const Topbar = ({ onSidebarOpen }) => {
  const theme = useTheme();
  const classes = useStyles();
  const [activeLink, setActiveLink] = useState('');
  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={1}
    >
      <Box
        display={'flex'}
        component={Link}
        to="/"
        title="theFront"
        width={{ xs: 100, md: 120 }}
        alignItems={'center'}
      >
        <Box
          component={'img'}
          src={Logo}
          height={1}
          width={1}
        />
        <Box
          marginLeft={4}
          flex={'none'}
        >
          <Typography
            component={Link}
            to={'/'}
            className={classes.root}
            sx={{
              justifyContent: 'flex-start',
              color:
                activeLink === '/'
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              fontWeight: activeLink === '/' ? 600 : 400,
            }}
            fontWeight={activeLink === '/' ? 700 : 400}
          >
            Market Place
          </Typography>
        </Box>
        {/* <Box
          marginLeft={4}
          flex={'none'}
        >
          <Typography
            component={Link}
            to={'/mintnft'}
            className={classes.root}
            sx={{
              justifyContent: 'flex-start',
              color:
                activeLink === '/mintnft'
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              fontWeight: activeLink === '/mintnft' ? 600 : 400,
            }}
            fontWeight={activeLink === '/mintnft' ? 700 : 400}
          >
            Mint NFT
          </Typography>
        </Box> */}
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems={'center'}>
        <Box marginLeft={2}>
          <ThemeModeToggler />
        </Box>
        <Box marginLeft={2}>
          <ConnectWallet />
        </Box>
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }} alignItems={'center'}>
        <Button
          onClick={() => onSidebarOpen()}
          aria-label="Menu"
          variant={'outlined'}
          sx={{
            borderRadius: 2,
            minWidth: 'auto',
            padding: 1,
            borderColor: alpha(theme.palette.divider, 0.2),
          }}
        >
          <MenuIcon />
        </Button>
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
