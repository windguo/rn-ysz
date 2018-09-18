/**
 * Created by zhangzuohua on 2018/1/19.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View,
    Dimensions,
    Animated,
    Easing,
    PanResponder,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    InteractionManager,
    BackHandler,
    ScrollView,
    TouchableWithoutFeedback,
    RefreshControl,
    DeviceEventEmitter,
    LayoutAnimation,
    NativeModules,
    ImageBackground,
    FlatList,
    WebView,
    TextInput,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import urlConfig from '../utils/urlConfig';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
export  default  class web extends Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (
                <ImageBackground style={{ ...header }}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.goBack(null);
                }}>
                    <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                        <IconSimple name="arrow-left" size={20} color='#282828'/>
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize:17,textAlign:'center',fontWeight:'300',lineHeight:43.7,color:'#282828'}}> {navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.WebTitle}</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                }}>
                    <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7,backgroundColor:'transparent',width:20}}>
                    </View>
                </TouchableOpacity>
                </ImageBackground>
            )
        }

    };
    constructor(props) {
        super(props);
        this.state = {
            cookies    : {},
            webViewUrl : '',
            data:{}
        }
    }
    onNavigationStateChange(e) {
        this.props.navigation.setParams({
            WebTitle: e.title
        });
    }
//this.props.navigation.state.params.data.content && JSON.parse(this.props.navigation.state.params.data.content).content
    componentDidMount() {
        this.datas = this.props.navigation.state.params.data;
        console.log('this.datas---sss==',this.datas);
    }
    _onMessage = (event) => {
        const { data } = event.nativeEvent;
        const cookies  = data.split(';'); // `csrftoken=...; rur=...; mid=...; somethingelse=...`
        console.log('cookieXXXXXX',cookies);

        cookies.forEach((cookie) => {
            const c = cookie.trim().split('=');

            const new_cookies = this.state.cookies;
            new_cookies[c[0]] = c[1];

            this.setState({ cookies: new_cookies });
        });

       // this._checkNeededCookies();
    }

    //接收来自H5的消息
    onMessage = (e) => {
        console.log('WebView onMessage 收到H5参数：', e.nativeEvent.data);
        let params = e.nativeEvent.data;
        params = JSON.parse(params);
        console.log('WebView onMessage 收到H5参数 json后：', params);
    };
    onLoadEnd = (e) => {
        console.log('WebView onLoadEnd e：', e.nativeEvent);
        let data = this.datas;
        this.web && this.web.postMessage(JSON.stringify(data));//发送消息到H5
    };

    render() {
       //  const patchPostMessageFunction = function() {
       //      var originalPostMessage = window.postMessage;
       //
       //      var patchedPostMessage = function(message, targetOrigin, transfer) {
       //          originalPostMessage(message, targetOrigin, transfer);
       //      };
       //
       //      patchedPostMessage.toString = function() {
       //          return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
       //      };
       //
       //      window.postMessage = patchedPostMessage;
       //  };
        //onMessage={this._onMessage} injectedJavaScript={patchPostMessageJsCode}

       // const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();window.postMessage(document.cookie)';
        return (
            // <WebView source={{uri: this.pubLishUrl}} onNavigationStateChange={(e) => {
            //     this.onNavigationStateChange(e)
            // }} startInLoadingState={true} />
            <WebView
                ref={(webview) => {
                    this.web = webview
                }}
                // style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onNavigationStateChange={(e) => {
                 this.onNavigationStateChange(e)
             }}
                source={require('./test.html')}
                onLoadEnd={this.onLoadEnd}//加载成功或者失败都会回调
                onMessage={this.onMessage}
                javaScriptEnabled={true}//指定WebView中是否启用JavaScript
                startInLoadingState={true} //强制WebView在第一次加载时先显示loading视图
                renderError={(e) => {
                    return <View />;
                }}
            />
        );
    }
    _onRefresh = () =>{};
}
const header = {
    backgroundColor: '#fff',
    ...ifIphoneX({
        paddingTop: 44,
        height: 88
    }, {
        paddingTop: Platform.OS === "ios" ? 20 : SCALE(StatusBarHeight()),
        height:64,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end'
}





