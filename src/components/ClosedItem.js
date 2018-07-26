import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CountDownTimer from './CountDownTimer';
import { Link } from 'react-router-dom';
import {
  CHALLENGE_PATH
} from "../initializers/routes";

class ClosedItem extends Component {
  constructor(props) {
    super(props);
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
            <div className="row enrrolled"><b>{`${item.submissions}/${item.participants}`}</b> submissions</div>
            <div>Jackpot - <b>{(item.bettingPrice / 1000) * item.participants}</b> ETH</div>
            <div className="row count-down">
              Closed: <CountDownTimer date={Date.now() - item.closeTime} message={"CLOSED"} size={80} color="#000" />
               ago
            </div>
          </div>
          <div className="col-md-4">
            <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            {item.description}
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
