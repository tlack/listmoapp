var React = require('react-native');

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
  buttonText: {
  	fontSize: 20,
  	textAlign: 'center',
  	color: '#ffffff',
  	fontFamily: 'khand'
  },
  icons: {
  	height: 100,
  	width: 100
  }
});

module.exports.styles = styles;
