import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentRoute } from '../actions';

class Landing extends Component {

  constuctor() {
    this.props.setCurrentRoute(this.props.path);
  }

  render() {
    return (
      <div>
      <div className="top-content">
          	<div className="container">
  				<div className="row">
  					<div className="col-sm-12 text wow fadeInLeft">
  						<h1>Chanllenge yourself and win money</h1>
  					</div>
  				</div>
              </div>
          </div>
      <div className="row">

        <div className="features-container section-container">
	        <div className="container">

	            <div className="row">
	                <div className="col-sm-12 features section-description wow fadeIn">
	                    <h2>Bootstrap Navbar Menu</h2>
	                    <div className="divider-1"><div className="line"></div></div>
	                </div>
	            </div>

	            <div className="row">
	                <div className="col-sm-6 features-box wow fadeInLeft">
	                	<div className="row">
	                		<div className="col-sm-3 features-box-icon">
	                			<i className="fa fa-twitter"></i>
	                		</div>
	                		<div className="col-sm-9">
	                			<h3>Ut wisi enim ad minim</h3>
		                    	<p>
		                    		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.
		                    		Ut wisi enim ad minim veniam, quis nostrud.
		                    	</p>
	                		</div>
	                	</div>
	                </div>
	                <div className="col-sm-6 features-box wow fadeInLeft">
	                	<div className="row">
	                		<div className="col-sm-3 features-box-icon">
	                			<i className="fa fa-instagram"></i>
	                		</div>
	                		<div className="col-sm-9">
	                			<h3>Sed do eiusmod tempor</h3>
		                    	<p>
		                    		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.
		                    		Ut wisi enim ad minim veniam, quis nostrud.
		                    	</p>
	                		</div>
	                	</div>
	                </div>
	            </div>

	            <div className="row">
	                <div className="col-sm-6 features-box wow fadeInLeft">
	                	<div className="row">
	                		<div className="col-sm-3 features-box-icon">
	                			<i className="fa fa-magic"></i>
	                		</div>
	                		<div className="col-sm-9">
	                			<h3>Quis nostrud exerci tat</h3>
		                    	<p>
		                    		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.
		                    		Ut wisi enim ad minim veniam, quis nostrud.
		                    	</p>
	                		</div>
	                	</div>
	                </div>
	                <div className="col-sm-6 features-box wow fadeInLeft">
	                	<div className="row">
	                		<div className="col-sm-3 features-box-icon">
	                			<i className="fa fa-cloud"></i>
	                		</div>
	                		<div className="col-sm-9">
	                			<h3>Minim veniam quis nostrud</h3>
		                    	<p>
		                    		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.
		                    		Ut wisi enim ad minim veniam, quis nostrud.
		                    	</p>
	                		</div>
	                	</div>
	                </div>
	            </div>

	        </div>
        </div>

      </div>
    </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setCurrentRoute }, dispatch);
}

export default connect(null, mapDispatchToProps)(Landing);
