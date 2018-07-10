import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOpenChallenges, updateOpenChallenges } from '../actions';
import _ from 'lodash';

import Open from '../components/Open';

class OpenChallenges extends Component {

  constructor(props) {
    super(props);
    console.log("Se monta OPEN");
    if(!this.props.open) this.props.fetchOpenChallenges();
  }

  renderOpenChallenges() {
    if(this.props.open) {
      return _.forOwn(this.props.open, (value, key) => {
        return(
          <Open
            key={value.id.toString()}
            title={value.title}
            description={open.description}
            img={open.img}
            enrolled={open.enrolled}
            time={open.time}
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
