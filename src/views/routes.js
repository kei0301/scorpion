import React from 'react';

import {
  MintNFT,
  MarketPlace,
  Buy,
  Sell,
  NotFound,
  NotFoundCover,
} from 'views';

const routes = [
  {
    path: '/',
    renderer: (params = {}) => <MarketPlace {...params} />,
  },
  {
    path: '/mintnft',
    renderer: (params = {}) => <MintNFT {...params} />,
  },
  {
    path: '/buy/:tokenId',
    renderer: (params = {}) => <Buy {...params} />,
  },
  {
    path: '/sell/:tokenId',
    renderer: (params = {}) => <Sell {...params} />,
  },
  {
    path: '/not-found',
    renderer: (params = {}) => <NotFound {...params} />,
  },
  {
    path: '/not-found-cover',
    renderer: (params = {}) => <NotFoundCover {...params} />,
  },
];

export default routes;
