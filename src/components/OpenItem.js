import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateNumberOfParticipants,
  participate
} from '../actions';
import CountDownTimer from './CountDownTimer';
import { Link } from 'react-router-dom';
import ModalParticipate from '../components/ModalParticipate';
import {
  YOUR_CHALLENGES_PATH,
  CHALLENGE_PATH
} from "../initializers/routes";


class OpenItem extends Component {
  constructor(props) {
    super(props);
    this.props.updateNumberOfParticipants(this.props.item.id);
    this.state = { modalParticipateIsOpen: false };
    this.participate = this.participate.bind(this);
    //this.renderParticipateButton = this.renderParticipateButton.bind(this);
  }

  participate() {
    if(!this.props.user.logged) {
      this.openModal();
    } else {
      this.props.participate(
        this.props.item.id,
        this.props.user.details.address,
        this.props.item.bettingPrice,
        //"2orFcEzp7tndZ1rdzxSMuHG6msqPsjziMNS",
        () => this.props.history.push(YOUR_CHALLENGES_PATH)
      );
    }
  }

  openModal() {
    this.setState({modalParticipateIsOpen: true});
  }

  renderParticipateButton(challengeId) {
    if(!_.includes(this.props.user.participating, challengeId)) {
      return(
        <div className="row">
          <button type="button" onClick={this.participate} className="btn btn-success play">PARTICIPATE</button>
        </div>
      );
    }
  }

  render() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    const { item } = this.props;
    return(
      <div className="row panel panel-primary open-challenge">
        <Link className="title-link" to={`${CHALLENGE_PATH}/${item.id}`}>
          <div className="panel-heading">{item.title}</div>
        </Link>
        <div className="panel-body">
          <div className="col-md-2 even">
            <div className="row enrrolled">
              <b>{item.participants} </b>
              participants
            </div>
            <div>Entry fee - <b>{item.bettingPrice / Math.pow(10,18)}</b> ETH</div>
            <div>Jackpot - <b>{(item.bettingPrice / Math.pow(10,18)) * item.participants}</b> ETH</div>
            <CountDownTimer date={item.openTime} message={"ONGOING"} size={80} color="#000" />
            {this.renderParticipateButton(item.id)}
          </div>
          <div className="col-md-4">
              <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            {item.description}
          </div>
      </div>
      <ModalParticipate isOpen={this.state.modalParticipateIsOpen} this={this} />
    </div>
    );
  }
}

function mapStateToProps({ user }) {
  return {user};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNumberOfParticipants,
    participate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenItem);
