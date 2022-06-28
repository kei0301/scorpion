import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import { create } from 'ipfs-http-client';
import { useWeb3React } from '@web3-react/core';

import { useContact } from 'utils/usecontract';
import { calculatePrice } from 'utils';
import { defaltChainId, NETWORK } from 'constants/index';

import NFTINGHOVER from 'assets/hover.png';
import Loading from 'components/Loading';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Enter Your Scorpion Finance\'s Name'),
  price: yup
    .number()
    .required('Enter Price'),
});

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      '#upload': {
        opacity: '0',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        zIndex: '99',
        height: '40px',
        margin: '0',
        padding: '0',
        display: 'block',
        cursor: 'pointer',
        width: '100%',
      },
      '.input': {
        display: 'none'
      },
      '.faceImage': {
        color: 'white'
      }
    }
  })
);

const initialValues = { name: '', price: '' };

const Form = () => {
  useStyles();
  const { active, account, chainId } = useWeb3React();
  const contract = useContact();
  const [buffer, setBuffer] = useState();
  const [displayImage, setDisplayImg] = useState(NFTINGHOVER);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const nativeCurrency = NETWORK[chainId || defaltChainId]?.nativeCurrency;

  const handleCapture = (target) => {
    chooseImage(target);
    setSelectedFile(target.target.files[0]);
  };

  const onSubmit = async (values) => {
    const cid = await ipfs.add(buffer);
    const tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
    const price = calculatePrice(String(values.price), nativeCurrency?.decimals);
    setLoading(true);
    contract.methods.mintScorpionFinance(values.name, tokenURI, price)
      .send({ from: account })
      .on('confirmation', () => {
        setLoading(false);
        setBuffer('');
        setDisplayImg(NFTINGHOVER);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit,
  });

  const chooseImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const render = new FileReader();
    render.onload = () => {
      if (render.readyState === 2) {
        setDisplayImg(render.result);
      }
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result);
        setBuffer(buffer);
      };
    };
    render.readAsDataURL(e.target.files[0]);
  };

  if (loading) return <Loading />;

  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item container justifyContent='center' xs={12} md={5}>
          <Card sx={{ maxWidth: 350, height: 450 }}>
            <CardMedia component='img' sx={{ height: '100%' }} image={displayImage} alt='mint image' />
          </Card>
        </Grid>
        <Grid item container justifyContent='center' xs={12} md={7}>
          <Box>
            <Box marginBottom={4}>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                Mint Scorpion NFT
              </Typography>
            </Box>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' sx={{ marginBottom: 2 }}>
                    Select Image
                  </Typography>
                  <input accept='image/jpeg' className='input' id='faceImage' type='file' onChange={handleCapture} />
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      variant='outlined'
                      name='name'
                      value={selectedFile ? selectedFile.name : 'Select Image'}
                      sx={{ width: '100%' }}
                      disabled
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                    <Tooltip title='Select Image' style={{
                      position: 'absolute',
                      top: '50%',
                      right: '0px',
                      transform: 'translateY(-50%)',
                    }}>
                      <label htmlFor='faceImage'>
                        <IconButton
                          color='primary'
                          onChange={formik.handleChange}
                          aria-label='upload picture'
                          component='span'
                        >
                          <AddIcon fontSize='large' />
                        </IconButton>
                      </label>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' sx={{ marginBottom: 2 }}>
                    Enter Your Scorpion Finance&apos;s Name
                  </Typography>
                  <TextField
                    label='Name *'
                    variant='outlined'
                    name='name'
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'stretched', sm: 'center' }}
                    justifyContent='space-between'
                    width={1}
                    marginBottom={2}
                  >
                    <Box marginBottom={{ xs: 1, sm: 0 }}>
                      <Typography variant='subtitle2'>
                        Enter Price In Ξ
                      </Typography>
                    </Box>
                  </Box>
                  <TextField
                    label='Price *'
                    variant='outlined'
                    name='price'
                    type='number'
                    fullWidth
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Grid>
                <Grid item container xs={12}>
                  <Box
                    display='flex'
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'stretched', sm: 'center' }}
                    justifyContent='flex-end'
                    width={1}
                    margin='0 auto'
                  >
                    <Button size='large' variant='contained' type='submit' disabled={!active}>
                      Mint My Scorpion Finance
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;
