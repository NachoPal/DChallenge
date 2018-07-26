import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  LANDING_PATH,
  OPEN_CHALLENGES_PATH,
  ONGOING_CHALLENGES_PATH,
  CLOSED_CHALLENGES_PATH,
  YOUR_CHALLENGES_PATH
} from '../initializers/routes';
import { userLogin } from '../actions';
import { userLogout } from '../actions';
import ModalLogin from '../components/ModalLogin';
import AccountArea from '../containers/AccountArea';

class TopNav extends Component {
  constructor(props) {
		super(props); //Hereda del state de Componente
    if(sessionStorage.getItem('user')) {
      const sessionUser = JSON.parse(sessionStorage.getItem('user'));
      this.props.user.details = sessionUser.details;
      this.props.user.logged = sessionUser.logged;
      this.props.user.submissions = sessionUser.submissions;
      this.props.user.participating = sessionUser.participating;
    }
		this.state = { clicked: false };
	}

  renderYoursChallenges() {
    if(this.props.user.details){
      return(
        <li className="yours">
          <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
          <Link className={`nav-link ${this.props.location.pathname == YOUR_CHALLENGES_PATH ? "active" : ""} yours` } to={YOUR_CHALLENGES_PATH}>
            YOURS
          </Link>
        </li>
      );
    }
  }

  renderAccountArea() {
    const { user } = this.props;
    if(user.details){
      return(
        <AccountArea />
      );
    }
  }

  renderLogButton() {
    if(!this.props.user.details) {
      return(
        <li><a className="btn btn-link-3" onClick={this.onClickHandlerIn.bind(this)} href="#">LOGIN</a></li>
      );
    }
    return (
      <li><a className="btn btn-link-3" onClick={this.onClickHandlerOut.bind(this)} href="#">LOGOUT</a></li>
    );
  }

  onClickHandlerIn() {
    if(this.props.user.logged == true) {
      this.setState({clicked: true});
    }
    this.props.userLogin();
  }

  onClickHandlerOut() {
    this.setState({clicked: false});
    console.log("LOG OUT",this.props)
    this.props.userLogout(
      this.props.location.pathname,
      () => this.props.history.push(OPEN_CHALLENGES_PATH)
    );
  }

  render() {
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
                {this.renderYoursChallenges()}
                {this.renderAccountArea()}
                {this.renderLogButton()}
    					</ul>
    				</div>
    			</div>
    		</nav>
        <ModalLogin user={this.props.user} clicked={this.state.clicked}/>
      </div>
    );
  }
}

function mapStateToProps({user}) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userLogin, userLogout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
