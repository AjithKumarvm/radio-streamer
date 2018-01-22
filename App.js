
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Platform,
    TouchableOpacity,
    NetInfo
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
                <Text>HELLO RADIO 90.8</Text>
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
