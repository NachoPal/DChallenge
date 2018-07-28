import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  CHALLENGE_PATH
} from "../initializers/routes";
import { URL_IPFS } from "../initializers/ipfs";


class ClosedItem extends Component {
  constructor(props) {
    super(props);
  }

  renderVideoOrThumbnail() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    const { item } = this.props;

    if(item.winner == true) {
      return(
        <div className="col-md-4">
          <video controls src={`https://gateway.ipfs.io/ipfs/${item.winnerVideo.ipfsHash}`}>
            <p>Your browser does not support playing video. Update your browser to watch this video.</p>
          </video>
      </div>
      );
    } else {
      return(
        <div className="col-md-4">
          <img src={`${URL_IPFS}${item.thumbnail}`} className="img-responsive" alt="Challenge thumbnail" />
        </div>
      );
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
          </div>
          {this.renderVideoOrThumbnail()}
          <div className="col-md-6">
            <iframe src={`${URL_IPFS}${item.summary}`}></iframe>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}


export default connect(mapStateToProps)(ClosedItem);
