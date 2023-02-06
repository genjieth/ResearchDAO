import './proceedings.css';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Proceedings(props) {

  var proceedingsLinks = [];

  for (let i=0; i<props.session; i++) {
    proceedingsLinks.push(<NavLink  key={uuidv4()} className="nav-link" to={'/proceedings/' + i}>
              Proceedings {i}
            </NavLink>);
  }

  return (
    <div className="proceedings">
        <h2>Proceedings</h2>

        {proceedingsLinks.map((link) => {
            return(link)
          })}

    </div>
  )
}

export default Proceedings