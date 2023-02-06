import './main.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import ArticleSubmission from '../ArticleSubmission/ArticleSubmission';
import CurrentSubmissions from '../CurrentSubmissions/CurrentSubmissions';
import Proceedings from '../Proceedings/Proceedings';
import ProceedingsDetails from '../ProceedingsDetails/ProceedingsDetails';
import OwnerPage from '../OwnerPage/OwnerPage';
import Home from '../Home/Home'
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function Main(props) {

  const [session, setSession] = useState(0);
  var proceedingsRoutes = [];

  useEffect(()=> {
    
    const getSession = async ()=> {
      setSession(await props.governanceContract.session())
    };

    getSession()
  })

  for (let i=0; i<session; i++) {
    proceedingsRoutes.push(<Route key={uuidv4()} path={'/proceedings/' + i} element={<ProceedingsDetails governanceContract={props.governanceContract} proceedingsIndex={i} />} />);
  }
  return (
    <>
      <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/articleSubmission' element={<ArticleSubmission provider={props.provider} RDAO={props.RDAO} governanceContract={props.governanceContract} />}/>
          <Route path='/currentSubmissions' element={<CurrentSubmissions provider={props.provider} RDAO={props.RDAO} governanceContract={props.governanceContract} />}/>
          <Route path='/proceedings' element={<Proceedings session={session} governanceContract={props.governanceContract} />} />
          
          {proceedingsRoutes.map((route) => {
            return(route)
          })}

          <Route path='/ownerPage' element={<OwnerPage governanceContract={props.governanceContract} />} />
          <Route path='*' element={<Navigate replace to="/" />} />
      </Routes>
    </>
  )
}

export default Main