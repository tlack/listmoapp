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

	componentWillUnmount() {
    	navigator.geolocation.clearWatch(this.watchID);
  	},

	componentDidMount(){
		var workorders = [
			{
				id: '0',
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
				id: '1',
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

		
		var _this = this;

		navigator.geolocation.getCurrentPosition(function(initialPosition)
			{
				//this is fake data for now
				initialPosition.latitude = 37.7859513;
				initialPosition.longitude = -122.4064083;
				_this.setState({initialPosition: initialPosition});

				for(var i=0;i<workorders.length;i++)
				{
					workorders[i].annotations = [
						{
							latitude: workorders[i].pickup ? workorders[i].pickup.latitude : workorders[i].dropoff.latitude,
							longitude: workorders[i].pickup ? workorders[i].pickup.longitude : workorders[i].dropoff.longitude,
							title: workorders[i].pickup ? 'PICKUP' : 'SERVICE LOCATION',
							subtitle: workorders[i].items,
							hasRightCallout: true,
							onRightCalloutPress: function(e){
								_this.popOrderConfirm(e.annotationId);
							},
							id: workorders[i].id
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
								id: workorders[i].id
							}
						);
					}

					var latDelta = Math.abs((workorders[i].pickup ? workorders[i].pickup.latitude : workorders[i].dropoff.latitude) - (workorders[i].pickup ? workorders[i].dropoff.latitude : initialPosition.latitude)) * 3;
					var longDelta = Math.abs((workorders[i].pickup ? workorders[i].dropoff.longitude : initialPosition.longitude) - (workorders[i].pickup ? workorders[i].pickup.longitude : workorders[i].dropoff.longitude)) * 3;

					workorders[i].region = {
						latitude: workorders[i].pickup ? workorders[i].pickup.latitude : workorders[i].dropoff.latitude,
						longitude: workorders[i].pickup ? workorders[i].pickup.longitude : workorders[i].dropoff.longitude,
						latitudeDelta: latDelta,
						longitudeDelta: longDelta
					}
				}

				setTimeout(function(){
					_this.setState({workorders:workorders, currentWorkorder:workorders[0]});
				}, 0);
				
			}
	    ,function(err){console.log(err)},{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

	},

	getInitialState() {
		var _this = this;
		return {
			mapRegion: null,
			mapRegionInput: null,
			showModal: false,
			selectedOrder: null,
			workorders: null,
			currentWorkorder: null
		};
	},

	popOrderConfirm(id) {
		this._setModalVisible(true, id);
  	},

  	_setModalVisible(visible,id) {
		this.setState({showModal: visible, selectedOrder: visible === false ? null : id});
	},

	_prevOrder() {
		var index = this.state.workorders.indexOf(this.state.currentWorkorder);

		if(index > 0)
		{
			this.setState({currentWorkorder: this.state.workorders[index-1]});
		} else {
			this.setState({currentWorkorder: this.state.workorders[this.state.workorders.length-1]});
		}
	},

	_nextOrder(){

		var index = this.state.workorders.indexOf(this.state.currentWorkorder);

		if(index < this.state.workorders.length -1)
		{
			this.setState({currentWorkorder: this.state.workorders[index+1]});
		} else {
			this.setState({currentWorkorder: this.state.workorders[0]});
		}
	},

	acceptOrder(id) {
		console.log(id);
	},

	render() {
		return (
			<View style={[styles.container, {alignItems:'stretch'}]}>

				<View style={{flexDirection:'row'}}>
					<TouchableHighlight onPress={this._prevOrder}>
						<Icon name='fontawesome|angle-double-left' size={20} color='white' style={{width: 30, height: 30, marginTop:20}}/>
					</TouchableHighlight>
					<Text style={[{flex:1},styles.label]}>
						WORK ORDERS
					</Text>
					<TouchableHighlight onPress={this._nextOrder}>
						<Icon name='fontawesome|angle-double-right' size={20} color='white' style={{width: 30, height: 30, marginTop:20}}/>
					</TouchableHighlight>
				</View>

				<Text style={{alignSelf:'center', paddingBottom: 10, fontSize: 10, color:'#fff'}}>
					Order: {this.state.workorders ? this.state.workorders.indexOf(this.state.currentWorkorder) + 1 : 0} of {this.state.workorders ? this.state.workorders.length : 0}
				</Text>

				<Text style={{alignSelf:'center', paddingBottom: 10, fontSize: 20, color:'#fff'}}>
					Offer pay: ${this.state.currentWorkorder ? this.state.currentWorkorder.offered_pay : 0}
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
					region={this.state.currentWorkorder ? this.state.currentWorkorder.region : null}
					annotations={this.state.currentWorkorder ? this.state.currentWorkorder.annotations : null}/>
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