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
    RefreshControl,
    DeviceEventEmitter,
    LayoutAnimation,
    CameraRoll,
    NativeModules,
    ImageBackground,
    Keyboard,
    FlatList,
    WebView,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../../utils/iphoneX';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import urlConfig from '../../utils/urlConfig';
import PureModalUtil from '../../utils/PureModalUtil';
import * as WeChat from 'react-native-wechat';
import HttpUtil from '../../utils/HttpUtil';
import storageKeys from '../../utils/storageKeyValue'
import ScrollTabView from "../ScrollTabView";
import ImageProgress from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';

const { width, height } = Dimensions.get('window');

export default class Me extends Component {
    shouldComponentUpdate(nextProps) {
        return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
            (nextProps.defaultValue == undefined || nextProps.defaultValue == '')) ||
            (this.props.defaultValue === nextProps.defaultValue && (nextProps.value == undefined || nextProps.value == ''));
    }
    static navigationOptions = {
        tabBarLabel: '表情生成',
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
                    <Text style={{ fontSize: 16, textAlign: 'center', lineHeight: 43.7, color: '#282828' }}>
                        本地图片生成表情
                    </Text>
                    <View>
                        <Text></Text>
                    </View>
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
            top: parseInt(this.props.navigation.state.params.y) == '0' ? 50 : parseInt(this.props.navigation.state.params.y),
            left: parseInt(this.props.navigation.state.params.x) == '0' ? 50 : parseInt(this.props.navigation.state.params.x),
            bg: '',
            trueWidth: 150,
            trueHeight: 150,
            text: '请在下方输入框输入内容',
            // text: this.props.navigation.state.params.title,
            fontSize: 16,
            width: this.props.navigation.state.params.width,
            height: this.props.navigation.state.params.height,
            keyBoardIsShow: false,
            hasResult: false,
            creatButtonFlag: false,
            type: '',
            base64Data: '',
            response: '',
            localCreatedPic: '',
            color: '000000',
        };
    }
    lostBlur=()=> {
        //退出软件盘
        if (keyBoardIsShow) {
            Keyboard.dismiss();
        }
    }
    _keyboardDidShow=()=> {
        // this.setState({
        //     keyBoardIsShow:true
        // })
    }

    _keyboardDidHide=()=> {
        // this.setState({
        //     keyBoardIsShow: false
        // })
    }

    componentWillMount = () => {
        this._ViewHeight = new Animated.Value(0);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this._top = this.state.top
                this._left = this.state.left
                this.setState({ bg: 'red' })
                this.scrool.setNativeProps({ scrollEnabled: false });
            },
            onPanResponderMove: (evt, gs) => {
                console.log(gs.dx + ' ' + gs.dy)
                this.setState({
                    top: this._top + gs.dy,
                    left: this._left + gs.dx
                })
                this.scrool.setNativeProps({ scrollEnabled: false });
            },
            onPanResponderRelease: (evt, gs) => {
                this.setState({
                    bg: 'white',
                    top: this._top + gs.dy,
                    left: this._left + gs.dx
                })
                this.scrool.setNativeProps({ scrollEnabled: true });
            }
        })
    }
    componentWillUnmount=()=> {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    componentDidMount=()=> {
        console.log('base64Database64Database64Data==', this.state.base64Data);
        let responseData = this.props.navigation.state.params.response.data.replace(/\+/g, '-').replace(/\//g, '_');
        var str = this.props.navigation.state.params.response.uri;
        var index = str.lastIndexOf("\.");
        str = str.substring(index + 1, str.length);
        this.setState({
            type: str,
            base64Data: 'data:image/' + str + ';base64,' + responseData,
        },() =>{
            // console.log('base64Database64Database64Data==', this.state.base64Data);
        });
        
    }

    //关键代码
    _onChange = (event) => {
        this.setState({
            text_comments: event.nativeEvent.text,
        });
    }

    _onLayout = (event) => {
        let { x, y, width, height } = event.nativeEvent.layout;
        console.log('width1111=====', width);
        if (width <= this.state.trueWidth) {
            console.log('width1111', width);
            console.log('this.state.trueWidththis.state.trueWidththis.state.trueWidth', this.state.trueWidth);
            console.log('<<<<<')
        } else {
        }
    }

    onContentSizeChange = (event) => {
        this.setState({
            height_comments: event.nativeEvent.contentSize.height,
        });
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
    
    PostThumb = async (item, dotop, index) => {
        this.setState({
            creatButtonFlag:true
        })
        let formData = new FormData();
        console.log('formDataformDataformDataformData=', formData);
        formData.append("name", this.state.text);
        formData.append("pic", this.state.base64Data);
        // formData.append("x",0);
        formData.append("x", this.state.left - (screenWidth - this.state.width) / 2)-10;
        // formData.append("y",0);
        formData.append("y", this.state.top+12);
        formData.append("color", this.state.color);
        formData.append("fontSize", this.state.fontSize-4);
        formData.append("width", this.state.width);
        formData.append("height", this.state.height);
        formData.append("type", this.state.type);
        console.log(formData);
        let url = 'http://www.jianjie8.com/e/api/biaoqing/?getJson=creat';
        console.log('url---=---=---',url);
        let res = await HttpUtil.POST(url, formData);
        console.log('resresresresresres=====', res);
        this.setState({
            hasResult:true,
            localCreatedPic:res.result[0].picpath,
            creatButtonFlag:false
        });
    }
    clickToShare = (type) => {
        console.log('XXXXXXXXXXXXX', urlConfig.thumbImage);
        this.close();
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                if (type === 'Session') {
                    WeChat.shareToSession({
                        imageUrl: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state.localCreatedPic,
                        titlepicUrl: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state.localCreatedPic,
                        type: 'imageUrl',
                        webpageUrl: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state.localCreatedPic
                    }).then((message) => { console.log('messagemessage', message);message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((error) => {
                        if (error.message != -2) {
                            Toast.show(error.message);
                        }
                    });
                } else {
                    WeChat.shareToTimeline({
                        imageUrl: this.state.data && this.state.data.nurl,
                        type: 'imageUrl',
                        webpageUrl: urlConfig.DetailUrl + this.state.data.classid + '/' + this.state.data.id
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

    //保存图片
    saveImg=(img)=> {
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
    clickToReport = () => {
        let url = urlConfig.ReportURL + '/' + this.state.data.classid + '/' + this.state.data.id;
        this.props.navigation.navigate('Web', { url: url });
        this.close();
    }
    renderUnCreat = () => {
        return (
            <KeyboardAvoidingView behavior='position' >
                <ScrollView ref={(ref) => { this.scrool = ref }} style={{backgroundColor:'#f5f5f5'}}>
                    <View style={styles.outerContainer}>
                        <View style={styles.container}>
                            <View style={{ alignItems: 'center', marginBottom: 10, paddingTop: 15, paddingBottom: 10, backgroundColor: '#f5f5f5', flex: 1 }}>
                                <ImageProgress
                                    source={{ uri: this.props.navigation.state.params.base64Data }}
                                    resizeMode={'contain'}
                                    indicatorProps={{
                                        size: 30,
                                        borderWidth: 1,
                                        color: 'rgba(255, 160, 0, 0.8)',
                                        unfilledColor: 'rgba(200, 200, 200, 0.1)'
                                    }}
                                    indicator={ProgressBar}
                                    style={{ width: this.props.navigation.state.params.response.width, height: this.props.navigation.state.params.response.height }} />
                                <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                    <View><Text>颜色：</Text></View>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'red' }]} onPress={() => { this.setState({ color: 'ff0000' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'blue' }]} onPress={() => { this.setState({ color: '0000ff' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'yellow' }]} onPress={() => { this.setState({ color: 'ffff00' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'pink' }]} onPress={() => { this.setState({ color: 'ffc0cb' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'black' }]} onPress={() => { this.setState({ color: '000000' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'green' }]} onPress={() => { this.setState({ color: '00ff00' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'white' }]} onPress={() => { this.setState({ color: 'ffffff' }) }}></Text>
                                    <Text style={[styles.colorSelect, { backgroundColor: 'orange' }]} onPress={() => { this.setState({ color: 'ff6600' }) }}></Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                    <View><Text>字号：</Text></View>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 14 }) }}>14</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 18 }) }}>18</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 20 }) }}>20</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 22 }) }}>22</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 24 }) }}>24</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 26 }) }}>26</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 28 }) }}>28</Text>
                                    <Text style={styles.fontSelect} onPress={() => { this.setState({ fontSize: 30 }) }}>30</Text>
                                </View>
                                <TextInput
                                    style={styles.textInputStyle}
                                    clearTextOnFocus={true}
                                    defaultValue={this.state.text}
                                    placeholder='最多输入五十个字符,不区分中英文'
                                    clearButtonMode={'always'}
                                    maxLength={50}
                                    returnKeyType={'done'}
                                    onChangeText={(text) => this.setState({ text })}
                                    onSubmitEditing={Keyboard.dismiss}
                                    multiline={true}
                                    onContentSizeChange={this.onContentSizeChange.bind(this)}
                                    {...this.props}
                                ></TextInput>
                                {this.state.creatButtonFlag ?
                                    <TouchableOpacity style={{ alignItems: 'center',marginTop:20 }} activeOpacity={0.8} onPress={() => {
                                        // this.PostThumb();
                                    }}>
                                        <View style={{ width: '90%', paddingTop: 10, paddingLeft: 30, paddingRight: 30, height: 40, backgroundColor: '#ccc', borderRadius: 8 }}>
                                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>正在努力生成</Text>
                                        </View>
                                    </TouchableOpacity> :
                                    <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }} activeOpacity={0.8} onPress={() => {
                                        this.PostThumb();
                                    }}>
                                        <View style={{ width: '90%', paddingTop: 10, paddingLeft: 30, paddingRight: 30, height: 40, backgroundColor: '#f60', borderRadius: 8 }}>
                                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>立即生成表情</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                
                                <View
                                    {...this._panResponder.panHandlers}
                                    style={[styles.rect, {
                                        position: 'absolute',
                                        top: this.state.top,
                                        left: this.state.left,
                                        borderWidth: StyleSheet.hairlineWidth,
                                        borderColor: 'black',
                                        borderStyle: 'dashed',
                                    }]}>
                                    <Text
                                        onLayout={this._onLayout}
                                        style={{ fontSize: this.state.fontSize, color: '#' + this.state.color, maxWidth: this.state.width,lineHeight:45 }}>{this.state.text}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={{ width: WIDTH, height: 50}} />
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
    renderCreated = () => {
        return (
            <ScrollView style={{ backgroundColor: '#f5f5f5' }}>
                <View style={styles.outerContainer}>
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center', marginBottom: 10, paddingTop: 15,backgroundColor:'#f5f5f5'}}>
                            <ImageProgress
                                source={{ uri: 'http://www.jianjie8.com/e/api/biaoqing/' + this.state.localCreatedPic }}
                                resizeMode={'contain'}
                                indicatorProps={{
                                    size: 30,
                                    borderWidth: 1,
                                    color: 'rgba(255, 160, 0, 0.8)',
                                    unfilledColor: 'rgba(200, 200, 200, 0.1)'
                                }}
                                indicator={ProgressBar}
                                style={{ width: this.props.navigation.state.params.response.width, height: this.props.navigation.state.params.response.height }} />
                        </View>
                        <TouchableOpacity
                            style={{ alignItems: 'center', paddingTop: 15 }}
                            onPress={() => this.setState({
                                hasResult: false,
                                creatButtonFlag: false
                            })}
                        >
                            <View style={{ width: '50%', paddingTop: 10, height: 40, backgroundColor: '#f60', borderRadius: 8 }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>重新生成表情</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ paddingTop: 30,paddingBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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
                                    this.saveImg.bind(this, 'http://www.jianjie8.com/e/api/biaoqing/' + this.state.localCreatedPic)}
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
                    </View>
                </View>
                <View style={{ width: WIDTH, height: 50}} />
            </ScrollView>
        )
    }
    render=()=> {
        return (
            <View>
                {this.state.hasResult ? this.renderCreated() : this.renderUnCreat()}
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
    outerContainer: {
        height: HEIGHT,
        // flex:1,
        // backgroundColor:'red'
    },
    container: {
        flex: 1,
        // backgroundColor:'red',
        justifyContent: 'center',
    },
    textInputStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        width: '90%',
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        height: 35,
        backgroundColor: '#FFF',
        fontSize: 14
    },
    base: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column'
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
    colorSelect: {
        width: 30, height: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc',
    },
    fontSelect: {
        width: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', backgroundColor: '#fff', textAlign: 'center'
    }
});