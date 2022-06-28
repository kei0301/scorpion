import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import Routes from './Routes';
import Page from './components/Page';
import getLibrary from 'utils/getlibrary';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-image-lightbox/style.css';
import 'aos/dist/aos.css';

const App = () => {
  return (
    <Page>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Web3ReactProvider>
    </Page>
  );
};

export default App;
