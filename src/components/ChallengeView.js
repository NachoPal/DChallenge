import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchChallenge, participate } from '../actions';
import {
  YOUR_CHALLENGES_PATH
} from "../initializers/routes";
import CountDownTimer from './CountDownTimer';
import ModalParticipate from '../components/ModalParticipate';
import Loading from 'react-loading-components';
const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';

class ChallengeView extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.props.fetchChallenge(this.props.match.params.id);
    this.participate = this.participate.bind(this);
  }

  participate() {
    if(!this.props.user.logged) {
      this.openModal();
    } else {
      this.props.participate(
        this.props.challenge.id,
        this.props.user.details.address,
        () => this.props.history.push(YOUR_CHALLENGES_PATH)
      );
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  renderChallenge() {
    const { challenge } = this.props;

    if(challenge.status == "open") {
      return this.renderOpenChallenge(challenge);
    } else if(challenge.status == "ongoing") {
      return this.renderOngoingChallenge(challenge);
    } else if(challenge.status == "closed")
      return this.renderOngoingChallenge(challenge);
  }

  renderOngoingChallenge(challenge) {
    return(
        <div className={"content container"}>
          <div className="row">
            <h2>{challenge.title}</h2>
          </div>
          <div className="row">
            <div className="col-md-4 even">
              <div className="row">
                <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
              </div>
              <div className="row enrrolled">
                <b>{`${challenge.submissions}/${challenge.participants}`}</b> submissions
              </div>
              <div>Jackpot - <b>{(challenge.bettingPrice / 1000) * challenge.participants}</b> ETH</div>
              <CountDownTimer date={challenge.closeTime} message={"ONGOING"} size={80} color="#000" />
            </div>
            <div className="col-md-8">
              {challenge.description}
            </div>
          </div>
          <ModalParticipate isOpen={this.state.modalIsOpen} this={this} />
        </div>
    );
  }

  renderOpenChallenge(challenge) {
    return(
        <div className={"content container"}>
          <div className="row">
            <h2>{challenge.title}</h2>
          </div>
          <div className="row">
            <div className="col-md-4 even">
              <div className="row">
                <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
              </div>
              <div className="row enrrolled">
                <b>{challenge.participants} </b>
                participants
              </div>
              <div>Entry fee - <b>{challenge.bettingPrice / 1000}</b> ETH</div>
              <div>Jackpot - <b>{(challenge.bettingPrice / 1000) * challenge.participants}</b> ETH</div>
              <CountDownTimer date={challenge.openTime} message={"ONGOING"} size={80} color="#000" />
              <div className="row">
                <button type="button" onClick={this.participate} className="btn btn-success play">PARTICIPATE</button>
              </div>
            </div>
            <div className="col-md-8">
              {challenge.description}
            </div>
          </div>
          <ModalParticipate isOpen={this.state.modalIsOpen} this={this} />
        </div>
    );
  }

  render() {
    console.log(this.props);
    if(this.props.challenge){
      return this.renderChallenge();
    } else {
      return(
        <div className={"content container"}>
          <div className="row" style={{marginTop: "200px"}}>
            <Loading type='bars' width={150} height={150} fill='#df6482' />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps({ challenge, user }) {
  return { challenge, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchChallenge,
    participate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeView);
