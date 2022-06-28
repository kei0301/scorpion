import React, { useEffect, useState } from 'react';
import { Box, FormControlLabel, Grid, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';
import { NFTCard } from './components';
import { useDefaltContact } from 'utils/usecontract';
import { useWeb3React } from '@web3-react/core';
import { NETWORK, defaltChainId } from 'constants/index';
import IOSSwitch from 'components/IOSSwitch';
import { formatBNToString } from 'utils';
import Loading from 'components/Loading';

const useStyles = makeStyles({
  descriptionHeader: {
    borderStyle: 'solid',
    borderImage: 'linear-gradient(270deg,#050511 1%,#31CB9E  50%,rgba(255,239,160,0)) 100% 0 100% 0/1px 0 1px 0 stretch',
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center'
  },
});

const MARKETPLACE = () => {
  const theme = useTheme();
  const classes = useStyles();
  const { active, chainId, account } = useWeb3React();
  const { dcontract } = useDefaltContact(chainId || defaltChainId);
  const [scorpion, setScorpion] = useState([]);
  const [totalScorpion, setTotalScorpion] = useState([]);
  const [isOwned, setIsOwned] = useState(false);
  const [loading, setLoading] = useState(false);
  const nativeCurrency = NETWORK[chainId || defaltChainId]?.nativeCurrency;

  const getCollections = async () => {
    if (dcontract?.methods === undefined) return;
    setLoading(true);
    await setScorpion([]);
    await setTotalScorpion([]);
    const counter = await dcontract.methods.scorpionFinanceCounter().call();
    for (let i = 1; i <= counter; i++) {
      const nft = await dcontract.methods.allScorpionFinances(i).call();
      await setScorpion(preState => [...preState, nft]);
      await setTotalScorpion(preState => [...preState, nft]);
    }
    setLoading(false);
  };

  const onOwned = () => {
    if (!isOwned) {
      setScorpion(totalScorpion.filter(e => e.currentOwner === account));
    } else {
      setScorpion(totalScorpion);
    }
    setIsOwned(!isOwned);
  };

  useEffect(() => {
    getCollections();
  }, [active]);

  const total = scorpion.reduce((sum, e) => Number(sum) + Number(e.price), 0);
  const highest = scorpion.reduce((e, a) => e = e > a.price ? e : a.price, 0);
  const totalSupply = scorpion?.length;

  return (
    <Main>
      <Box
        position={'relative'}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Container>
          <Box className={classes.descriptionHeader}>
            <Box>
              <Box>Total supply</Box>
              <Box fontSize={30} fontWeight='bold'>{totalSupply}</Box>
            </Box>
            <Box>
              <Box>Total volume</Box>
              <Box fontSize={28} fontWeight='bold'>{formatBNToString(total, nativeCurrency?.decimals)} {nativeCurrency?.symbol}</Box>
            </Box>
            <Box>
              <Box>Highest price</Box>
              <Box fontSize={30} fontWeight='bold'>{formatBNToString(highest, nativeCurrency?.decimals)} {nativeCurrency?.symbol}</Box>
            </Box>
          </Box>
          {
            loading ?
              <Loading /> : (
                <Box m={2} ml={4} mr={4}>
                  <Box display='flex' justifyContent='flex-end'>
                    <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} size='large' />}
                      onChange={() => onOwned()}
                      label='Owned'
                    />
                  </Box>
                  <Grid container spacing={2} mt={1} mb={0}>
                    {scorpion.map((item, key) => (
                      <NFTCard key={key} item={item} currency={nativeCurrency} />
                    ))}
                  </Grid>
                  {
                    totalSupply > 8 &&
                    <Box display='flex' justifyContent='center' mt={3}>
                      <Pagination count={10} variant='outlined' size='large' color='primary' />
                    </Box>
                  }
                </Box>
              )
          }
        </Container>
      </Box>
    </Main>
  );
};

export default MARKETPLACE;
