import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { participate } from '../actions';
import ModalParticipate from '../components/ModalParticipate';
import CountDownTimer from './CountDownTimer';
import {
  YOUR_CHALLENGES_PATH
} from "../initializers/routes";
const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';


class OpenView extends Component {
  constructor(props) {
    super(props);
    this.state = { modalParticipateIsOpen: false };
    this.participate = this.participate.bind(this);
  }

  participate() {
    if(!this.props.user.logged) {
      this.openModalParticipate();
    } else {
      this.props.participate(
        this.props.challenge.id,
        this.props.user.details.address,
        this.props.challenge.bettingPrice,
        () => this.props.history.push(YOUR_CHALLENGES_PATH)
      );
    }
  }

  openModalParticipate() {
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
    const { challenge } = this.props;
    return(
        <div className={"content container"}>
          <div className="row">
            <h2 className="challenge-title">{challenge.title}</h2>
          </div>
          <div className="row">
            <div className="col-md-4 even">
              <div className="row">
                <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
              </div>
              <div className="row">
                <h3 className="border-title">OPEN</h3>
              </div>
              <div className="row enrrolled">
                <b>{challenge.participants} </b>
                participants
              </div>
              <div>Entry fee - <b>{challenge.bettingPrice / 1000}</b> ETH</div>
              <div>Jackpot - <b>{(challenge.bettingPrice / 1000) * challenge.participants}</b> ETH</div>
              <CountDownTimer date={challenge.openTime} message={"ONGOING"} size={80} color="#000" />
              {this.renderParticipateButton(challenge.id)}
            </div>
            <div className="col-md-8">
              {challenge.description}
            </div>
          </div>
          <ModalParticipate isOpen={this.state.modalParticipateIsOpen} this={this} />
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
