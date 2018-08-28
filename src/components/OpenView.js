import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { participate } from '../actions';
import ModalParticipate from '../components/ModalParticipate';
import ModalPendingTx from '../components/ModalPendingTx';
import CountDownTimer from './CountDownTimer';
import {
  YOUR_CHALLENGES_PATH
} from "../initializers/routes";
import { URL_IPFS } from '../initializers/ipfs';


class OpenView extends Component {
  constructor(props) {
    super(props);
    this.state = { modalParticipateIsOpen: false };
    this.state = {...this.state, participateButtonVisible: true };
    this.state = {...this.state, modalPendingTx: false};
    this.participate = this.participate.bind(this);
    this.onCompleteTimer = this.onCompleteTimer.bind(this);
  }

  participate() {
    if(!this.props.user.logged) {
      this.openModalParticipate();
    } else {
      this.props.participate(
        this.props.challenge.id,
        this.props.user.details.networkAddress,
        this.props.challenge.bettingPrice,
        () => this.props.history.push(YOUR_CHALLENGES_PATH),
        (open, txHash) => {
          this.setState({pendingTxHash: txHash, modalPendingTx: open});
          //this.setState({pendingTxHash: txHash});
          //this.setState({modalPendingTx: open});
        }
      );
    }
  }

  openModalParticipate() {
    this.setState({modalParticipateIsOpen: true});
  }

  onCompleteTimer() {
    this.setState({participateButtonVisible: false});
    setTimeout(() => {
      location.reload();
    }, 2000)
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

  renderPendingTxModal() {
    if(this.state.modalPendingTx == true) {
      return(
        <ModalPendingTx
          open={this.state.modalPendingTx}
          txHash={this.state.pendingTxHash}
        />
      );
    }
  }

  render() {
    const { challenge } = this.props;
    return(
        <div className={"content container"}>
          <div className="row">
            <h2 className="challenge-title">{challenge.title}</h2>
          </div>
          <div className="row">
            <div className="col-md-4 even">
              <div className="row">
                <img src={`${URL_IPFS}${challenge.thumbnail}`} className="img-responsive" alt="Challenge thumbnail" />
              </div>
              <div className="row">
                <h3 className="border-title">OPEN</h3>
              </div>
              <div className="row enrrolled">
                <b>{challenge.participants} </b>
                participants
              </div>
              <div>Entry fee - <b>{challenge.bettingPrice / Math.pow(10,18)}</b> ETH</div>
              <div>Jackpot - <b>{(challenge.bettingPrice / Math.pow(10,18)) * challenge.participants}</b> ETH</div>
              <CountDownTimer
                date={challenge.openTime}
                onComplete={() => this.onCompleteTimer()}
                size={80}
                color="#000"
              />
              {this.renderParticipateButton(challenge.id)}
            </div>
            <div className="col-md-8">
              <iframe id="description" src={`${URL_IPFS}${challenge.description}`}></iframe>
            </div>
          </div>
          <ModalParticipate isOpen={this.state.modalParticipateIsOpen} this={this} />
          {this.renderPendingTxModal()}
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    participate
  }, dispatch);
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenView);
