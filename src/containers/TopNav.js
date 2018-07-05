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
import { userLogout } from '../actions';
import Avatar from 'react-avatar';
import Modal from 'react-modal';

Modal.setAppElement('.main-container');

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  }
};

class TopNav extends Component {
  renderYoursChallenges() {
    if(this.props.user){
      return(
        <li>
          <Link className={`nav-link ${this.props.location.pathname == OPEN_CHALLENGES_PATH ? "" : ""}`} to={OPEN_CHALLENGES_PATH}>
            YOURS
          </Link>
        </li>
      );
    }
  }

  renderAccountArea() {
    const { user } = this.props;

    if(user){
      return(
        <li>
          <Avatar name={user.name} src={user.avatar.uri} round="100%" size="50px"/>
        </li>
      );
    }
  }

  renderLogButton() {
    if(!this.props.user) {
      return(
        <li><a className="btn btn-link-3" onClick={() => this.props.userLogin()} href="#">LOGIN</a></li>
      );
    }
    return (
      <li><a className="btn btn-link-3" onClick={() => this.props.userLogout()} href="#">LOGOUT</a></li>
    );
  }

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
                {this.renderYoursChallenges()}
                {this.renderAccountArea()}
                {this.renderLogButton()}

    					</ul>
    				</div>
    			</div>
    		</nav>

        <ModalLogin />

        <Modal
          isOpen={true}
          contentLabel="Example Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>Soy un Modal Madafaka</h2>
        </Modal>
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
