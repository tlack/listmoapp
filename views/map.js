'use strict';

var React = require('react-native');
var styles = require('../styles/main.js').styles;


var {
  MapView,
  Text,
  Modal,
  TouchableHighlight,
  View,
} = React;

var MapViewExample = React.createClass({

	getInitialState() {
		var _this = this;
		return {
			mapRegion: null,
			mapRegionInput: null,
			annotations: [{
				latitude:37.7846634,
				longitude:-122.4064989,
				title: 'six pack beer',
				subtitle: 'mike wants beer',
				hasRightCallout: true,
				onRightCalloutPress: function(e){
					_this.popOrderConfirm(e.annotationId);
				},
				id: '0'
			}],
			showModal: false,
			selectedOrder: null
		};
	},

	popOrderConfirm(id) {
		this._setModalVisible(true, id);
  	},

  	_setModalVisible(visible,id) {
		this.setState({showModal: visible, selectedOrder: visible === false ? null : id});
	},

	acceptOrder(id) {
		console.log(id);
	},

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.label}>
					WORK ORDERS
				</Text>
				
				<Modal
		          animated={true}
		          transparent={true}
		          visible={this.state.showModal}>
		          <View style={styles.modal}>
		            <View style={styles.modalInner}>
		              <Text>All the information about the pickup.{'\n'}$$$ million moneys</Text>
		              <ReadyButton styles={styles} controller={this} orderId={this.state.selectedOrder}/>
		              <CloseButton styles={styles} controller={this}/>
		            </View>
		          </View>
		        </Modal>

				<MapView
					style={styles.map}
					showsUserLocation={true}
					region={this.state.mapRegion || undefined}
					annotations={this.state.annotations || undefined}/>
			</View>
		);
	},

});

var ReadyButton = React.createClass({
	render: function(){
		return (
			<View style={[this.props.styles.button, {height:60}]}>
				<TouchableHighlight
					style={this.props.styles.blueButton} underlayColor='#194c5b'
					onPress={this.props.controller.acceptOrder.bind(this.props.controller, this.props.orderId)}>
					<Text style={this.props.styles.buttonText}>ACCEPT</Text>
				</TouchableHighlight>
			</View>
		)
	}
})

var CloseButton = React.createClass({
	render: function(){
		return (
			<View style={[this.props.styles.button, {height:60}]}>
				<TouchableHighlight
					style={this.props.styles.redButton} underlayColor='#194c5b'
					onPress={this.props.controller._setModalVisible.bind(this.props.controller, false)}>
					<Text style={this.props.styles.buttonText}>DECLINE</Text>
				</TouchableHighlight>
			</View>
		)
	}
})

module.exports.view = MapViewExample;