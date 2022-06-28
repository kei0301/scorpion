import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Grid, Chip, Box, Button, Typography, DialogContent, DialogActions, Card, CardMedia } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBackIos } from '@mui/icons-material';
import { useWeb3React } from '@web3-react/core';
import CryptoPrice from 'crypto-price';

import Main from 'layouts/Main';
import Container from 'components/Container';
import { NETWORK, defaltChainId } from 'constants/index';
import { useContact, useDefaltContact } from 'utils/usecontract';
import { formatBNToString } from 'utils';
import { BootstrapDialogTitle, BootstrapDialog } from 'components/BootstrapDialog';
import Loading from 'components/Loading';

const Buy = () => {
  const theme = useTheme();
  const { tokenId } = useParams();
  const { chainId, account } = useWeb3React();
  const history = useHistory();
  const contract = useContact();
  const { dcontract, web3 } = useDefaltContact(chainId || defaltChainId);
  const nativeCurrency = NETWORK[chainId || defaltChainId]?.nativeCurrency;

  const [scorpion, setScorpion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCollections = async () => {
    if (dcontract?.methods === undefined || !tokenId) return;
    setLoading(true);
    const nft = await dcontract.methods.allScorpionFinances(tokenId).call();
    await setScorpion(nft);
    setLoading(false);
  };

  const buyNFT = () => {
    setLoading(true);
    handleClose();
    contract.methods.buyToken(tokenId)
      .send({ from: account, value: scorpion?.price })
      .on('confirmation', () => {
        getCollections();
        setLoading(false);
      });
  };

  const getCryptoPrice = () => {
    CryptoPrice.getCryptoPrice('USD', nativeCurrency?.symbol)
      .then(res => {
        setPrice(res.price);
      }).catch(err => {
        console.log('err', err);
      });
  };

  const getBalance = async () => {
    if (!account) return;
    web3.eth.getBalance(account, (err, result) => {
      if (!err) setBalance(result);
    });
  };

  useEffect(() => {
    getCollections();
    getCryptoPrice();
  }, [chainId, tokenId]);

  useEffect(() => {
    getBalance();
  }, [chainId, account]);

  return (
    <Main>
      <Box
        position={'relative'}
        sx={{ backgroundColor: theme.palette.alternate.main }}
      >
        <Container>
          <Box>
            <Box display='flex' justifyContent='space-between' mb={2}>
              <Button variant='outlined' startIcon={<ArrowBackIos />} onClick={() => history.goBack()}>
                Back
              </Button>
              <Button variant='outlined' onClick={handleClickOpen} disabled={scorpion?.currentOwner === account || !scorpion?.forSale}>
                Buy Now
              </Button>
            </Box>
            {
              loading ?
                <Loading /> : (
                  scorpion &&
                  <Grid container spacing={6}>
                    <Grid item container justifyContent='center' xs={12} md={5}>
                      <Card sx={{ maxWidth: 350, height: 450, marginTop: '1rem' }}>
                        <CardMedia component='img' sx={{ height: '100%' }} image={scorpion?.tokenURI} alt='mint image' />
                      </Card>
                    </Grid>
                    <Grid item justifyContent='center' xs={12} md={7}>
                      <Chip label={`TokenID: ${scorpion?.tokenId}`} />
                      {!scorpion?.forSale &&
                        <Chip sx={{ marginLeft: '0.5rem' }} label='Currently not for sale!' />
                      }
                      <Box mt={2} display='flex' alignItems='center'>
                        <img src={nativeCurrency?.icon} width={30} height={30} />
                        <Typography variant='h4' sx={{ margin: '0 1rem', fontWeight: '900' }}>
                          {formatBNToString(scorpion?.price, nativeCurrency?.decimals)} {nativeCurrency?.symbol}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          ≈ $ {(Number(formatBNToString(scorpion?.price, nativeCurrency?.decimals)) * price).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box>
                      </Box>
                      <Box mt={2}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                          Name : {scorpion?.tokenName}
                        </Typography>
                      </Box>
                      <Box mt={1}>
                        <Typography sx={{ fontWeight: '700', fontSize: '1.2rem' }} color='text.secondary'>
                          Minted By : {`${scorpion?.mintedBy.substr(0, 7)}...${scorpion?.mintedBy.slice(scorpion?.mintedBy.length - 7)}`}
                        </Typography>
                        <Typography sx={{ fontWeight: '700', fontSize: '1.2rem' }} color='text.secondary'>
                          Owned By : {`${scorpion?.currentOwner.substr(0, 7)}...${scorpion?.currentOwner.slice(scorpion?.currentOwner.length - 7)}`}
                        </Typography>
                        <Typography sx={{ fontWeight: '700', fontSize: '1.2rem' }} color='text.secondary'>
                          Previous Owner : {`${scorpion?.previousOwner.substr(0, 7)}...${scorpion?.previousOwner.slice(scorpion?.previousOwner.length - 7)}`}
                        </Typography>
                        <Typography sx={{ fontWeight: '700', fontSize: '1.2rem' }} color='text.secondary'>
                          No.of Transfers: {scorpion?.numberOfTransfers}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )
            }
          </Box>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
          >
            <BootstrapDialogTitle onClose={handleClose}>
            </BootstrapDialogTitle>
            <DialogContent>
              <Typography gutterBottom variant='h4'>
                Buy NFT
              </Typography>
              {
                scorpion?.price > balance ?
                  <Typography gutterBottom>
                    Your balance is not enough.
                  </Typography>
                  :
                  <Typography gutterBottom>
                    Are you sure to buy this NFT with {formatBNToString(scorpion?.price, nativeCurrency?.decimals)} {nativeCurrency?.symbol}?
                  </Typography>
              }
              <Typography gutterBottom>
                Current balance: {formatBNToString(balance, nativeCurrency?.decimals)} {nativeCurrency?.symbol}
              </Typography>
            </DialogContent>
            <DialogActions id="DialogAction" fullWidth>
              <Button sx={{ width: '50%' }} variant="outlined" size="medium" onClick={handleClose}>Close</Button>
              <Button sx={{ width: '50%' }} variant="outlined" size="medium" onClick={buyNFT} disabled={scorpion?.price > balance}>Buy</Button>
            </DialogActions>
          </BootstrapDialog>
        </Container>
      </Box>
    </Main>
  );
};

export default Buy;
