import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import CryptoPrice from 'crypto-price';
import { useWeb3React } from '@web3-react/core';

import { formatBNToString } from 'utils';

const useStyles = makeStyles({
  root: {
    minHeight: '10rem',
  },
  token: {
    position: 'absolute',
    top: '0.5rem',
    left: '0.5rem',
    height: '1.5rem',
  },
  level: {
    position: 'absolute',
    top: '1rem',
    paddingLeft: '0.2rem'
  },
  hoverImg: {
    width: '5rem',
    position: 'absolute',
    top: '1rem',
    left: '0',
    right: '0',
    margin: '0 auto',
    opacity: '.6',
  },
  bnbPrice: {
    margin: '0',
    marginLeft: '0.5rem',
    fontWeight: '700'
  },
  usdPrice: {
    textAlign: 'center'
  },
  img: {
    height: '100%'
  },
  sidebar: {
    position: 'absolute',
    top: '20px',
    right: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  female: {
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  human: {
    fontSize: '2rem',
    color: '#ababab',
    textTransform: 'uppercase',
    fontWeight: '500',
    marginTop: '1rem',
    writingMode: 'vertical-rl',
    letterSpacing: '0.1rem',
  },
});

const NFTCard = ({ item, currency }) => {
  const classes = useStyles();
  const history = useHistory();
  const { account } = useWeb3React();
  const [price, setPrice] = useState(0);

  const getCryptoPrice = () => {
    CryptoPrice.getCryptoPrice('USD', currency?.symbol)
      .then(res => {
        setPrice(res.price);
      }).catch(err => {
        console.log('err', err);
      });
  };

  const onNFT = () => {
    if (account === item.currentOwner) {
      history.push(`sell/${item.tokenId}`);
    } else {
      history.push(`buy/${item.tokenId}`);
    }
  };

  useEffect(() => {
    getCryptoPrice();
  }, []);

  return (
    <Grid
      item
      sm={6}
      md={3}
    >
      <Card className={classes.root} onClick={onNFT}>
        <CardActionArea>
          <Box sx={{ minHeight: '10rem' }}>
            <Box>
              <Chip className={classes.token} label={`TokenID: ${item.tokenId}`} />
            </Box>
            <CardMedia className={classes.img} component='img' image={item.tokenURI} alt='' />
          </Box>
          <CardContent>
            <Box>
              <Box display='flex' justifyContent='space-between'>
                <img src={currency?.icon} width={30} height={30} />
                <Typography className={classes.bnbPrice} variant='h5'>
                  {formatBNToString(item.price, currency?.decimals)} Ξ {currency?.symbol}
                </Typography>
                <Box sx={{ width: '24px' }} />
              </Box>
              <Typography className={classes.usdPrice} color='text.secondary'>
                ≈ $ {(Number(formatBNToString(item.price, currency?.decimals)) * price).toFixed(2)}
              </Typography>
            </Box>
            <Box className={classes.sidebar}>
              <Typography className={classes.human}>{item.tokenName}</Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

NFTCard.propTypes = {
  item: PropTypes.object.isRequired,
  currency: PropTypes.object.isRequired,
};

export default NFTCard;