import "./header.css";
import { NavbarBrand } from 'reactstrap';
import { NavLink } from 'react-router-dom';

function Header(props) {

  let ownerPage;

  if (props.address === process.env.REACT_APP_OWNER.toLowerCase()) {
    ownerPage = <NavLink className="nav-link" to="/ownerPage">
                  Owner Page
                </NavLink>
  } else {
    ownerPage = <>
                </>
  }

  return (
    <div className="header">
      <div className="logo">
        <NavbarBrand href="/">
            <img src="favicon.ico" height="50" width="50" className="App-logo" alt="logo" />
        </NavbarBrand>
      </div>
      <div className="navbar">
        <NavLink className="nav-link" to="/">
          Home
        </NavLink>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <NavLink className="nav-link" to="/articleSubmission">
          Article Submission
        </NavLink>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <NavLink className="nav-link" to="/currentSubmissions">
          Current Submissions
        </NavLink>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <NavLink className="nav-link" to="/proceedings">
          Proceedings
        </NavLink>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {ownerPage}
      </div>
      <div className="wallet">
        {props.metamaskIcon}
      </div>
    </div>
  )

}

export default Header