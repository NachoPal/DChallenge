import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNumberOfSubmissions } from '../actions';
import CountDownTimer from './CountDownTimer';


class OngoingItem extends Component {
  constructor(props) {
    super(props);
    //this.props.updateNumberOfParticipants(this.props.item.id);
  }

  render() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    const { item } = this.props;
    console.log(`-----------------ITEM ${item.id}-RE REDENRIZA`);
    return(
      <div className="row panel panel-primary open-challenge">
        <div className="panel-heading">{item.title}</div>
        <div className="panel-body">
          <div className="col-md-2 even">
            <div className="row enrrolled"><b>{`${item.submissions}/${item.participants}`}</b> submissions</div>
            <div className="row count-down">
              <CountDownTimer date={item.closeTime} message={"CLOSED"} size={80} color="#000" />
            </div>
            <div className="row">
              <button type="button" className="btn btn-success play">SEE MORE</button>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNumberOfSubmissions
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(OngoingItem);
