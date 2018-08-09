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
import { URL_IPFS } from '../initializers/ipfs';


class OpenItem extends Component {
  constructor(props) {
    super(props);
    this.props.updateNumberOfParticipants(this.props.item.id);
    this.state = { modalParticipateIsOpen: false };
    this.state = { participateButtonVisible: true };
    this.participate = this.participate.bind(this);
    this.onCompleteTimer = this.onCompleteTimer.bind(this);
  }

  participate() {
    if(!this.props.user.logged) {
      this.openModal();
    } else {
      this.props.participate(
        this.props.item.id,
        this.props.user.details.address,
        this.props.item.bettingPrice,
        () => this.props.history.push(YOUR_CHALLENGES_PATH)
      );
    }
  }

  openModal() {
    this.setState({modalParticipateIsOpen: true});
  }

  onCompleteTimer() {
    this.setState({participateButtonVisible: false});
  }

  renderParticipateButton(challengeId) {

    if(this.state.participateButtonVisible == true) {
      if(!_.includes(this.props.user.participating, challengeId)) {
        return(
          <div className="row">
            <button type="button" onClick={this.participate} className="btn btn-success play">PARTICIPATE</button>
          </div>
        );
      }
    }
  }

  render() {
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
            <CountDownTimer
              date={item.openTime}
              onComplete={() => this.onCompleteTimer()}
              size={80}
              color="#000"
            />
            {this.renderParticipateButton(item.id)}
          </div>
          <div className="col-md-4">
              <img src={`${URL_IPFS}${item.thumbnail}`} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            <iframe src={`${URL_IPFS}${item.summary}`}></iframe>
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
