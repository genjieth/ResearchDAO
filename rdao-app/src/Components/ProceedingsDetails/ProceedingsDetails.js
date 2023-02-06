import './proceedingsDetails.css';
import lighthouse from "@lighthouse-web3/sdk";
import { useState, useEffect } from "react";
import AcceptedArticles from "../AcceptedArticles/AcceptedArticles";

function ProceedingsDetails(props) {

  const [Articles, setArticles] = useState([]);

  useEffect(() => {

    const loadAcceptedArticles = async () => {

        const nbArticlesProceedings = await props.governanceContract.nbArticlesProceedings(props.proceedingsIndex);
        const hash = await props.governanceContract.getProceedingsHashes(props.proceedingsIndex);
        const author = await props.governanceContract.getProceedingsAuthors(props.proceedingsIndex);
        const numberVotes = await props.governanceContract.getProceedingsVotes(props.proceedingsIndex);

        for (let i = 0; i < nbArticlesProceedings.toString(); i++){
            
            const title = (await lighthouse.getFileInfo(hash[i])).data.fileName;

            const article = {
                title: title,
                link: 'https://gateway.lighthouse.storage/ipfs/' + hash[i],
                author: author[i],
                numberVotes: numberVotes[i],
            }
            setArticles(Articles => [...Articles, article])
        }
    }

    loadAcceptedArticles()
}, [])

  return (
    <div className="proceedingsDetails">
        <h4>
          Proceedings {props.proceedingsIndex}
        </h4>
        <AcceptedArticles Articles={Articles.sort((a, b) => a['numberVotes'] <= b['numberVotes'] ? 1 : -1)} />
    </div>
  )
}

export default ProceedingsDetails