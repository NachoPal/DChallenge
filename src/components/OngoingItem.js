import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNumberOfSubmissions } from '../actions';
import CountDownTimer from './CountDownTimer';
import ModalSubmit from '../components/ModalSubmit';
import { Link } from 'react-router-dom';
import {
  CHALLENGE_PATH
} from "../initializers/routes";
import { URL_IPFS } from '../initializers/ipfs';


class OngoingItem extends Component {
  constructor(props) {
    super(props);
    this.state = { modalSubmitIsOpen: false };
    this.state = { submitButtonVisible: true };
    this.submit = this.submit.bind(this);
    this.onCompleteTimer = this.onCompleteTimer.bind(this);
    this.props.updateNumberOfSubmissions(this.props.item.id);
  }

  submit() {
    this.openModal();
  }

  onCompleteTimer() {
    this.setState({submitButtonVisible: false});
  }

  openModal() {
    this.setState({modalSubmitIsOpen: true});
  }

  renderSubmitButton(challengeId) {
    const userHasParticipated = _.includes(this.props.user.participating, challengeId);
    const userHasSubmitted = _.includes(this.props.user.submissions, challengeId);

    if(this.state.submitButtonVisible == true) {
      if(userHasParticipated && !userHasSubmitted) {
          return(
            <div className="row">
              <button type="button" className="btn btn-success play" onClick={this.submit}>SUBMIT</button>
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
            <div className="row enrrolled"><b>{`${item.submissions}/${item.participants}`}</b> submissions</div>
            <div>Jackpot - <b>{(item.bettingPrice / Math.pow(10,18)) * item.participants}</b> ETH</div>
            <div className="row count-down">
              <CountDownTimer
                date={item.closeTime}
                onComplete={() => this.onCompleteTimer()}
                size={80}
                color="#000"
              />
            </div>
            {this.renderSubmitButton(item.id)}
          </div>
          <div className="col-md-4">
            <img src={`${URL_IPFS}${item.thumbnail}`} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            <iframe src={`${URL_IPFS}${item.summary}`}></iframe>
          </div>
        </div>
        <ModalSubmit
          isOpen={this.state.modalSubmitIsOpen}
          this={this}
          history={this.props.history}
          from="item"/>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNumberOfSubmissions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OngoingItem);
