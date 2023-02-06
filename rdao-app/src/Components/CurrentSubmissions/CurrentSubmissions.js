import "./currentSubmissions.css";
import lighthouse from "@lighthouse-web3/sdk";
import { useState, useEffect } from "react";
import ArticlesSubmitted from "../ArticlesSubmitted/ArticlesSubmitted";
import { utils } from "ethers";

function CurrentSubmissions(props) {

    const [Articles, setArticles] = useState([]);
    

    useEffect(() => {
        let userNbVotes;
        const loadCurrentSubmissions = async () => {

            const nbArticlesSession = await props.governanceContract.nbArticles();
            const voteCost = utils.formatUnits(await props.governanceContract.voteCost(), "ether");
            const hash = await props.governanceContract.getSessionHashes();
            const author = await props.governanceContract.getSessionAuthors();
            const numberVotes = await props.governanceContract.getSessionVotes();
            const voters = await props.governanceContract.getVoters(window.ethereum.selectedAddress);

            for (let i = 0; i<nbArticlesSession.toString(); i++){
                
                const title = (await lighthouse.getFileInfo(hash[i])).data.fileName;

                if(voters.length > i){
                    userNbVotes = voters[i];
                } else {
                    userNbVotes = 0;
                }

                const article = {
                    title: title,
                    link: 'https://gateway.lighthouse.storage/ipfs/' + hash[i],
                    author: author[i],
                    index: i,
                    voteCost: voteCost,
                    numberVotes: numberVotes[i],
                    userNbVotes: userNbVotes
                }
                setArticles(Articles => [...Articles, article])
            }
        }

        loadCurrentSubmissions()
    }, [])

    return (
        <div className="currentSubmissions">
            <ArticlesSubmitted Articles={Articles.sort((a, b) => a['numberVotes'] <= b['numberVotes'] ? 1 : -1)} provider={props.provider} RDAO={props.RDAO} governanceContract={props.governanceContract} />
        </div>
    )
    
}

export default CurrentSubmissions