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
    Modal,
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
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import urlConfig from '../utils/urlConfig';
import PureModalUtil from '../utils/PureModalUtil';
import * as WeChat from 'react-native-wechat';
import HttpUtil from '../utils/HttpUtil';
import storageKeys from '../utils/storageKeyValue'
import ImageProgress from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Toast from 'react-native-root-toast';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import ImagePicker from 'react-native-image-picker';

export default class Me extends Component {
    static navigationOptions = {
        tabBarLabel: '发布表情',
        tabBarIcon: ({ tintColor, focused }) => (
            <MaterialIcons name="add" size={25} color={focused ? "#f60" : 'black'} />
        ),
        header: ({ navigation }) => {
            return (
                <ImageBackground style={{ ...header }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.navigate(null);
                    }}>
                        <View style={{ justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7, width: 20 }}>
                            {/* <IconSimple name="arrow-left" size={25} color='#282828' /> */}
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, textAlign: 'center', lineHeight: 43.7, color: '#282828' }}>发布喜欢的表情</Text>
                    <View style={{ justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7 }}></View>
                </ImageBackground>
            )
        }
    };
    shouldComponentUpdate(nextProps) {
        return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
            (nextProps.defaultValue == undefined || nextProps.defaultValue == '')) ||
            (this.props.defaultValue === nextProps.defaultValue && (nextProps.value == undefined || nextProps.value == ''));
    }
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: null,
            username: '',
            base64Data: '',
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            fontSize: 14,
            type: '',
            color: '000000',
            uri: '',
            response: ''

        };


    }

    selectPhotoTapped() {
        const options = {
            title: '请选择一个图片来源',
            takePhotoButtonTitle: '拍个照片',
            chooseFromLibraryButtonTitle: '从相册选择',
            maxWidth: 300,
            maxHeight: 300,
            cancelButtonTitle: '取消',
            quality: 1.0,
            storageOptions: {
                skipBackup: true
            }
        };
        // ImagePicker.launchCamera(options, (response) => {
        //     console.log('Response-1-1-1-1-1-1-1 =----launchCamera ', response);
        //     if (!response.data) return false;
        // });
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response-1-1-1-1-1-1-1 = ', response);
            if (!response.data) return false;
            // let responseData = response.data.replace(/\+/g, '-').replace(/\//g, '_');
            let responseData = response.data;
            var str = response.uri;
            var index = str.lastIndexOf("\.");
            str = str.substring(index + 1, str.length);
            this.setState({
                width: response.width,
                height: response.height,
                uri: response.uri,
                response: response,
                type: str,
                base64Data: 'data:image/' + str + ';base64,' + responseData,
            });


            console.log('this.state.base6===' + this.state.base64Data);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    componentWillMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.setState({
                    avatarSource: null
                })
            }
        );
    }

    componentWillUnmount() {

    }
    componentDidMount() {

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
                                    <Image style={styles.shareIcon} source={require('../assets/share_icon_wechat.png')} />
                                    <Text style={styles.spinnerTitle}>微信好友</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={() => this.clickToShare('TimeLine')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../assets/share_icon_moments.png')} />
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

    loginButtonPress = () => {
        if (this.state.username == '') {
            Toast.show('请输入表情标题', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            return false;
        }
        if (this.state.base64Data == '') {
            Toast.show('请上传图片', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            return false;
        };
        this.login();
    };
    login = async () => {
        let url = 'http://jianjie.92kaifa.com/e/DoInfo/ecms.php';
        let formData = new FormData();
        formData.append("hfrom", 'app');
        formData.append("enews", 'MAddInfo');
        formData.append("classid", '178');
        formData.append("prtype", 1);
        formData.append("mid", 7);
        formData.append("title", this.state.username);
        formData.append("tempurl", this.state.base64Data);
        formData.append("Submit", '立即发布');
        console.log('formData', formData);
        this.setState({ visble: true });
        let res = await HttpUtil.POST(url, formData);
        console.log('xxMAddInfoMAddInfoMAddInfoMAddInfoxxxx', res);
        if (!res || !res.result) {
            this.setState({ visble: false });
            //  this.ToastShow('失败');
            return;
        }
        this.setState({ visble: false });

        Toast.show(res.message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });

        this.setState({
            username:'',
            avatarSource:null
        })
    }

    userNameInputTextChange = (text) => {
        this.setState({ username: text })
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
    render (){
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={false}>
                <ScrollView style={{width: WIDTH, flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
                    <Text style={{padding: 10,marginTop:40,color:'#999' }}>您发布的内容会在24小时内审核。</Text>
                    <View style={{ marginTop: HEIGHT * 0.06, width: WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput
                            numberOfLines={1}
                            placeholder='请输入表情标题'
                            autoFocus={true}
                            placeholderTextColor='#555555'
                            style={{ width: WIDTH - 80, fontSize: 16, color: '#555555', height: 50, backgroundColor: '#fffff0', borderRadius: 10, marginHorizontal: 40, paddingHorizontal: 20 }}
                            onChangeText={this.userNameInputTextChange}
                            value={this.state.username} 
                            {...this.props}
                            underlineColorAndroid="transparent"></TextInput>
                    </View>
                    <TouchableOpacity activeOpacity={0.6} onPress={this.selectPhotoTapped.bind(this)}>
                        <View style={{width: WIDTH-80,marginTop:30, flexDirection: 'row' }}>
                            {this.state.avatarSource === null ?
                                <View>
                                    <View style={{ flexDirection: 'row',width:WIDTH-80, alignItems: 'center', height: 80, backgroundColor: '#fffff0', justifyContent: 'space-between',borderRadius:10 }}>
                                        <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialIcons name="add-a-photo" size={40} color={Color.FontColor} />
                                            <Text style={{ marginLeft: 10,marginTop:3 }}>选择照片</Text>
                                        </View>
                                    </View>
                                </View> :
                                <View>
                                    <Image source={{
                                        uri: this.state.base64Data
                                    }}
                                        style={{ width: this.state.width, height: this.state.height }}
                                    />
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.pushToWeb('yhsyxy') }}>
                        <View style={{paddingTop:20}}>
                            <Text style={{color:"#999"}}>阅读用户使用协议</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: WIDTH,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20,
                    }} activeOpacity={0.7} onPress={this.loginButtonPress}>
                        <View style={{
                            width: WIDTH - 80,
                            borderRadius: 10,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f60'
                        }}>
                            <Text style={{ fontSize: FONT(18), paddingTop: 10, paddingBottom: 10, backgroundColor: 'transparent', color: 'white', textAlign: 'center' }}>同意用户协议并发布内容</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAwareScrollView>
        )
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
    textInputStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        width: '90%',
        marginTop: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#FFF',
        fontSize: 16
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
    greyView: {
        width: 200,
        height: 200,
    },
    redView: {
        width: 20,
        height: 20,
    },
});