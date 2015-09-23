'use strict';

var React = require('react-native');

var MainView = require('./views/main')
var ProfileView = require('./views/profile');

var {
  AppRegistry,
  Navigator
} = React;

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var BaseConfig = Navigator.SceneConfigs.FloatFromRight;

var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 8,
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: SCREEN_WIDTH,
});

var CustomSceneConfig = Object.assign({}, BaseConfig, {
	// A very tighly wound spring will make this transition fast
	springTension: 100,
	springFriction: 1,
	// Use our custom gesture defined above
	gestures: {
		//pop: CustomLeftToRightGesture,
	}
});

var listmo = React.createClass({
	renderScene: function (route,nav) {
		var next;
		switch(route.id) {
			case "profile":
				next = <ProfileView.view nav={nav}/>
			break;
			default: 
				next = <MainView.view nav={nav}/>
			break;
		}
		return next;
	},
	configureScene: function(){
		return CustomSceneConfig;
	},
	render: function() {
		return (
			<Navigator
				initialRoute={{
					name: 'Login Screen'
				}}
				renderScene={this.renderScene}
				configureScene={this.configureScene}/>
		);
	}
});

AppRegistry.registerComponent('listmo', () => listmo);
