import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVideos } from '../actions';
import ModalSubmit from '../components/ModalSubmit';
import CountDownTimer from './CountDownTimer';
import Video from '../components/Video';
const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';


class OngoingView extends Component {
  constructor(props) {
    super(props);
    this.state = { modalSubmitIsOpen: false };
    this.submit = this.submit.bind(this);
    this.props.fetchVideos(this.props.challenge.id);
  }

  submit() {
    this.openModalSubmit();
  }

  openModalSubmit() {
    this.setState({modalSubmitIsOpen: true});
  }

  renderSubmitButton(challengeId) {
    const userHasParticipated = _.includes(this.props.user.participating, challengeId);
    const userHasSubmitted = _.includes(this.props.user.submissions,challengeId);

    if(userHasParticipated && !userHasSubmitted) {
        return(
          <div className="row">
            <button type="button" className="btn btn-success play" onClick={this.submit}>SUBMIT</button>
          </div>
        );
    }
  }

  renderVideos() {
    if(!_.isEmpty(this.props.videos)) {
      return _.map(this.props.videos, (video) => {
        return(
          <Video video={video} key={video.code} winner={false}/>
        );
      });
    }
  }

  render() {
    const { challenge } = this.props;
    return(
        <div className={"container content"}>
          <div className="row">
            <h2 className="challenge-title">{challenge.title}</h2>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="row">
                <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
              </div>
              <div className="row">
                <h3 className="border-title">ONGOING</h3>
              </div>
              <div className="row enrrolled">
                <b>{`${challenge.submissions}/${challenge.participants}`}</b> submissions
              </div>
              <div className="row">Jackpot - <b>{(challenge.bettingPrice / Math.pow(10,18)) * challenge.participants}</b> ETH</div>
              <CountDownTimer date={challenge.closeTime} message={"ONGOING"} size={80} color="#000" />
              {this.renderSubmitButton(challenge.id)}
            </div>
            <div className="col-md-8">
              {challenge.description}
            </div>
          </div>

          <div className="row">
            <h3 className="border-title">VIDEOS</h3>
            {this.renderVideos()}
          </div>
          <ModalSubmit
            isOpen={this.state.modalSubmitIsOpen}
            this={this}
            history={this.props.history}
            from="view"
          />
        </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchVideos
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OngoingView);
