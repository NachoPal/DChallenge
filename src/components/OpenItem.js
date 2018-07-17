import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateNumberOfParticipants,
  participate
} from '../actions';
import CountDownTimer from './CountDownTimer';
import ModalParticipate from '../components/ModalParticipate';
import web3meta from "../initializers/web3_metamask";
import { YOUR_CHALLENGES_PATH } from "../initializers/routes";


class OpenItem extends Component {
  constructor(props) {
    super(props);
    this.props.updateNumberOfParticipants(this.props.item.id);
    this.state = { modalIsOpen: false };
    this.participate = this.participate.bind(this);
  }

  participate() {
    if(!this.props.user.logged) {
      this.openModal();
    } else {
      this.props.participate(
        this.props.item.id,
        this.props.user.details.address,
        //"2orFcEzp7tndZ1rdzxSMuHG6msqPsjziMNS",
        () => this.props.history.push(YOUR_CHALLENGES_PATH)
      );
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  render() {
    console.log(this.props);
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
              <CountDownTimer date={item.openTime} message={"ONGOING"} size={80} color="#000" />
            <div className="row">
              <button type="button" onClick={this.participate} className="btn btn-success play">PARTICIPATE</button>
            </div>
          </div>
          <div className="col-md-4">
              <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            {item.description}
          </div>
      </div>
      <ModalParticipate isOpen={this.state.modalIsOpen} this={this} />
    </div>
    );
  }
}

function mapStateToProps({ user }) {
  return {user};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNumberOfParticipants,
    participate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenItem);
