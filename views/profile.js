var React = require('react-native');

var {
  Text,
  View,
  TouchableHighlight
} = React;

var styles = require('../styles/main.js').styles;
var { Icon, } = require('react-native-icons');

var ProfileView = React.createClass({
	getInitialState: function(){
		return {
			profile:{
				name: 'Pepe Billete',
				phone: '3052838527',
				is_activated: true
			}
		};
	},
	render: function() {
		return (
	        <View style={styles.container}>
	            <Text style={styles.welcome}>
	                YOUR PROFILE
	            </Text>
	            <Icon name='fontawesome|user' size={60} color='white' style={styles.icons}/>
	            <Text style={styles.label}>{this.state.profile.name}</Text>
	            <Text style={styles.label}>{this.state.profile.phone}</Text>
	            {this.state.profile.is_activated ? <ReadyButton styles={styles} controller={this}/> :  null}
	            {this.state.profile.is_activated ? <HistoryButton styles={styles} controller={this}/> :  null}
	        </View>
	    )
	}
});

var ReadyButton = React.createClass({
	render: function(){
		return (
			<View style={this.props.styles.button}>
				<TouchableHighlight
					style={this.props.styles.blueButton} underlayColor='#194c5b'
					onPress={this.props.controller.login}>
					<Text style={this.props.styles.buttonText}>ON DUTY</Text>
				</TouchableHighlight>
			</View>
		)
	}
})

var HistoryButton = React.createClass({
	render: function(){
		return (
			<View style={this.props.styles.button}>
				<TouchableHighlight
					style={this.props.styles.greenButton} underlayColor='#194c5b'>
					<Text style={this.props.styles.buttonText}>HISTORY</Text>
				</TouchableHighlight>
			</View>
		)
	}
})


module.exports.view = ProfileView;
