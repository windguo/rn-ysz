import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View,
    CameraRoll,
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


//照片获取参数
var fetchParams = {
    first: 60,
    groupTypes: 'All',
    assetType: 'Photos'
}

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
                        localPublish.js
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
            photos: null
        };
    }
    componentWillMount() {
        
    }
    componentWillUnmount() {
        
    }
    componentDidMount() {
        var _that = this;
        //获取照片
        var promise = CameraRoll.getPhotos(fetchParams)
        promise.then(function (data) {
            var edges = data.edges;
            var photos = [];
            for (var i in edges) {
                photos.push(edges[i].node.image.uri);
            }
            _that.setState({
                photos: photos
            });
        }, function (err) {
            alert('获取照片失败！');
        });
    }

    render() {
        var photos = this.state.photos || [];
        var photosView = [];
        for (var i = 0; i < 60; i += 2) {
            photosView.push(
                <View key={i}>
                    <View style={styles.sectionChild}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            this.props.navigation.navigate('localPublishMake',{
                                localPicUrl: this.state.photos[i]
                            });
                        }}>
                        <Image resizeMode="stretch" source={{ uri: photos[i] }} style={{ width: WIDTH * 0.3, height: 100, borderRadius: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sectionChild}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            this.props.navigation.navigate('localPublishMake',{
                                localPicUrl: this.state.photos[i+1]
                            });
                        }}>
                        <Image resizeMode="stretch" source={{ uri: photos[i + 1] }} style={{ width: WIDTH * 0.3, height: 100, borderRadius: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        return (
            <ScrollView>
                <View style={{ width: WIDTH, height: 10, backgroundColor: Color.f5f5f5 }} />
                <View style={styles.sectionParent}>
                    {photosView}
                </View>
            </ScrollView>
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
    sectionParent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 10
    },
    sectionChild: {
        flex: 1,
        flexBasis: WIDTH * 0.3,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom:10
    },
});