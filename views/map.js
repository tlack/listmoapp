'use strict';

var React = require('react-native');
var styles = require('../styles/main.js').styles;


var {
  MapView,
  Text,
  Modal,
  TouchableHighlight,
  View,
  LayoutAnimation,
  NativeAppEventEmitter,
  AsyncStorage
} = React;

var { Icon, } = require('react-native-icons');
var SESSION_KEY = '@AsyncStorageListmo:sess';
var session = null;

var MapViewExample = React.createClass({

	componentWillUnmount() {
    	navigator.geolocation.clearWatch(this.watchID);
  	},

  	async _loadInitialState() {
		try {
			session = await AsyncStorage.getItem(SESSION_KEY);
		} catch (error) {
			console.log(error);
		}
	},

	componentDidMount(){

		var _this = this;
		var first = true;

		this._loadInitialState().done();

		navigator.geolocation.getCurrentPosition(
	      (initialPosition) => this.setState({currentLocation:initialPosition}),
	      (error) => alert(error.message),
	      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
	    );

	    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
	      this.setState({currentLocation:lastPosition});
	    });

		var subscription = NativeAppEventEmitter.addListener(
		  'MapCompleted',
		  function(e){
		  	if(first === true)
		  	{
		  		fetch('http://listmo.com/api/workorders/')
				.then(function(resp){
					return resp.json()
				})
				.then(function(json) {
					var workorders = json.open;

					for(var i=0;i<workorders.length;i++)
					{
						var items = "";
						for(var j=0;j<workorders[i].item_list.length;j++)
						{
							items += workorders[i].item_list[j].qty + "x " + workorders[i].item_list[j].item + "\n";
						}
						workorders[i].items = items;
						workorders[i].annotations = [
							{
								latitude: workorders[i].type == "Delivery" ? workorders[i].from.lat : workorders[i].to.lat,
								longitude: workorders[i].type == "Delivery" ? workorders[i].from.long : workorders[i].to.long,
								title: (workorders[i].type == "Delivery" ? 'PICKUP' : 'SERVICE LOCATION') + ' deadline: ' + workorders[i].deadline,
								subtitle: items,
								hasRightCallout: true,
								onRightCalloutPress: function(e){
									_this.popOrderConfirm(e.annotationId);
								},
								pinColor: 'purple',
								id: workorders[i].workorder
							}
						];

						if(workorders[i].type == "Delivery")
						{
							workorders[i].annotations.push(
								{
									latitude: workorders[i].to.lat,
									longitude: workorders[i].to.long,
									title: 'DELIVER' + ' deadline: ' + workorders[i].deadline,
									subtitle: items,
									hasRightCallout: true,
									onRightCalloutPress: function(e){
										_this.popOrderConfirm(e.annotationId);
									},
									id: workorders[i].workorder
								}
							);
						}
					}

					_this.setState({workorders:workorders, currentWorkorder:workorders[0], refreshAnnotations: true});
				})
				.catch(function(error) {
					console.log(error);
				});
		  	}
		  }
		);
	},

	getInitialState() {
		var _this = this;
		return {
			showModal: false,
			currentLocation: null,
			refreshAnnotations: null,
			selectedOrder: null,
			workorders: null,
			currentWorkorder: null,
			acceptedHeight: 0
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
			this.setState({currentWorkorder: this.state.workorders[index-1], refreshAnnotations: true});
		} else {
			this.setState({currentWorkorder: this.state.workorders[this.state.workorders.length-1], refreshAnnotations: true});
		}
	},

	_nextOrder(){
		var index = this.state.workorders.indexOf(this.state.currentWorkorder);
		if(index < this.state.workorders.length -1)
		{
			this.setState({currentWorkorder: this.state.workorders[index+1], refreshAnnotations: !this.state.refreshAnnotations});
		} else {
			this.setState({currentWorkorder: this.state.workorders[0], refreshAnnotations: !this.state.refreshAnnotations});
		}
	},

	acceptOrder(id) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({showModal: false, acceptedOrder:this.state.currentWorkorder, acceptedHeight: 200});

		this._startPolling();
	},

	_startPolling() {
		console.log("start polling for location");
		fetch('http://listmo.com/api/user/update?s='+session+'&lat='+this.state.currentLocation.coords.latitude+'&long='+this.state.currentLocation.coords.longitude).then((response) => response.json()).then((response) => {console.log(response)}).catch((error)=>{console.log(error);});
		this.polling = setInterval(() => {
			//update location
			console.log("update");
			fetch('http://listmo.com/api/user/update?s='+session+'&lat='+this.state.currentLocation.coords.latitude+'&long='+this.state.currentLocation.coords.longitude).then((response) => response.json()).then((response) => {console.log(response)}).catch((error)=>{console.log(error);});
		},60000);
	},

	_stopPolling(){
		console.log("stop polling for location");
		clearInterval(this.polling);
	},

	_completeOrder(){
		this._stopPolling();
	},

	render() {
		return (
			<View style={[styles.container, {alignItems:'stretch'}]}>

				<View style={{flexDirection:'row'}}>
					{!this.state.acceptedOrder && (this.state.workorders ? this.state.workorders.length > 1 : null) ?
						<TouchableHighlight onPress={this._prevOrder}>
							<Icon name='fontawesome|angle-double-left' size={20} color='white' style={{width: 30, height: 30, marginTop:20}}/>
						</TouchableHighlight>
					: null}
					<Text style={[{flex:1},styles.label]}>
						{this.state.acceptedOrder ? 'CURRENT ORDER' : 'WORK ORDERS'}
					</Text>
					{!this.state.acceptedOrder && (this.state.workorders ? this.state.workorders.length > 1 : null) ?
						<TouchableHighlight onPress={this._nextOrder}>
							<Icon name='fontawesome|angle-double-right' size={20} color='white' style={{width: 30, height: 30, marginTop:20}}/>
						</TouchableHighlight>
					: null}
				</View>

				{!this.state.acceptedOrder ?
					<Text style={{alignSelf:'center', paddingBottom: 10, fontSize: 10, color:'#fff'}}>
						Order: {this.state.workorders ? this.state.workorders.indexOf(this.state.currentWorkorder) + 1 : 0} of {this.state.workorders ? this.state.workorders.length : 0}
					</Text>
				: null}

				<Text style={{alignSelf:'center', paddingBottom: 10, fontSize: 20, color:'#fff'}}>
					Offer pay: ${this.state.currentWorkorder ? this.state.currentWorkorder.pay : 0}
				</Text>
				
				<Modal
		          animated={true}
		          transparent={true}
		          visible={this.state.showModal}>
		          <View style={styles.modal}>
		            <View style={styles.modalInner}>
		              <Text>{this.state.currentWorkorder ? this.state.currentWorkorder.items : ''}{'\n'}{this.state.currentWorkorder ? '$' + this.state.currentWorkorder.pay : ''}{'\n'}</Text>
		              <Text>{this.state.currentWorkorder !== null ? (this.state.currentWorkorder.type === "Delivery" ? 
		              	"from: \n" + this.state.currentWorkorder.from.name + '\n' +
		              	this.state.currentWorkorder.from.addr + '\n' + '\n' +
		              	"to: \n" + this.state.currentWorkorder.to.name + '\n' + 
		              	this.state.currentWorkorder.to.addr + '\n'
		              	 : this.state.currentWorkorder.to.name + '\n' +
		              	this.state.currentWorkorder.to.addr + '\n') : null}</Text>
		              {!this.state.acceptedOrder ? <ReadyButton styles={styles} controller={this} orderId={this.state.currentWorkorder ? this.state.currentWorkorder.id : ''} onpress={this.acceptOrder} text={'ACCEPT'}/> : null }
		              <CloseButton styles={styles} controller={this} text={!this.state.acceptedOrder ? 'DECLINE' : 'CLOSE'}/>
		            </View>
		          </View>
		        </Modal>

				<MapView
					style={styles.map}
					showsUserLocation={true}
					refreshAnnotations={this.state.refreshAnnotations || undefined}
					annotations={this.state.currentWorkorder ? this.state.currentWorkorder.annotations : null} showAnnotations={true}/>

				<AcceptedOrder controller={this} />
			</View>
		);
	},

});

var AcceptedOrder = React.createClass({
	render: function(){
		return (
			<View style={{height: this.props.controller.state.acceptedHeight}}>
				<ReadyButton text={'DONE'} styles={styles} controller={this.props.controller} onpress={this.props.controller._completeOrder}/>
				<CloseButton text={'REPORT ISSUE'} styles={styles} controller={this.props.controller} onpress={this.props.controller._completeOrder}/>
			</View>
		)
	}
})

var ReadyButton = React.createClass({
	render: function(){
		return (
			<View style={[this.props.styles.button, {height:60}]}>
				<TouchableHighlight
					style={this.props.styles.blueButton} underlayColor='#194c5b'
					onPress={this.props.onpress}>
					<Text style={this.props.styles.buttonText}>{this.props.text}</Text>
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
					<Text style={this.props.styles.buttonText}>{this.props.text}</Text>
				</TouchableHighlight>
			</View>
		)
	}
})

module.exports.view = MapViewExample;