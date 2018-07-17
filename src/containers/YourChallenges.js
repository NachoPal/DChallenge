import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OngoingChallenges from './OngoingChallenges';
import YourOpenChallenges from './YourOpenChallenges';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class YourChallenges extends React.Component {
  state = {
    value: "open",
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className="content">
        {/* <Paper className={classes.root}> */}
        <Paper>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab value="open" label="Open" />
            <Tab value="ongoing" label="Ongoing" />
            <Tab value="closed" label="Closed" />

          </Tabs>
        </Paper>
        <div className="container">
          {value === 'open' && <YourOpenChallenges user={this.props.user}/>}
          {value === 'ongoing' && <YourOpenChallenges user={this.props.user}/>}
          {value === 'closed' && <YourOpenChallenges user={this.props.user}/>}
          {/* {value === 'ongoing' && <YourOngoingChallenges user={this.props.user}/>} */}
          {/*value === 'closed' && <YourOpenChallenges applyClass="yours"/>*/}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(YourChallenges);
