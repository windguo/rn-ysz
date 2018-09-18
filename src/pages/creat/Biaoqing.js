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
                        {navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.title.substring(0,14)}...
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
            bg:'',
            trueWidth: 150,
            trueHeight: 150,
            text: '请在下方输入框输入内容',
            // text: this.props.navigation.state.params.title,
            fontSize:16,
            width: 100,
            height:100,
            keyBoardIsShow:false,
            text_comments:'',
            color:'000000'
        };
    }
    lostBlur() {
        //退出软件盘
        if (keyBoardIsShow) {
            Keyboard.dismiss();
        }
    }
    _keyboardDidShow() {
        // this.setState({
        //     keyBoardIsShow:true
        // })
    }

    _keyboardDidHide() {
        // this.setState({
        //     keyBoardIsShow: false
        // })
    }

    componentWillMount() {
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
    componentWillUnmount() {
        
        this.subscription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove(); 
    }
    componentDidMount() {
        this.loadContentData();
        this.subscription = DeviceEventEmitter.addListener('LoginSuccess', this.LoginSuccess);
        setTimeout(() => { GLOBAL.userInfo && this.setState({ username: GLOBAL.userInfo.username }) }, 500);
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.getImagesSize();
            }
        );
    }

    getImagesSize = () =>{
        Image.getSize(this.state.data.nurl, (width, height) => {
            //width 图片的宽度 Math.floor向下取整
            //height 图片的高度
            let proportion = screenWidth;
            let myHeight = Math.floor(screenWidth / width * height);
            console.log('screenWidthscreenWidthscreenWidthscreenWidthscreenWidth', screenWidth);
            console.log('trueWidthtrueWidthtrueWidth', width);
            console.log('7=====', width > screenWidth ? screenWidth : width);
            this.setState({ width: proportion, height: myHeight, trueWidth: width > screenWidth ? screenWidth : width, trueHeight: height });
        })
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
        let url = urlConfig.DetailUrl + '&id=' + this.props.navigation.state.params.id;
        console.log('loadUrlloadUrlloadUrlloadUrlloadUrl', url);
        let res = await HttpUtil.GET(url);
        console.log(res);
        resolve && resolve();
        if (this.props.index !== 0) { this.isNotfirstFetch = true };
        let result = res.result ? res.result : [];
        console.log('result===', result);
        this.setState({
            data: result,
        });
        console.log('res', res);
    };

    //关键代码
     _onChange(event) {
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

    onContentSizeChange(event) {
        this.setState({
            height_comments: event.nativeEvent.contentSize.height,
        });
    }
    render() {
        return (
            <KeyboardAvoidingView behavior='position' >
                <ScrollView ref={(ref) => { this.scrool = ref }}>
                <View style={styles.outerContainer}>
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center', marginBottom: 10,paddingTop:15,paddingBottom:10,backgroundColor:'#f5f5f5',flex:1 }}>
                            <ImageProgress
                                source={{ uri: this.state.data.nurl }}
                                resizeMode={'cover'}
                                indicatorProps={{
                                    size: 30,
                                    borderWidth: 1,
                                    color: 'rgba(255, 160, 0, 0.8)',
                                    unfilledColor: 'rgba(200, 200, 200, 0.1)'
                                }}
                                indicator={ProgressBar}
                                style={{ width: this.state.trueWidth, height: this.state.trueHeight }} />
                            <View style={{flexDirection:'row',paddingTop:15}}>
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
                            <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }} activeOpacity={0.8} onPress={() => {
                                this.props.navigation.navigate('creatBiaoqingResult', {
                                    id: this.state.data.id,
                                    title: this.state.text,
                                    nurl: this.state.data.nurl,
                                    x: this.state.left - (screenWidth - this.state.trueWidth) / 2,
                                    y: this.state.top,
                                    color: this.state.color,
                                    fontSize: this.state.fontSize,
                                    width: this.state.trueWidth,
                                    height: this.state.trueHeight,
                                    classid: this.state.data.classid
                                });
                            }}>
                                <View style={{ width: '90%', paddingTop:10,paddingLeft:30,paddingRight:30,height:40, backgroundColor: '#f60', borderRadius: 8 }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>立即生成表情</Text>
                                </View>
                            </TouchableOpacity>
                            <View
                                {...this._panResponder.panHandlers}
                                style={[styles.rect, {
                                    position: 'absolute',
                                    top: this.state.top,
                                    left: this.state.left,
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor:'black',
                                    borderStyle: 'dashed',
                                }]}>
                                    <Text
                                        onLayout={this._onLayout}
                                        style={{ fontSize: this.state.fontSize,color:'#' + this.state.color,maxWidth:this.state.trueWidth-20,lineHeight:45 }}>{this.state.text}</Text>
                            </View>
                            
                        </View>
                        <PureModalUtil
                            visible={this.state.visible}
                            close={this.close}
                            contentView={this.renderSpinner} />
                    </View>
                </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    textInputStyle:{
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#ccc',
        width:'90%',
        borderRadius:8,
        padding:10,
        marginTop:20,
        height:35,
        backgroundColor: '#FFF',
        fontSize:16
    },
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
    colorSelect:{
        width: 30, height: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc',
    },
    fontSelect:{
        width: 30,  borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc',backgroundColor:'#fff',textAlign:'center'
    }
});