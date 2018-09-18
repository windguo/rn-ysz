import React, { Component } from 'react';
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
    CameraRoll,
    RefreshControl,
    DeviceEventEmitter,
    LayoutAnimation,
    NativeModules,
    ImageBackground,
    FlatList,
    WebView,
    TextInput,
} from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../../utils/iphoneX';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import urlConfig from '../../utils/urlConfig';
import PureModalUtil from '../../utils/PureModalUtil';
import Toast from 'react-native-root-toast';
import * as WeChat from 'react-native-wechat';
import Icon from 'react-native-vector-icons/FontAwesome';
import HttpUtil from '../../utils/HttpUtil';
import storageKeys from '../../utils/storageKeyValue'
import ScrollTabView from "../ScrollTabView";
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export default class Me extends Component {
    static navigationOptions = {
        tabBarLabel: 'DIY表情',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconSimple name="user" size={22} color={focused ? "#f60" : 'black'} />
        ),
        header: ({ navigation }) => {
            return (
                <ImageBackground style={{ ...header }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.goBack(null);
                    }}>
                        <View style={{ justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7, width: 20 }}>
                            <IconSimple name="arrow-left" size={25} color='#282828' />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, textAlign: 'center', lineHeight: 43.7, color: '#282828' }}>生成的表情,快去分享吧</Text>
                    <View style={{ justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7 }}></View>
                </ImageBackground>
            )
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            visible: false,
            ViewHeight: new Animated.Value(0),
            username: '',
            userpwd: '',
            userName: null,
            top: 100,
            left: 20,
            width: 100,
            height:100,
            _picpath:'',
            
        };
    }

    clickToReport = () => {
        let url = urlConfig.ReportURL + '/' + this.state.data.classid + '/' + this.state.data.id;
        this.props.navigation.navigate('Web', { url: url });
        this.close();
    }
    ToastShow = (message) => {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    }
    
    clickToShare = (type) => {
        console.log('XXXXXXXXXXXXX', urlConfig.thumbImage);
        this.close();
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                if (type === 'Session') {
                    WeChat.shareToSession({
                        imageUrl: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state._picpath,
                        titlepicUrl: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state._picpath,
                        type: 'imageUrl',
                        webpageUrl: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state._picpath
                    }).then((message) => { message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((error) => {
                        if (error.message != -2) {
                            Toast.show(error.message);
                        }
                    });
                } else {
                    WeChat.shareToTimeline({
                        imageUrl: this.state.data && this.state.data.nurl,
                        type: 'imageUrl',
                        webpageUrl: urlConfig.TouxiangDetailUrl + this.state.data.classid + '/' + this.state.data.id
                    }).then((message) => { message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((error) => {
                        if (error.message != -2) {
                            Toast.show(error.message);
                        }
                    });
                }
            } else {
            }
        });
    }
    show = (item) => {
        this.state.data = item;
        if (Platform.OS === 'android') {
            this.share()
            return;
        }
        this._ViewHeight.setValue(0);
        this.setState({
            visible: true
        }, Animated.timing(this._ViewHeight, {
            fromValue: 0,
            toValue: 140, // 目标值
            duration: 200, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start());
    };
    close = () => {
        this.setState({
            visible: false
        });
    };
    share = async () => {
        let data = await NativeModules.NativeUtil.showDialog();
        if (data.wechat === 3) {
            this.clickToReport();
            return;
        }
        if (data) {
            WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    if (data.wechat === 1) {
                        WeChat.shareToSession({
                            imageUrl: this.state.data && this.state.data.nurl,
                            titlepicUrl: this.state.data && this.state.data.titlepic,
                            type: 'imageUrl',
                            webpageUrl: urlConfig.TouxiangDetailUrl + this.state.data.classid + '/' + this.state.data.id
                        }).then((message) => { message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    } else if (data.wechat === 2) {
                        WeChat.shareToSession({
                            imageUrl: this.state.data && this.state.data.nurl,
                            titlepicUrl: this.state.data && this.state.data.titlepic,
                            type: 'imageUrl',
                            webpageUrl: urlConfig.TouxiangDetailUrl + this.state.data.classid + '/' + this.state.data.id
                        }).then((message) => { message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    }
                } else {
                    Toast.show("没有安装微信软件，请您安装微信之后再试");
                }
            });
            console.log('data', data)
        }
    };

    //保存图片
    saveImg(img) {
        var promise = CameraRoll.saveToCameraRoll(img);
        promise.then(function (result) {
            Toast.show('保存成功,请到相册查看。', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }).catch(function (error) {
            Toast.show('保存失败！\n' + error, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        });
    }

    componentWillMount() {
        this._ViewHeight = new Animated.Value(0);
        
    }
    componentWillUnmount() {
        
    }
    componentDidMount() {
        this.loadContentData();
    }
    LoginSuccess = () => {
        this.setState({ username: GLOBAL.userInfo.username });
    }
    pushToWeb = (params) => {
        let url = '';
        if (params === 'yjfk') {
            url = urlConfig.suggestURL;
        } else if (params === 'yhsyxy') {
            url = urlConfig.agreementURL;
        }
        this.props.navigation.navigate('Web', { url: url });
    }
    renderSpinner = (text) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => { this.setState({ visible: false }); }}>
                <View key="spinner" style={styles.spinner}>
                    <Animated.View style={{
                        justifyContent: 'center',
                        width: WIDTH,
                        height: this._ViewHeight,
                        backgroundColor: '#fcfcfc',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflow: 'hidden'
                    }}>
                        <View style={styles.shareParent}>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={() => this.clickToShare('Session')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../../assets/share_icon_wechat.png')} />
                                    <Text style={styles.spinnerTitle}>微信好友</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={() => this.clickToShare('TimeLine')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../../assets/share_icon_moments.png')} />
                                    <Text style={styles.spinnerTitle}>微信朋友圈</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 10, backgroundColor: '#f5f5f5' }}></View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 16, color: 'black', textAlign: 'center' }}>取消</Text>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    show = () => {
        this._ViewHeight.setValue(0);
        this.setState({
            visible: true
        }, Animated.timing(this._ViewHeight, {
            fromValue: 0,
            toValue: 140, // 目标值
            duration: 200, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start());
    };
    close = () => {
        this.setState({
            visible: false
        });
    };
    loadContentData = async (resolve) => {
        let formData = new FormData();
        console.log('formDataformDataformDataformData=', formData);
        formData.append("name", this.props.navigation.state.params.title);
        formData.append("pic", this.props.navigation.state.params.nurl);
        // formData.append("x",0);
        formData.append("x", this.props.navigation.state.params.x);
        // formData.append("y",0);
        formData.append("y", this.props.navigation.state.params.y);
        formData.append("color", this.props.navigation.state.params.color);
        formData.append("fontSize", this.props.navigation.state.params.fontSize - 4);
        formData.append("width", this.props.navigation.state.params.width);
        formData.append("height", this.props.navigation.state.params.height);
        formData.append("type", this.props.navigation.state.params.type);
        console.log(formData);
        let url = 'http://www.jianjie8.com/e/api/biaoqing/?getJson=creat';
        console.log('url---=---=---', url);
        let res = await HttpUtil.POST(url, formData);
        console.log('resresresresresres=====', res);
        let result = res.result ? res.result : [];
        this.setState({
            data: result,
            _picpath: result[0].picpath
        });

        console.log('=======', 'http://www.jianjie8.com/e/api/biaoqing/' + this.state._picpath)
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Color.f5f5f5 }}>
                <View style={{ width: WIDTH, height: 10, backgroundColor: Color.f5f5f5 }} />
                <ScrollView>
                <View style={{alignItems:'center'}}>
                    <Image source={{
                            uri: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state._picpath
                    }}
                        style={{ width: this.props.navigation.state.params.width, height: this.props.navigation.state.params.height }}
                    />
                </View>
                 <View style={{ paddingTop: 30,flexDirection:'row', alignItems: 'center',justifyContent:'center' }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', marginLeft: 10 }}
                            onPress={() => this.clickToShare('Session')}
                        >
                            <View style={styles.shareContent}>
                                <Icon name="weixin" size={40} color='#f60' />
                                <Text style={styles.spinnerTitle}>微信好友</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={
                                this.saveImg.bind(this, 'http://www.jianjie8.com/e/api/biaoqing/' + this.state._picpath)}
                            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                            style={{ flexDirection: 'row', marginLeft: 10 }}
                        >
                            <View style={styles.shareContent}>
                                <MaterialIcons name="add-to-photos" size={40} color='#fa7b3d' />
                                <Text style={styles.spinnerTitle}>保存到相册</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', marginLeft: 10 }}
                            onPress={() => this.clickToReport()}
                        >
                            <View style={styles.shareContent}>
                                <IconSimple name="exclamation" size={40} color='#fe96aa' />
                                <Text style={styles.spinnerTitle}>举报</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <PureModalUtil
                    visible={this.state.visible}
                    close={this.close}
                    contentView={this.renderSpinner} />
            </View>
        );
    }

}
const header = {
    backgroundColor: '#fff',
    ...ifIphoneX({
        paddingTop: 44,
        height: 88
    }, {
            paddingTop: Platform.OS === "ios" ? 20 : SCALE(StatusBarHeight()),
            height: 64,
        }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
}
const styles = StyleSheet.create({
    base: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF'
    },
    spinner: {
        width: WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    spinnerContent: {
        justifyContent: 'center',
        width: WIDTH,
        backgroundColor: '#fcfcfc',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    spinnerTitle: {
        fontSize: 14,
        color: '#313131',
        textAlign: 'center',
        marginTop: 5
    },
    shareParent: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareIcon: {
        width: 40,
        height: 40
    },
});