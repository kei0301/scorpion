import ABI from 'assets/abi.json';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { NETWORK } from 'constants/index';

export const useDefaltContact = (chainId) => {
  if (NETWORK[chainId] === undefined) return;
  const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK[chainId].rpcUrls[0]));
  const dcontract = new web3.eth.Contract(ABI, NETWORK[chainId].contractAddress);
  return { web3, dcontract };
};

export const useContact = () => {
  const { active, library, chainId } = useWeb3React();
  if (!active || NETWORK[chainId] === undefined) return;
  const web3 = new Web3(library.provider);
  return new web3.eth.Contract(ABI, NETWORK[chainId].contractAddress);
};