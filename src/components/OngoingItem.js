import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNumberOfSubmissions } from '../actions';
import CountDownTimer from './CountDownTimer';
import ModalSubmit from '../components/ModalSubmit';


class OngoingItem extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.submit = this.submit.bind(this);
    //this.renderActionButton = this.renderActionButton.bind(this);
    //this.props.updateNumberOfParticipants(this.props.item.id);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  submit() {
    this.openModal();
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }


  renderActionButton() {
    if(this.props.yours == false) {
      return(
        <div className="row">
          <button type="button" className="btn btn-success play">SEE MORE</button>
        </div>
      );
    } else if(this.props.yours == true) {
        return(
          <div className="row">
            <button type="button" className="btn btn-success play" onClick={this.submit}>SUBMIT</button>
          </div>
        );
    }
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
            <div>Jackpot - <b>{(item.bettingPrice / 1000) * item.participants}</b> ETH</div>
            <div className="row count-down">
              <CountDownTimer date={item.closeTime} message={"CLOSED"} size={80} color="#000" />
            </div>
            {this.renderActionButton()}
          </div>
          <div className="col-md-4">
            <img src={`${URL_BASE}token-640x300.jpg`} className="img-responsive" alt="Challenge thumbnail" />
          </div>
          <div className="col-md-6">
            {item.description}
          </div>
        </div>
        <ModalSubmit isOpen={this.state.modalIsOpen} this={this} />
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
