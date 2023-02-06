import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from './Components/Header/Header'
import Main from './Components/Main/Main'
import Footer from './Components/Footer/Footer'

import { providers, Contract } from "ethers";
import RDAO_ABI from "./Abis/RdaoAbi";
import GOVERNANCE_ABI from "./Abis/governanceAbi";

function App() {

  const [address, setAddress] = useState('0x');
  let metamaskIcon;

  const provider = new providers.JsonRpcProvider(process.env.REACT_APP_HYPERSPACE_RPC);

  const RDAO = new Contract(process.env.REACT_APP_RDAO_CONTRACT_ADDRESS, RDAO_ABI, provider);
  const governanceContract = new Contract(process.env.REACT_APP_GOVERNANCE_CONTRACT_ADDRESS, GOVERNANCE_ABI, provider);

  const getAccount = async () => {
    const accounts = await window.ethereum.request({method: 'eth_accounts'});
    const account = accounts[0];
    return account
  };

  const handleClick = async (e) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    setAddress(account.slice(0,5) + '...' + account.slice(-4))
  }

  useEffect (() => {

    getAccount()
      .then(account => {
        if (account) {
          setAddress(account.slice(0,5) + '...' + account.slice(-4))
        }
      });

  }, []);

  useEffect(() => {

    const listener = ([selectedAddress]) => {
      setAddress(selectedAddress.slice(0,5) + '...' + selectedAddress.slice(-4));
    };
    window.ethereum.on(`accountsChanged`, listener);

    return () => {
        window.ethereum.removeListener(`accountsChanged`, listener);
      };

}, []);

  if (address === '0x') {
      metamaskIcon = <button className="enableEthereumButton" onClick={handleClick} >Connect</button>
  } else {
      metamaskIcon = <span className="showAccount"> Account: {address} </span>
  }

  return (
    <div className="App">
      <BrowserRouter>
          <Header metamaskIcon={metamaskIcon} address={address}/>
          <Main provider={provider} RDAO={RDAO} governanceContract={governanceContract} />
          <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
