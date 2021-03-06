import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVideos, updateWinnerVideo } from '../actions';
import Video from '../components/Video';
import Loading from 'react-loading-components';
import { URL_IPFS } from '../initializers/ipfs';


class ClosedView extends Component {
  constructor(props) {
    super(props);
    this.props.fetchVideos(this.props.challenge.id);
    this.props.updateWinnerVideo(this.props.challenge.id);
  }

  renderWinnerVideo() {
    if(this.props.challenge.submissions > 0) {
      if(this.props.challenge.winnerVideo) {
        const video = this.props.challenge.winnerVideo;
        return(
          <Video video={video} key={video.code} winner={true}/>
        );
      } else {
        return(
          <div className="row">
            <div className="col-md-4">
              <h3>Choosing the winner...</h3>
            </div>
            <div className="col-md-3">
              <div className="row" id="video-submit-loader">
                <Loading type='oval' width={50} height={50} style={{marginTop: 10}} fill='#000'/>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  renderVideos() {
    const { winnerAddress } = this.props.challenge;
    delete this.props.videos[winnerAddress];

    if(!_.isEmpty(this.props.videos)) {
      return _.map(this.props.videos, (video) => {
        if(video.userAddress != this.props.challenge)
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
                <img src={`${URL_IPFS}${challenge.thumbnail}`} className="img-responsive" alt="Challenge thumbnail" />
              </div>
              <div className="row">
                <h3 className="border-title">CLOSED</h3>
              </div>
              <div className="row enrrolled">
                <b>{`${challenge.submissions}/${challenge.participants}`}</b> submissions
              </div>
              <div className="row">Jackpot - <b>{(challenge.bettingPrice / Math.pow(10,18)) * challenge.participants}</b> ETH</div>
            </div>
            <div className="col-md-8">
              <iframe id="description" src={`${URL_IPFS}${challenge.description}`}></iframe>
            </div>
          </div>

          <div className="row video-challenge">
            <h3 className="border-title">VIDEOS</h3>
            {this.renderWinnerVideo()}
            {this.renderVideos()}
          </div>
        </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchVideos,
    updateWinnerVideo
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosedView);
