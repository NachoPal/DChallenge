import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNumberOfParticipants } from '../actions';
import CountDownTimer from './CountDownTimer';
import ReactCountdownClock from 'react-countdown-clock';


class OpenItem extends Component {
  constructor(props) {
    super(props);
    //this.props.fetchNumberOfParticipants(this.props.item.id);
    this.props.updateNumberOfParticipants(this.props.item.id);
  }

  componentWillUpdate(nextState) {
    //console.log(`-----------------ITEM ${nextState.id}- WILL UPDATE`);

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
            <div className="row enrrolled">
              <b>{item.participants} </b>
              participants
            </div>
              <CountDownTimer date={item.openTime} size={80} color="#000" />
            <div className="row">
              <button type="button" className="btn btn-success play">PARTICIPATE</button>
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

// function mapStateToProps({ open }) {
//   return { open };
// }

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNumberOfParticipants
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(OpenItem);
