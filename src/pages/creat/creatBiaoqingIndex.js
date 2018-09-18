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
import * as WeChat from 'react-native-wechat';
import HttpUtil from '../../utils/HttpUtil';
import storageKeys from '../../utils/storageKeyValue'
import ScrollTabView from "../ScrollTabView";
import ImageProgress from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import ImagePicker from 'react-native-image-picker';

export default class Me extends Component {
    static navigationOptions = {
        tabBarLabel: 'DIY表情',
        tabBarIcon: ({ tintColor, focused }) => (
            <MaterialIcons name="child-care" size={25} color={focused ? "#f60" : 'black'} />
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
                    <Text style={{ fontSize: 16, textAlign: 'center', lineHeight: 43.7, color: '#282828' }}>DIY表情-展示独特的自己</Text>
                    <View style={{ justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7 }}></View>
                </ImageBackground>
            )
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: null,
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
            title:'请选择一个图片来源',
            takePhotoButtonTitle:'拍个照片',
            chooseFromLibraryButtonTitle:'从相册选择',
            maxWidth:300,
            maxHeight:300,
            cancelButtonTitle:'取消',
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


            // console.log('this.state.base6===' + this.state.base64Data);

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


    PostThumb = async (item, dotop, index) => {
        let formData = new FormData();
        console.log('formDataformDataformDataformData=', formData);
        formData.append("pic", this.state.base64Data);
        formData.append("x", this.state.left - (screenWidth - this.state.width) / 2);
        formData.append("y", this.state.top);
        formData.append("color", this.state.color);
        formData.append("fontSize", this.state.fontSize);
        formData.append("width", this.state.width);
        formData.append("height", this.state.height);
        formData.append("type", this.state.type);
        console.log(formData);
        let url = 'http://www.jianjie8.com/e/api/biaoqing/?getJson=creat';
        let res = await HttpUtil.POST(url, formData);
        console.log('resresresresresres=====', res);
    }
    componentWillMount() {
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                this.setState({
                    avatarSource:null
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

    render() {
        return (
            <View>
                <View style={{ width: WIDTH, height: 10, backgroundColor: Color.f5f5f5 }} />
                <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.navigate('ScrollTabViewRand') }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'white', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <IconSimple name="globe-alt" size={22} color={Color.FontColor} />
                            <Text style={{ marginLeft: 10 }}>表情模版生成</Text>
                        </View>
                        <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{ marginRight: 20 }} />
                    </View>
                </TouchableOpacity>
                <View style={{ width: WIDTH, height: 10, backgroundColor: Color.f5f5f5 }} />
                <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.navigation.navigate('OnlyTextCreat') }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'white', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="text-fields" size={22} color={Color.FontColor} />
                            <Text style={{ marginLeft: 10 }}>纯文字表情生成</Text>
                        </View>
                        <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{ marginRight: 20 }} />
                    </View>
                </TouchableOpacity>
                <View style={{ width: WIDTH, height: 10, backgroundColor: Color.f5f5f5 }} />
                <TouchableOpacity activeOpacity={0.6} onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                        {this.state.avatarSource === null ? 
                        <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'white', justifyContent: 'space-between' }}>
                                    <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <IconSimple name="cloud-upload" size={22} color={Color.FontColor} />
                                        <Text style={{ marginLeft: 10 }}>拍照+选择相册</Text>
                                    </View>
                                    <IconSimple name="arrow-right" size={18} color={Color.FontColor} style={{ marginRight: 20 }} />
                                </View>
                        </View> :
                            this.props.navigation.navigate('localPublishMake', {
                                x: 0,
                                y: 0,
                                nurl: this.state.uri,
                                width: this.state.width,
                                height: this.state.height,
                                base64Data: this.state.base64Data,
                                response: this.state.response
                            })
                        }
                    </View>
                </TouchableOpacity>
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
    textInputStyle:{
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#ccc',
        width:'90%',
        marginTop:15,
        borderRadius:8,
        padding:10,
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
    greyView: {
        width: 200,
        height: 200,
    },
    redView: {
        width: 20,
        height: 20,
    },
});