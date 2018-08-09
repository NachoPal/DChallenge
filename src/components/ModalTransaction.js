import React from 'react';
import Modal from 'react-modal';
import Loading from 'react-loading-components';

Modal.setAppElement('.main-container');

const ModalLogin = props => {
  return(
    <Modal
      isOpen={props.user.logged && !props.user.details && props.clicked}
      onRequestClose={(props) => {props.user.logged && !props.user.details}}
      contentLabel="Login"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div>
        <h3>Check your Uport App to accept the Login</h3>
        <Loading type='rings' width={250} height={250} fill='#df6482' />
      </div>
    </Modal>
  );
}

export default ModalLogin;
