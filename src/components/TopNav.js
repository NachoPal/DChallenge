import React from 'react';
import { Link } from 'react-router-dom';
import {
  LANDING_PATH,
  OPEN_CHALLENGES_PATH,
  ONGOING_CHALLENGES_PATH,
  CLOSED_CHALLENGES_PATH,
} from '../initializers/routes';

const TopNav = ({location})  => {
  console.log(location.pathname);


  return (
    <div>
    <nav className="navbar navbar-inverse navbar-fixed-top navbar-no-bg" role="navigation">
			<div className="container">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#top-navbar-1">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<a className="navbar-brand" href="/">Bootstrap Navbar Menu Template</a>
				</div>
				<div className="collapse navbar-collapse" id="top-navbar-1">
					<ul className="nav navbar-nav navbar-right">
						<li>
              <Link className={`nav-link ${location.pathname == OPEN_CHALLENGES_PATH ? "active" : ""}`} to={OPEN_CHALLENGES_PATH}>
                OPEN CHALLENGES
              </Link>
            </li>
            <li>
              <Link className={`nav-link ${location.pathname == ONGOING_CHALLENGES_PATH ? "" : ""}`} to={OPEN_CHALLENGES_PATH}>
                ONGOING
              </Link>
            </li>
            <li>
              <Link className={`nav-link ${location.pathname == CLOSED_CHALLENGES_PATH ? "" : ""}`} to={OPEN_CHALLENGES_PATH}>
                CLOSED
              </Link>
            </li>
            <li>
              <Link className={`nav-link ${location.pathname == OPEN_CHALLENGES_PATH ? "" : ""}`} to={OPEN_CHALLENGES_PATH}>
                YOURS
              </Link>
            </li>

						<li><a className="btn btn-link-3" href="#">LOGIN</a></li>
					</ul>
				</div>
			</div>
		</nav>


      </div>
  );
}



export default TopNav;
