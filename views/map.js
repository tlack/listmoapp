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
  NativeAppEventEmitter
} = React;

var { Icon, } = require('react-native-icons');

var MapViewExample = React.createClass({

	componentWillUnmount() {
    	navigator.geolocation.clearWatch(this.watchID);
  	},

	componentDidMount(){

		var _this = this;

		var first = true;

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
						workorders[i].annotations = [
							{
								latitude: workorders[i].type == "Delivery" ? workorders[i].from.lat : workorders[i].to.lat,
								longitude: workorders[i].type == "Delivery" ? workorders[i].from.long : workorders[i].to.long,
								title: (workorders[i].type == "Delivery" ? 'PICKUP' : 'SERVICE LOCATION') + ' deadline: ' + workorders[i].deadline,
								subtitle: workorders[i].items,
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
									title: 'DELIVER',
									subtitle: workorders[i].items,
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
		              <Text>{this.state.currentWorkorder ? this.state.currentWorkorder.items : ''}.{'\n'} ${this.state.currentWorkorder? this.state.currentWorkorder.pay : ''}</Text>
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
				<ReadyButton text={'DONE'} styles={styles} controller={this}/>
				<CloseButton text={'REPORT ISSUE'} styles={styles} controller={this.props.controller}/>
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