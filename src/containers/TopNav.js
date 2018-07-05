import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  LANDING_PATH,
  OPEN_CHALLENGES_PATH,
  ONGOING_CHALLENGES_PATH,
  CLOSED_CHALLENGES_PATH,
} from '../initializers/routes';
import { userLogin } from '../actions';

class TopNav extends Component {
  render() {
    console.log(this.props.user);
    const { pathname } = this.props.location;
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
                  <Link className={`nav-link ${pathname == OPEN_CHALLENGES_PATH ? "active" : ""}`} to={OPEN_CHALLENGES_PATH}>
                    OPEN CHALLENGES
                  </Link>
                </li>
                <li>
                  <Link className={`nav-link ${pathname == ONGOING_CHALLENGES_PATH ? "active" : ""}`} to={ONGOING_CHALLENGES_PATH}>
                    ONGOING
                  </Link>
                </li>
                <li>
                  <Link className={`nav-link ${pathname == CLOSED_CHALLENGES_PATH ? "active" : ""}`} to={CLOSED_CHALLENGES_PATH}>
                    CLOSED
                  </Link>
                </li>
                <li>
                  <Link className={`nav-link ${pathname == OPEN_CHALLENGES_PATH ? "" : ""}`} to={OPEN_CHALLENGES_PATH}>
                    YOURS
                  </Link>
                </li>
    						<li><a className="btn btn-link-3" onClick={() => this.props.userLogin()} href="#">LOGIN</a></li>
    					</ul>
    				</div>
    			</div>
    		</nav>
      </div>
    );
  }
}

function mapStateToProps({user}) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userLogin }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
