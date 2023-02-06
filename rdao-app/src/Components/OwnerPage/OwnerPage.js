import './ownerPage.css';
import { useState } from 'react';
import { BigNumber } from 'ethers';

function OwnerPage(props) {

  const [fee, setFee] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [authorsReward, setAuthorsReward] = useState(0);
  const [votersReward, setVotersReward] = useState(0);
  const [voteCost, setVoteCost] = useState(0);
  const [funds, setFunds] = useState(0);

  const setFeeValue = (e) => {
    setFee(e.target.value);
  }

  const setThresholdValue = (e) => {
    setThreshold(e.target.value);
  }

  const setAuthorsRewardValue = (e) => {
    setAuthorsReward(e.target.value);
  }

  const setVotersRewardValue = (e) => {
    setVotersReward(e.target.value);
  }

  const setVoteCostValue = (e) => {
    setVoteCost(e.target.value);
  }

  const setFundsValue = (e) => {
    setFunds(e.target.value);
  }

  const setFeeOnChain = async () => {
    const tx = await props.governanceContract.populateTransaction.setFee(BigNumber.from('1000000000000000000').mul(fee));

    const transactionParameters = {
      to: tx.to,
      from: window.ethereum.selectedAddress,
      data: tx.data
    };
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  const setThresholdOnChain = async () => {
    const tx = await props.governanceContract.populateTransaction.setThreshold(threshold);

    const transactionParameters = {
      to: tx.to,
      from: window.ethereum.selectedAddress,
      data: tx.data
    };
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  const setRewardsOnChain = async () => {
    const tx = await props.governanceContract.populateTransaction.setRewards(authorsReward, votersReward);

    const transactionParameters = {
      to: tx.to,
      from: window.ethereum.selectedAddress,
      data: tx.data
    };
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  const setVoteCostOnChain = async () => {
    const tx = await props.governanceContract.populateTransaction.setVoteCost(BigNumber.from('1000000000000000000').mul(voteCost));

    const transactionParameters = {
      to: tx.to,
      from: window.ethereum.selectedAddress,
      data: tx.data
    };
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  const releaseFundsOnChain = async () => {
    const tx = await props.governanceContract.populateTransaction.releaseFunds(BigNumber.from('1000000000000000000').mul(funds));

    const transactionParameters = {
      to: tx.to,
      from: window.ethereum.selectedAddress,
      data: tx.data
    };
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  const makeProceedingsOnChain = async () => {
    const hashes = await props.governanceContract.getSessionHashes();
    const authors = await props.governanceContract.getSessionAuthors();
    const numberVotes = await props.governanceContract.getSessionVotes();
    const thresholdOnchain = await props.governanceContract.threshold();

    const N = hashes.length;
    var articles = [];

    for (let i = 0; i < N; i++){
      articles.push({
        hash: hashes[i],
        author: authors[i],
        votes: numberVotes[i]
      })
    }

   const nbMaxArticles = Math.max(1, parseInt(thresholdOnchain/100*N));
    articles.sort((a, b) => {
      return b.votes - a.votes;
    });

    var _selectedHashes = [];
    var _selectedAuthors = [];
    var _selectedVotes = [];

    for (let i = 0; i < nbMaxArticles; i++){
      _selectedHashes.push(articles[i]['hash']);
      _selectedAuthors.push(articles[i]['author']);
      _selectedVotes.push(articles[i]['votes']);
    }

    const tx = await props.governanceContract.populateTransaction.makeProceedings(_selectedHashes, _selectedAuthors, _selectedVotes);

    const transactionParameters = {
      to: tx.to,
      from: window.ethereum.selectedAddress,
      data: tx.data
    };
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  return (
    <div className="owner">
      <h2>Owner Dashboard</h2>
       <div className="set-fee">
          Set Submission Fee ($RDAO): &nbsp;&nbsp;
          <input value={fee} onChange={setFeeValue} />
          <button onClick={setFeeOnChain}>
            Set Fee
          </button>
       </div>
       <div className="set-threshold">
          Set Acceptance Threshold (%): &nbsp;&nbsp;
          <input value={threshold} onChange={setThresholdValue} />
          <button onClick={setThresholdOnChain}>
            Set Threshold
          </button>
       </div>
       <div className="set-rewards">
        <div className="input-rewards">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Set Rewards (%): &nbsp;&nbsp;
          Authors Reward &nbsp;&nbsp;
          <input value={authorsReward} onChange={setAuthorsRewardValue} />
          &nbsp;&nbsp;
          Voters Reward
          &nbsp;&nbsp;
          <input value={votersReward} onChange={setVotersRewardValue} />
        </div>
        <div className="button-rewards">
          <button onClick={setRewardsOnChain}>
            Set Rewards
          </button>
        </div>
       </div>
       <div className="set-vote-cost">
          Set Unit Vote Cost ($RDAO): &nbsp;&nbsp;
          <input value={voteCost} onChange={setVoteCostValue} />
          <button onClick={setVoteCostOnChain}>
            Set Vote Cost
          </button>
       </div>
       <div className="release-funds">
          Release Funds to pay for Storage ($RDAO): &nbsp;&nbsp;
          <input value={funds} onChange={setFundsValue} />
          <button onClick={releaseFundsOnChain}>
            Release Funds
          </button>
       </div>
       <div className="make-proceedings">
          <button onClick={makeProceedingsOnChain}>
            Make proceedings
          </button >
       </div>
    </div>
  )
}

export default OwnerPage