import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserBalance, withdrawBalance } from '../actions';
import { userAddressTo32Bytes } from '../helpers/helper_web3';
import Avatar from 'react-avatar';
var mnid = require('mnid');

class Account extends Component {
  constructor(props) {
    super(props);
    this.props.fetchUserBalance(this.props.user.details.address);
    this.withdraw = this.withdraw.bind(this);
  }

  withdraw() {
    const { user } = this.props;
    this.props.withdrawBalance(user.details.address, user.balance);
  }

  renderWithdrawButton() {
    if(this.props.user.balance > 0) {
      return(
        <button type="button" className="btn btn-success play" onClick={this.withdraw}>WITHDRAW</button>
      );
    }
  }

  render() {
    const { details } = this.props.user;
    return(
      <div className="container content">
        <h3 className="border-title">ACCOUNT</h3>
        <div className="row">
          <div className="col-md-4">
            <Avatar
              name={details.name}
              src={details.avatar ? details.avatar.uri : null}
              size="200px"
            />
          </div>
          <div className="col-md-8">
            <table>
              <tbody>
                <tr>
                  <td><b>Name: </b></td>
                  <td>{details.name}</td>
                </tr>
                <tr>
                  <td><b>Country:  </b></td>
                  <td>{details.country}</td>
                </tr>
                <tr>
                  <td><b>Email:  </b></td>
                  <td>{details.email}</td>
                </tr>
                <tr>
                  <td><b>uPort address:  </b></td>
                  <td>{details.address}</td>
                </tr>
                <tr>
                  <td><b>Ethereum address: </b></td>
                  <td>{  mnid.decode(details.address).address}</td>
                </tr>
                <tr>
                  <td><b>Balance:  </b></td>
                  <td>
                    {this.props.user.balance / Math.pow(10,18)} ETH
                    {this.renderWithdrawButton()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUserBalance, withdrawBalance }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
