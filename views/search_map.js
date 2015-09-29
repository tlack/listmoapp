'use strict';

var React = require('react-native');
var styles = require('../styles/main.js').styles;


var {
    MapView,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    NativeAppEventEmitter
    } = React;

var { Icon, } = require('react-native-icons');

var SearchMapView = React.createClass({

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    },

    componentDidMount(){

        var self = this;

        var subscription = NativeAppEventEmitter.addListener('MapCompleted', (event) => {

            fetch('http://listmo.com/api/users/map')
                .then((resp) => { return resp.json() })
                .then(function(json) {
                    var driverLocs = json.recentlocs;
                    var driversAnnotations = [];
                    if(json.success === true){
                        driverLocs.forEach((driver) => {
                            driversAnnotations.push({
                                latitude: driver.lat,
                                longitude: driver.long,
                                title: driver.cust,
                                pinColor: 'green',
                                id: 'id-' + Math.random()
                            });
                        });
                        self.setState({drivers: driversAnnotations});
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        });
    },

    getInitialState() {
        var self = this;
        return {
            searchQuery: '',
            drivers: []
        };
    },

    login() {
        // pop login scene ... for now show profile
        this.props.nav.push({
            title: 'Become A Driver',
            id: 'main'
        });
    },

    render() {

        //We should probably consider using the navigationBar prop of <navigator> component instead of building navs all the time...
        return (
            <View style={[styles.container, {alignItems:'stretch'}]}>

                <View style={{flexDirection:'column'}}>
                    <View  style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.label,{flex:1, fontSize: 40}]}>
                            LISTM😅
                        </Text>
                        <TouchableHighlight style={{position: 'absolute', right: 20, top: 16}} onPress={this.login}>
                                <Text style={[styles.buttonText, {fontSize: 16}]}>
                                    💰{'\n'}Make Money
                                </Text>
                            </TouchableHighlight>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TextInput
                            style={styles.searchBox}
                            placeholder="What are you looking for?"
                            onChangeText={ (text) => this.setState({ searchQuery: text }) }
                            value={this.state.searchQuery} />
                        <Icon name='fontawesome|search' size={20} color='#CCC' style={styles.searchBoxIcon}/>
                    </View>
                </View>
                <MapView style={styles.map} showsUserLocation={true} annotations={this.state.drivers} showAnnotations={true} refreshAnnotations={true} />

            </View>
        );
    },

});


module.exports.view = SearchMapView;