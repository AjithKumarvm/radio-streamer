import React, { Component } from 'react';
import {
    NativeModules,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    DeviceEventEmitter,
    ActivityIndicator,
    Platform,
    NetInfo
} from 'react-native';

import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';

// Possibles states
const PLAYING = 'PLAYING';
const STREAMING = 'STREAMING';
const PAUSED = 'PAUSED';
const STOPPED = 'STOPPED';
const ERROR = 'ERROR';
const METADATA_UPDATED = 'METADATA_UPDATED';
const BUFFERING = 'BUFFERING';
const START_PREPARING = 'START_PREPARING'; // Android only
const BUFFERING_START = 'BUFFERING_START'; // Android only
let retryInitiated = false;

// UI
const iconSize = 60;

class Player extends Component {
    constructor(props) {
        super(props);
        this._onPress = this._onPress.bind(this);
        this.state = {
            status: STOPPED,
            song: '',
            stalled:false,
            bitRate:null
        };
    }

    componentDidMount() {
        const self = this;
        this.subscription = DeviceEventEmitter.addListener(
            'AudioBridgeEvent', (evt) => {
                // We just want meta update for song name
                if (evt.status === METADATA_UPDATED && evt.key === 'StreamTitle') {
                    this.setState({song: this.sanitise(evt.value)});
                }
                else if(evt.key === 'icy-br'){
                    this.setState({bitRate:evt.value});
                } 
                else if (evt.status != METADATA_UPDATED) {
                    if(evt.song)
                        evt.song = this.sanitise(evt.song);
                    this.setState(evt);
                }
                self.handleAudioEvent();
                console.log('AudioBridgeEvent',evt);
            }
        );

        ReactNativeAudioStreaming.getStatus((error, status) => {
            (error) ? console.log(error) : this.setState(status)
        });
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange.bind(this)
        );
    }
    handleFirstConnectivityChange(connectionInfo) {
        if(connectionInfo){
            this.play();
        }else{
            ReactNativeAudioStreaming.stop();
        }
    }
    _onPress() {
        switch (this.state.status) {
            case PLAYING:
            case STREAMING:
                ReactNativeAudioStreaming.pause();
                break;
            case PAUSED:
                ReactNativeAudioStreaming.resume();
                break;
            case STOPPED:
                this.setState({stalled:true});
            case ERROR:
                this.retry();
                break;
            case BUFFERING:
            case BUFFERING_START:
                this.retry();
                break;
        }
        if(this.state.status == STOPPED){
            this.setState({status:BUFFERING_START});
        }
    }
    handleAudioEvent() {
        switch (this.state.status) {
            case PLAYING:
            case STREAMING:
                retryInitiated = false;
                break;
            case ERROR:
                retryInitiated = false;
            case BUFFERING:
            case BUFFERING_START:
                this.retry();
                break;
        }
    }
    retry(){
        if(retryInitiated)
            return;
        const self = this;
        retryInitiated = true;
        setTimeout(()=>{
            self.play();
        },3000);
    }
    play() {
        ReactNativeAudioStreaming.play(this.props.url, {showIniOSMediaCenter: true, showInAndroidNotifications: true});
    }
    sanitise(url){
        if(!url)
            return;

        //remove urls
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        url = url.replace(urlRegex, '');
        
        //remove symbols
        url = url.replace(/[^\w\s]/gi, '');

        //remove digits
        url = url.replace(/[0-9]/g, '');

        //remove common words in english
        const common = ["cut","bgm"];

        for(c in common){
            const com = common[c];
            url = url.replace(com,'').replace(com.toUpperCase(),'');
        }

        //fix all spaces
        url = url.replace(/\s\s+/g, ' ');
        return url;
    }
    render() {
        let icon = null;
        let playerStatus = 'BUFFERING';
        switch (this.state.status) {
            case PLAYING:
            case STREAMING:
                icon = <Text style={styles.icon}>॥</Text>;
                playerStatus = 'PLAYING';
                break;
            case PAUSED:
            case STOPPED:
            case ERROR:
                icon = <Text style={styles.icon}>▸</Text>;
                playerStatus = 'STOPPED';
                break;
            case BUFFERING:
            case BUFFERING_START:
            case START_PREPARING:
                icon = <ActivityIndicator
                    animating={true}
                    style={{height: 30}}
                    size="large"
                />;
                playerStatus = 'BUFFERING';
                break;
        }
        const programName = this.state.song;
        return (
            <TouchableOpacity onPress={this._onPress} style={styles.wrapper}>
                <View style={styles.container}>
                    {icon}
                </View>
                <View style={styles.status}>
                    <Text>{playerStatus}</Text>
                </View>
                <View style={styles.songNameWrapper}>
                    {programName && playerStatus=='PLAYING'?
                        <Text style={styles.songName}>
                            {programName} {this.state.bitRate?`@ ${this.state.bitRate}Kbps`:null}
                        </Text>:
                        <Text style={styles.songName}>...</Text>
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 80,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:20
    },
    icon: {
        color: '#000',
        fontSize: 26,
        borderColor: '#000033',
        borderWidth: 1,
        borderRadius: iconSize / 2,
        width: iconSize,
        height: Platform.OS == 'ios' ? iconSize : 40,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: Platform.OS == 'ios' ? 10 : 0
    },
    textContainer: {
        flexDirection: 'row',
        margin: 10,
        backgroundColor:'#CCCCCC'
    },
    textLive: {
        color: '#000',
        marginBottom: 5
    },
    songNameWrapper: {
        flexDirection: 'row'
    },
    songName: {
        fontSize: 11,
        textAlign: 'center',
        color: '#000'
    },
    status:{
        alignItems: 'center',
        flexDirection: 'row'
    }
});

Player.propTypes = {
    url: React.PropTypes.string.isRequired
};

export { Player }
