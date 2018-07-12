import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchNumberOfParticipants,
  updateNumberOfParticipants
} from '../actions';
import CountDownTimer from './CountDownTimer';
import ReactCountdownClock from 'react-countdown-clock';


class OpenItem extends Component {
  constructor(props) {
    super(props);
    this.props.fetchNumberOfParticipants(this.props.id);
    this.props.updateNumberOfParticipants(this.props.id);
  }

  componentWillUpdate(nextState) {
    //console.log(`-----------------ITEM ${nextState.id}- WILL UPDATE`);

  }

  shouldComponentUpdate(nextProps) {
    console.log(this.props);

    const id = this.props.id;
    if(id == nextProps.openItem.idToUpdate) {
        return true;
    } else {
      return false;
    }
  }

  renderParticipants(id) {
    console.log(this.props.openItem);
    if(this.props.openItem.items) {
      return this.props.openItem.items[id].number;
    }else {
      return 0;
    }
  }

  render() {
    console.log(`-----------------ITEM ${this.props.id}-RE REDENRIZA`);
    return(
      <div className="row panel panel-primary open-challenge">
        <div className="panel-heading">{this.props.title}</div>
        <div className="panel-body">
          <div className="col-md-2 even">
            <div className="row enrrolled">
              <b>{this.renderParticipants(this.props.id)} </b>
              participants
            </div>
              <CountDownTimer seconds={this.props.time} size={80} color="#000" />
            <div className="row">
              <button type="button" className="btn btn-success play">PARTICIPATE</button>
            </div>
          </div>
          <div className="col-md-4">
              <img src={this.props.img} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            {this.props.description}
          </div>
      </div>
    </div>
    );
  }
}

function mapStateToProps({ openItem }) {
  return { openItem };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchNumberOfParticipants,
    updateNumberOfParticipants
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenItem);
