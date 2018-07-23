import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOpenChallenges, updateOpenChallenges } from '../actions';
import _ from 'lodash';
import Loading from 'react-loading-components';
import OpenItem from '../components/OpenItem';

class OpenChallenges extends Component {

  constructor(props) {
    super(props);
    this.props.fetchOpenChallenges();
    this.props.updateOpenChallenges();
  }

  renderOpenChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    return _.map(this.props.open, (value, key) => {
      return(
        <OpenItem
          key={value.transactionHash}
          item={value}
          img= {`${URL_BASE}token-640x300.jpg`}
          history={this.props.history}
          yours={false}
        />
      );
    });
  }

  render() {
    if(!_.isEmpty(this.props.ongoing)) {
      return (
        <div className={"content container"}>
          <div className="row">
            {this.renderOpenChallenges()}
          </div>
        </div>
      );
    } else {
      return(
        <div className={"content container"}>
          <div className="row" style={{marginTop: "200px"}}>
            <Loading type='bars' width={150} height={150} fill='#df6482' />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps({ open }) {
  return { open };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenChallenges,
    updateOpenChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenChallenges);
