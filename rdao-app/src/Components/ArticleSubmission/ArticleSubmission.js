import "./articleSubmission.css";
import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from 'react';
import { utils } from 'ethers';

function ArticleSubmission(props) {

  const [onChangeEvent, setOnChangeEvent] = useState(new Event('change'));
  const [submissionFee, setSubmissionFee] = useState(0);

  useEffect(()=> {
    const getFee = async() => {
      const fees = await props.governanceContract.fee();
      setSubmissionFee(utils.formatUnits(fees, "ether"));
    }
    getFee();
  },[])
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const output = await lighthouse.upload(onChangeEvent, process.env.REACT_APP_LIGHTHOUSE_API_KEY);
    const fee = await props.governanceContract.fee();

    const accounts = await window.ethereum.request({method: 'eth_accounts'});
    const allowance = await props.RDAO.allowance(accounts[0], props.governanceContract.address);

    if (allowance.gte(fee)) {
        const tx = await props.governanceContract.populateTransaction.submitArticle(output.data.Hash);

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
        const approval = await props.RDAO.populateTransaction.approve(props.governanceContract.address, fee.mul(5));
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
        const tx = await props.governanceContract.populateTransaction.submitArticle(output.data.Hash);

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

  return (
    <div className="articleSubmission">
      Click on the "Choose File" button to upload a pdf:
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e)=>setOnChangeEvent(e)}/>
        <input type="submit"/>
      </form>
      Submission Fee ($RDAO): {submissionFee}
    </div>
  )
}

export default ArticleSubmission