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

var { Icon, } = require('react-native-icons');

var MapViewExample = React.createClass({

	componentDidMount(){

		var workorders = [
			{
				id: 0,
				pickup: {
					latitude:37.7846634,
					longitude:-122.4064989,
				},
				dropoff: {
					latitude:37.7882726,
					longitude:-122.4057655,
				},
				offered_pay: "24.00",
				deadline: "1443188069",
				items: "6 pack of budweiser, 1 bottle of champagne"
			},
			{
				id: 1,
				pickup: {
					latitude:37.7921456,
					longitude:-122.4191997,
				},
				dropoff: {
					latitude:37.7908308,
					longitude:-122.4370415,
				},
				offered_pay: "30.00",
				deadline: "1443188069",
				items:"6 sacks of flour, our bags of filo"
			}
		];

		for(var i=0;i<workorders.length;i++)
		{
			workorders[i].annotations = [
				{
					region: {
						latitudeDelta: 10,
						longitudeDelta: 10,
					},
					latitude: workorders[i].pickup ? workorders[i].pickup.latitude : workorders[i].dropoff.latitude,
					longitude: workorders[i].pickup ? workorders[i].pickup.longitude : workorders[i].dropoff.longitude,
					title: workorders[i].pickup ? 'PICKUP' : 'SERVICE LOCATION',
					subtitle: workorders[i].items,
					hasRightCallout: true,
					onRightCalloutPress: function(e){
						_this.popOrderConfirm(e.annotationId);
					},
					id: workorders[i]
				}
			];

			if(workorders[i].pickup)
			{
				workorders[i].annotations.push(
					{
						latitude: workorders[i].dropoff.latitude,
						longitude: workorders[i].dropoff.longitude,
						title: 'DELIVER',
						subtitle: workorders[i].items,
						hasRightCallout: true,
						onRightCalloutPress: function(e){
							_this.popOrderConfirm(e.annotationId);
						},
						id: workorders[i]
					}
				);
			}
		}

		this.setState({workorders:workorders});
	},

	getInitialState() {
		var _this = this;
		return {
			mapRegion: null,
			mapRegionInput: null,
			showModal: false,
			selectedOrder: null,
			workorders: null,
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
			<View style={[styles.container, {alignItems:'stretch'}]}>
				

				<View style={{flexDirection:'row', paddingBottom: 10}}>
					<TouchableHighlight><Icon name='fontawesome|angle-double-left' size={20} color='white' style={{width: 30, height: 30, marginTop:20}}/></TouchableHighlight>
					<Text style={[{flex:1},styles.label]}>
						WORK ORDERS
					</Text>
					<TouchableHighlight><Icon name='fontawesome|angle-double-right' size={20} color='white' style={{width: 30, height: 30, marginTop:20}}/></TouchableHighlight>
				</View>
				
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