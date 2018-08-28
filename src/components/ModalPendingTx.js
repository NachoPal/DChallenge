import React, { Component } from 'react';
import Modal from 'react-modal';
import Loading from 'react-loading-components';

Modal.setAppElement('.main-container');

class ModalPendingTx extends Component {
  render() {
    return(
      <Modal
        isOpen={this.props.open}
        //onRequestClose={(props) => {props.user.logged && !props.user.details}}
        contentLabel="Pending Transaction"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div>
          <h3>Waiting for Transaction confirmation</h3>
          <p>
            You can follow the Tx status in
            <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${this.props.txHash}`}> Etherscan</a>
          </p>
          <Loading type='rings' width={250} height={250} fill='#df6482' />
        </div>
      </Modal>
    );
  }

}

export default ModalPendingTx;
