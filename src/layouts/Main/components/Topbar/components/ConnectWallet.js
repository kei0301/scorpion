import React from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { injected } from 'utils/connectors';
import Button from '@mui/material/Button';

const ConnectWallet = () => {
  const { deactivate, activate, active } = useWeb3React();

  const connect = () => {
    if (!active) {
      activate(injected, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          void activate(injected);
        }
      });
    } else {
      deactivate();
    }
  };

  return (
    <Button
      variant='contained'
      color='primary'
      target='blank'
      size='large'
      onClick={connect}
    >
      {active ? 'Disconnect Wallet' : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWallet;