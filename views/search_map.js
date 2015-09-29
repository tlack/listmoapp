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

        //var subscription = NativeAppEventEmitter.addListener('MapCompleted', function (e) {});
    },

    getInitialState() {
        var self = this;
        return {
            searchQuery: ''
        };
    },

    login() {
        // pop login scene ... for now show profile
        this.props.nav.push({
            title: 'Profile',
            id: 'profile'
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
                                    🔐{'\n'}Login
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
                <MapView style={styles.map} showsUserLocation={true} />

            </View>
        );
    },

});


module.exports.view = SearchMapView;