import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOpenChallenges, updateOpenChallenges } from '../actions';
import _ from 'lodash';
import web3 from './../initializers/web3';

import OpenItem from '../components/OpenItem';

class OpenChallenges extends Component {

  constructor(props) {
    super(props);
    console.log("-----------------OPEN - CONSTRUCTOR");
    //if(!this.props.open) {
      this.props.fetchOpenChallenges();
      this.props.updateOpenChallenges();
    //}
  }

  componentWillUpdate(nextState) {
    console.log("-----------------OPEN - WILL UPDATE");
    console.log("OPEN PROPS", this.props);
    console.log("OPEN PROPS NEW", nextState);

  }

  renderOpenChallenges() {

    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    if(this.props.open) {
      return _.map(this.props.open, (value, key) => {
        return(
          <OpenItem
            key={value.transactionHash}
            id={value.id}
            item={value}
            //title={value.title}
            //description={value.description}
            img= {`${URL_BASE}token-640x300.jpg`}//{value.img}
            //time={value.openTime - (Date.now()/1000)}
          />
        );
      });
    }
  }

  render() {
    console.log("ME RE-RENDERIZO CHALLENGES");
    return (
      <div className="content container">
        <div className="row">
          {this.renderOpenChallenges()}
        </div>
      </div>
    );
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
