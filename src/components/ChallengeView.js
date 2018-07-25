import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchChallenge, removeChallengeData } from '../actions';
import {
  YOUR_CHALLENGES_PATH
} from "../initializers/routes";
import CountDownTimer from './CountDownTimer';
import ModalParticipate from '../components/ModalParticipate';
//import ModalSubmit from '../components/ModalSubmit';
import Loading from 'react-loading-components';
import OpenView from '../components/OpenView';
import OngoingView from '../components/OngoingView';
const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';


class ChallengeView extends Component {
  constructor(props) {
    console.log("CONSTRUCTOR DE CHALLENGEVIEW")
    super(props);
    this.props.fetchChallenge(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.removeChallengeData();
  }

  renderChallenge() {
    const { challenge } = this.props;

    if(challenge.details.status == "open") {
      return(
        <OpenView
          challenge={challenge.details}
          history={this.props.history}
        />
      );
    } else if(challenge.details.status == "ongoing") {
      return(
        <OngoingView
          challenge={challenge.details}
          videos={challenge.videos}
          history={this.props.history}
        />
      );
    } else if(challenge.details.status == "closed") {

    }
  }

  render() {
    console.log(this.props);
    if(!_.isEmpty(this.props.challenge.details)){
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
    removeChallengeData
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeView);
