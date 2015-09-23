var React = require('react-native');

var {
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableHighlight,
  LayoutAnimation,
} = React;

var styles = require('../styles/main.js').styles;
var Display = require('react-native-device-display');

var MainView = React.createClass({
	getInitialState: function(){
		return {
			showButtons:false,
			viewStyle: {
				height: 0
			},
			containerViewStyle: {
				top: 0
			}
		};
	},
	animateButtons: function(show){
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		this.setState({
			viewStyle: {
				height: show === true ? 60 : 0
			},
			containerViewStyle: {
				top: show === true ? (Display.height >= 667 ? 0 : -180) : 0
			}
		});
	},
	onInput: function(value){
		if(value == "")
		{
			this.setState({
				showButtons: false,
			});
			this.animateButtons(false);
		} else {
			this.setState({showButtons: true});
			this.animateButtons(true);
		}
		
		this.state.phoneValue = value;
	},
	onFocus: function(){
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({
			containerViewStyle: {
				top: this.state.showButtons === true ? (Display.height >= 667 ? 0 : -180) : 0
			}
		});
	},
	onBlur: function(){
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({
			containerViewStyle: {
				top: 0
			}
		});
	},
	login: function(){
		if(this.state.showButtons === true)
		{
			this.props.nav.push({
				title: 'Profile',
				id: 'profile'
			})
		}
	},
	register: function(){
		if(this.state.showButtons === true)
		{
			
		}
	},
	containerTouched: function(e) {
		e.preventDefault();
		this.refs.phone.blur();
	},
	render: function() {
		let scrollStyles = [styles.container, this.state.containerViewStyle];
		return (
	        <ScrollView contentContainerStyle={scrollStyles} ref='scrollView' keyboardDismissMode={'on-drag'}>
	            <Text style={styles.welcome}>
	                WELCOME TO LISTMO
	            </Text>
	            <TextInput
	            	ref='phone'
	            	placeholder="Enter your phone #"
	            	keyboardType="phone-pad"
	            	style={styles.input}
	            	placeholderTextColor='#b2ac9f'
	            	onChangeText={this.onInput}
	            	onFocus={this.onFocus}
	            	onBlur={this.onBlur}
	            	>
	            </TextInput>
	            <LoginButton styles={styles} controller={this}/>
	            <RegisterButton styles={styles} controller={this}/>
	        </ScrollView>
	    )
	}
});

var LoginButton = React.createClass({
	render: function(){
		let viewStyle = [this.props.styles.button, this.props.controller.state.viewStyle];
		return (
			<View style={viewStyle}>
				<TouchableHighlight
					style={this.props.styles.blueButton}
					underlayColor='#194c5b'
					onPress={this.props.controller.login}>
					<Text style={this.props.styles.buttonText}>LOGIN</Text>
				</TouchableHighlight>
			</View>
		)
	}
})

var RegisterButton = React.createClass({
	render: function(){
		let viewStyle = [this.props.styles.button, this.props.controller.state.viewStyle];
		return (
			<View style={viewStyle}>
				<TouchableHighlight
					style={this.props.styles.greenButton}
					underlayColor='#194c5b'
					onPress={this.props.controller.register}>
					<Text style={this.props.styles.buttonText}>REGISTER</Text>
				</TouchableHighlight>
			</View>
		)
	}
})


module.exports.view = MainView;