import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOpenChallenges, updateOpenChallenges } from '../actions';
import _ from 'lodash';
import web3 from './../initializers/web3';

import Open from '../components/Open';

class OpenChallenges extends Component {

  constructor(props) {
    super(props);
    console.log("Se monta OPEN");
    if(!this.props.open) {
      this.props.fetchOpenChallenges();
      this.props.updateOpenChallenges();
    }
  }

  renderOpenChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    if(this.props.open) {
      console.log("RENDER", this.props.open)
      return _.map(this.props.open, (value, key) => {
        console.log(value.openTime - (Date.now()/1000));
        return(
          <Open
            key={value.id}
            title={value.title}
            description={value.description}
            img= {`${URL_BASE}token-640x300.jpg`}//{value.img}
            enrolled={23} //{value.enrolled}
            time={value.openTime - (Date.now()/1000)}
          />
        );
      });
    }
  }

  render() {
    return (
      <div className="content container">
        <div className="row">
          {this.renderOpenChallenges()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({open}) {
  return {open}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenChallenges,
    updateOpenChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenChallenges);
