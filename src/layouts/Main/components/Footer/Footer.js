import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const Footer = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <Box sx={3}>
          <Typography variant="h5">
            © Scropin Finance
          </Typography>
        </Box>
        <Box sx={3}>
          <Typography variant="h5">
            About
          </Typography>
          <Typography mt={1}>
            White Paper
          </Typography>
          <Typography mt={1}>
            Project Overview
          </Typography>
          <Typography mt={1}>
            Token Metrics
          </Typography>
          <Typography mt={1}>
            Game Instructions
          </Typography>
        </Box>
        <Box sx={3}>
          <Typography variant="h5">
            Social
          </Typography>
          <Typography mt={1}>
            Telegram
          </Typography>
          <Typography mt={1}>
            Twitter
          </Typography>
          <Typography mt={1}>
            Telegram
          </Typography>
          <Typography mt={1}>
            Discord
          </Typography>
          <Typography mt={1}>
            Blog
          </Typography>
          <Typography mt={1}>
            DAO Governance
          </Typography>
        </Box>
        <Box sx={3}>
          <Typography variant="h5">
            Info
          </Typography>
          <Typography mt={1}>
            Official Token
          </Typography>
          <Typography mt={1}>
            Help Center
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Footer;
