
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
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.urls = [
            {
                name: 'Hello Radio 90.8',
                url: 'http://132.148.128.197:8000/helloradio.ogg'
            }
        ];

        this.state = {
            dataSource: this.ds.cloneWithRows(this.urls),
            selectedSource: this.urls[0].url
        };
        //play default
        // if(this.urls.length==1){
        //     const thiStream = this.urls[0];
        //     this.state = {selectedSource: thiStream.url, dataSource: this.ds.cloneWithRows(this.urls)};
        //     this.playStream(thiStream.url)
        // }
    }
    componentDidMount(){
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }
    handleFirstConnectivityChange(connectionInfo) {
        console.warn('handleFirstConnectivityChange',connectionInfo);
    }
    playStream(url){
        ReactNativeAudioStreaming.play(url, { showIniOSMediaCenter: true, showInAndroidNotifications: true});
    }
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <TouchableOpacity onPress={() => {
                                this.setState({selectedSource: rowData.url});
                                this.playStream(rowData.url);
                            }}>
                            <View style={StyleSheet.flatten([
                                styles.row,
                                {backgroundColor: rowData.url == this.state.selectedSource ? '#3fb5ff' : 'white'}
                            ])}>
                                <Text style={styles.icon}>▸</Text>
                                <View style={styles.column}>
                                    <Text style={styles.name}>{rowData.name}</Text>
                                    <Text style={styles.url}>{rowData.url}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />

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
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    column: {
        flexDirection: 'column'
    },
    icon: {
        fontSize: 26,
        width: 30,
        textAlign: 'center'
    },
    name: {
        color: '#000'
    },
    url: {
        color: '#CCC'
    }
});
