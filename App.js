
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Platform,
    TouchableOpacity,
    NetInfo,
    Image
} from 'react-native';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { Player } from './src/Player';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            selectedSource: 'http://132.148.128.197:8000/helloradio.ogg'
        };
    }
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{width: 120, height: 100}}
                    source={{uri: 'http://www.helloradio.in/wp-content/uploads/2016/03/Logo-Hello-Radio-1.png'}} />
                <Text style={{marginTop:20}}>HELLO RADIO 90.8 beta</Text>
                <Player url={this.state.selectedSource} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: Platform.OS === 'ios' ? 30 : 0
    }
});
