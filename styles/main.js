var React = require('react-native');
var Display = require('react-native-device-display');

var {
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#272c3b',
  },
  welcome: {
    fontSize: 50,
    fontFamily: 'khand',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 60
  },
  label: {
  	fontSize: 30,
  	color: '#ffffff',
  	textAlign: 'center',
  	marginTop: 15,
  	fontFamily: 'khand'
  },
  input: {
  	fontSize:20,
  	textAlign: 'center',
  	color: '#ffffff',
  	textAlign: 'center',
  	height: 60,
  	marginLeft: 30,
  	marginRight: 30,
  	marginTop:30,
  	borderWidth: 1,
  	borderColor: '#f0e8d7'
  },
  button: {
  	justifyContent: 'center',
  	flexDirection: 'row',
	alignSelf: 'stretch',
	overflow: 'hidden',
	marginLeft: 30,
	marginRight: 30,
	marginTop:30,
  },
  blueButton: {
  	flex: 1,
  	backgroundColor: '#3ea2bc',
  	justifyContent: 'center'
  },
  greenButton: {
  	flex: 1,
  	backgroundColor: '#79bc3e',
  	justifyContent: 'center'
  },
  redButton: {
  	flex: 1,
  	backgroundColor: '#bc3e3e',
  	justifyContent: 'center',
  },
  buttonText: {
  	fontSize: 20,
  	textAlign: 'center',
  	color: '#ffffff',
  	fontFamily: 'khand'
  },
  icons: {
  	height: 100,
  	width: 100
  },
  map: {
  	flex: 1,
  	width: Display.width,
    borderWidth: 1,
    borderColor: '#fff',
  },
  modal: {
  	flex: 1,
  	justifyContent: 'center',
  	padding: 20,
  	backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalInner: {
  	borderRadius: 10,
  	padding: 20,
  	backgroundColor: '#fff'
  },
  modalButton: {
  	marginTop: 10,
  }
});

module.exports.styles = styles;
