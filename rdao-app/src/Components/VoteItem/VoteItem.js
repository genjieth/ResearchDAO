import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import './voteItem.css';

function VoteItem(props) {

    const [votes, setVotes] = useState(0);
    const [cost, setCost] = useState(0);
    const a = props.userNbVotes+1;

    const clickMinus = () => {
        if (votes > 0) {
            setVotes(votes - 1);
        }
    }

    const clickPlus = () => {
        setVotes(votes + 1);
    }

    const submitVote = async (e) => {
        e.preventDefault();

        const accounts = await window.ethereum.request({method: 'eth_accounts'});
        const allowance = await props.RDAO.allowance(accounts[0], props.governanceContract.address);
    
        if (allowance.gte(BigNumber.from(cost).mul(BigNumber.from('1000000000000000000')))) {
            const tx = await props.governanceContract.populateTransaction.vote(props.index, votes);
    
            const transactionParameters = {
              to: tx.to,
              from: window.ethereum.selectedAddress,
              data: tx.data
            };
    
            await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [transactionParameters],
            });
        } else {
            const approval = await props.RDAO.populateTransaction.approve(props.governanceContract.address, BigNumber.from(cost).mul(BigNumber.from('1000000000000000000')).mul(5));
            const from = window.ethereum.selectedAddress
    
            const approvalParameters = {
              to: approval.to,
              from: from,
              data: approval.data
            };
            const approved = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [approvalParameters],
            });
    
            await props.provider.waitForTransaction(approved)
            const tx = await props.governanceContract.populateTransaction.vote(props.index, votes);
    
            const transactionParameters = {
              to: tx.to,
              from: from,
              data: tx.data
            };
            await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [transactionParameters],
            });
        }
    }

    useEffect (() => {
        setCost((votes*a*a + votes*(votes-1)*a +(votes-1)*votes*(2*votes-1)/6) * props.voteCost);
    }, [a, props, votes]);
    
    return (
        <div className='vote'>
            <div className="title-vote text-center">
                Vote for this article
            </div>
            <div className="vote-info text-center">
                User votes for this article: {props.userNbVotes}
            </div>
            <div className="vote-tool">
                <button className="button-minus" onClick={clickMinus}>
                    -
                </button>
                <input className="nbVotes" value={votes} readOnly>
                </input>
                <button className="button-plus" onClick={clickPlus}>
                    +
                </button>
            </div>
            <div className="cost text-center">
                Total cost : {cost} $RDAO
            </div>
            <div className="submit-vote">
                <button onClick={submitVote}>
                    Vote
                </button>
            </div>
        </div>
      )
}

export default VoteItem