/**
 * Created by zhangzuohua on 2018/1/22.
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
    CameraRoll,
    FlatList,
    Clipboard
} from 'react-native';
import urlConfig  from  '../utils/urlConfig';
import ModalUtil from '../utils/modalUtil';
import formatData from '../utils/formatData';
import { ifIphoneX } from '../utils/iphoneX';
import Toast from 'react-native-root-toast';
import LoadError from  '../components/loadError';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import PullList from '../components/pull/PullList'
import storageKeys from '../utils/storageKeyValue'
import * as WeChat from 'react-native-wechat';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import HttpUtil from  '../utils/HttpUtil';
import ImageProgress from 'react-native-image-progress';
import {Pie,Bar,Circle,CircleSnail} from 'react-native-progress';
import AutoHeightImage from 'react-native-auto-height-image';
import CustomImage from '../components/CustomImage'
import GuessText from  '../components/GuessText'
export default class Home extends Component {
    static navigationOptions = {
    };
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loadError:false,
            loadNewData:false,
            visible:false,
            ViewHeight:new Animated.Value(0)
        };
        //每次请求需要需要加pagenumber
        this.requestPageNumber = 1;
    }
    componentWillMount() {
        this._ViewHeight = new Animated.Value(0);
    }
    componentDidMount() {
        this.refTextArray = [];
        this.subscription = DeviceEventEmitter.addListener('reloadDataRand', this.refreshing);
        InteractionManager.runAfterInteractions(() => {
            this.loadData();
        });
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    setClipboardContent = (text,index,item) => {
        if(item.classid === '41' || item.classid === '44' || item.classid === '39'){
            return ;
        }
        try {
            let DeepCopyData = [].concat(JSON.parse(JSON.stringify(this.FlatListData)));
            DeepCopyData[index].isCopyed = true;
            this.flatList.setData(DeepCopyData);
            Clipboard.setString(item.title + "\n" + item.ftitle);
            Toast.show('复制成功', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }catch (e){this.ToastShow(e.message)}
    }

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
                            imageUrl: this._shareItem && this._shareItem.nurl,
                            titlepicUrl: this._shareItem && this._shareItem.titlepic,
                            type: 'imageUrl',
                            webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id
                        }).then((message) => { message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    } else if (data.wechat === 2) {
                        WeChat.shareToSession({
                            imageUrl: this._shareItem && this._shareItem.nurl,
                            titlepicUrl: this._shareItem && this._shareItem.titlepic,
                            type: 'imageUrl',
                            webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id
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
    // 报告错误
    clickToReport = () => {
        let url = urlConfig.ReportURL + '/' + this._shareItem.classid + '/' + this._shareItem.id;
        this.props.navigation.navigate('Web', {url:url});
        this.close();
    }
    // 添加到收藏
    clickToFavas = (classid, id) => {
        let url = urlConfig.FavasURL + '/' + classid + '/' + id;
        if (global.userInfo) {
            this.props.navigation.navigate('Web', { url: url });
        } else {
            this.props.navigation.navigate('Login');
        }
    }
    pushToUrls = (url) => {
        if (url) {
            Linking.openURL(url)
                .catch((err) => {
                    console.log('An error occurred', err);
                });
        }
    }
    clickToShare = (type) => {
        console.log('XXXXXXXXXXXXX', urlConfig.thumbImage);
        this.close();
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                if (type === 'Session') {
                    WeChat.shareToSession({
                        imageUrl: this._shareItem && this._shareItem.nurl,
                        titlepicUrl: this._shareItem && this._shareItem.titlepic,
                        type: 'imageUrl',
                        webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id
                    }).then((message) => { message.errCode === 0 ? this.ToastShow('分享成功') : this.ToastShow('分享失败') }).catch((e) => {
                        if (error.message != -2) {
                            Toast.show(error.message);
                        }
                    });
                } else {
                    WeChat.shareToTimeline({
                        imageUrl: this._shareItem && this._shareItem.nurl,
                        titlepicUrl: this._shareItem && this._shareItem.titlepic,
                        type: 'imageUrl',
                        webpageUrl: urlConfig.DetailUrl + this._shareItem.classid + '/' + this._shareItem.id
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
    renderSpinner = (text) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {this.setState({visible: false});}}>
                <View key="spinner" style={styles.spinner}>
                    <Animated.View style={{  justifyContent: 'center',
                        width:WIDTH,
                        height: this._ViewHeight,
                        backgroundColor: '#fcfcfc',
                        position:'absolute',
                        left:0,
                        right:0,
                        bottom:0,
                        overflow:'hidden'}}>
                        <View style={styles.shareParent}>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToShare('Session')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../assets/share_icon_wechat.png')} />
                                    <Text style={styles.spinnerTitle}>微信好友</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToShare('TimeLine')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../assets/share_icon_moments.png')} />
                                    <Text style={styles.spinnerTitle}>微信朋友圈</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToReport()}
                            >
                                <View style={styles.shareContent}>
                                    <IconSimple name="exclamation" size={40} color='black'/>
                                    <Text style={styles.spinnerTitle}>举报</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:10,backgroundColor:'#f5f5f5'}}></View>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <Text style={{ fontSize: 16, color: 'black',textAlign: 'center' }}>取消</Text>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
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

    show = (item)=>{
        this._shareItem = item;
        if(Platform.OS==='android'){
            this.share()
            return;
        }
        this._ViewHeight.setValue(0);
        this.setState({
            visible:true
        },  Animated.timing(this._ViewHeight, {
            fromValue:0,
            toValue: 140, // 目标值
            duration: 200, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start());
    };


    close = ()=>{
        this.setState({
            visible:false
        });
    };
    dealWithrequestPage = () =>{
        return  this.requestPageNumber > 1 ? '&page=' + this.requestPageNumber : ''
    }

    loadData = async(resolve)=>{
        let url = '';
        if (!this.props.data) {
            return;
        }
        switch (this.props.data.classid) {
            case '0':
                url =  urlConfig.sectionListDataTouxiang + '&classid=' + this.props.data.classid;;
                break;
            default:
                url = this.isNotfirstFetch ?  urlConfig.sectionListDataTouxiang + '&classid=' + this.props.data.classid : urlConfig.sectionListDataTouxiang + '&classid=' + this.props.data.classid;
        }
        console.log('loadUrl',url);
        let res = await HttpUtil.GET(url);
        resolve && resolve();
        if(!res||!res.result){
            READ_CACHE(storageKeys.homeList + 'page' + this.props.index,(res)=>{
                if (res && res.length > 0) {
                    this.flatList && this.flatList.setData(res, 0);
                    this.FlatListData = res;
                }else{}
            },(err)=>{
            });
            return;
        }
        if (this.props.index !== 0){ this.isNotfirstFetch = true};
        let result = res.result ? res.result:[];
        WRITE_CACHE(storageKeys.homeList + 'page' + this.props.index,result);
        this.flatList && this.flatList.setData(this.dealWithLongArray(result), 0);
        console.log('res', res);
    };

    dealWithLongArray = (dataArray) => {
        // let waitDealArray = this._shareItem.concat(dataArray);
        //下拉刷新来几条数据，就对应的删除几条数据 ，以便填充
        let initArray = [];
        // console.log('789', sbArray);
        if (this.FlatListData){
            if (this.FlatListData.length > dataArray.length ){
                initArray = this.FlatListData.slice(dataArray.length,this.FlatListData.length);
            }else{
                initArray = [];
            }
        }
        let waitDealArray = dataArray.concat(initArray).filter((value)=>{return !(!value || value === "");});
        if (waitDealArray.length >= 50) {
            waitDealArray = waitDealArray.slice(0, 50);
            console.log('处理过的array', waitDealArray);
        }
        this.FlatListData = waitDealArray;
        return waitDealArray;
    }
    dealWithLoadMoreData = (dataArray) => {
        // let waitDealArray = this._shareItem.concat(dataArray);
        console.log('loadMoreData',dataArray);
        let waitDealArray =this.FlatListData.concat(dataArray).filter((value)=>{return !(!value || value === "");});
        console.log('loadMoreDatacontact',waitDealArray);
        if (waitDealArray.length >= 50) {
            waitDealArray = waitDealArray.slice(waitDealArray.length -50, waitDealArray.length);
            console.log('处理过的array', waitDealArray);
        }
        this.FlatListData = waitDealArray;
        return waitDealArray;
    }
    refreshing = () => {
        if (this.props.index === global.activeTab){
            this.flatList.scrollToOffset({ offset: 0, animated: true });
            this.flatList.BeginRefresh();
        }
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

    PostThumb = async(item,dotop,index) => {
        try {
            let upDownData = [].concat(JSON.parse(JSON.stringify(this.FlatListData)));
            if (dotop === 0) {
                upDownData[index].isUnLike = true;
                upDownData[index].diggbot = (parseInt(upDownData[index].diggbot) - 1).toString();

            }
            if (dotop === 1) {
                upDownData[index].isLike = true;
                upDownData[index].diggtop = (parseInt(upDownData[index].diggtop) + 1).toString();
            }

            let url = '';
            if (dotop === 0) {
                url =  urlConfig.thumbDownUrl;
            } else if (dotop === 1) {
                url =  urlConfig.thumbUpUrl;
            }
            //不用formdate后台解析不出来
            let formData = new FormData();
            formData.append("id", item.id);
            formData.append("classid", item.classid);
            formData.append("dotop", '' + dotop);
            formData.append("doajax", '' + 1);
            formData.append("ajaxarea", "diggnum");
            let res = await HttpUtil.POST(url,formData,'dotop');
            if (!res){
                this.ToastShow('失败');
                return ;
            }
            let message = '';
            let array = res._bodyInit.split('|');
            if (array.length > 0) {
                message = array[array.length - 1];
            }
            if (message === '谢谢您的支持' || message === '谢谢您的意见') {
                this.flatList.setData(upDownData);
                //只能操作数据源修改列表数据  很大的损耗啊
                this.FlatListData = upDownData;
            }
            this.ToastShow(message);
        }catch (e){}
    }
    renderTextAndImage = (item, index) => {
        return (
            <View style={styles.sectionChild}>
                <Image source={{ uri: item.nurl }} style={{ width: WIDTH * 0.3, height: 100 }} />
            </View>
        )
    }
    _renderItem = ({ item, index }) => {
        if (item.adType && item.picUrl) {
            return <TouchableOpacity activeOpacity={0.8} onPress={() => {
                this.pushToUrls(item.goUrl)
            }}>
                <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }}>
                    {item.picUrl ? <ImageProgress
                        source={{ uri: item.picUrl }}
                        resizeMode={'cover'}
                        style={{ width: WIDTH - 40, height: 50 }} /> : null}
                </View>
            </TouchableOpacity>
        }
        return (
            <View style={styles.sectionParent}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.props.navigation.navigate('TouxiangDetail', { id: item.id, title: item.title, nurl: item.nurl, classid: item.classid });
                }}>
                    {this.renderTextAndImage(item, index)}
                </TouchableOpacity>
            </View>
        )
    }

    onPullRelease = async (resolve) => {
        this.loadData(resolve);
    };





    loadMore = async()=>{
        let url = '';
        this.requestPageNumber += 1;
        if (!this.props.data) {
            return;
        }
        switch (this.props.data.classid) {
            case '0':
                url =  urlConfig.sectionListDataTouxiang + '&classid=' + this.props.data.classid + this.dealWithrequestPage();
                break;
            default:
                url = this.isNotfirstFetch ? urlConfig.sectionListDataTouxiang + '&classid=' + this.props.data.classid +  this.dealWithrequestPage():urlConfig.sectionListDataTouxiang + '&classid=' + this.props.data.classid+ this.dealWithrequestPage();

        }
        let res = await HttpUtil.GET(url);
        if(!res||!res.result){
            return;
        }
        let result = res.result ? res.result:[];
        this.flatList && this.flatList.setData(this.dealWithLoadMoreData(result));
        console.log('res', res);
    };

    _keyExtractor = (item, index) => index;
    render() {
        return (
            <View style={styles.wrap} >
                <View style={{ width: WIDTH, height: 10, backgroundColor: Color.f5f5f5 }} />
                <PullList
                    //  data={this._shareItem}
                    keyExtractor={this._keyExtractor}
                    onPullRelease={this.onPullRelease}
                    renderItem={this._renderItem}
                    onEndReached={this.loadMore}
                    style={{backgroundColor: Color.f5f5f5}}
                    ref={(c) => {this.flatList = c}}
                    ifRenderFooter={true}
                />
                <ModalUtil
                    visible = {this.state.visible}
                    close = {this.close}
                    contentView = {this.renderSpinner}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    sectionParent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingBottom: 10
    },
    sectionChild: {
        flex: 1,
        flexBasis: WIDTH * 0.3,
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    wrap: {
        flex: 1,
        ...ifIphoneX({
            backgroundColor: '#fff',
            paddingBottom: 30
        }, {

            }),
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
    }
});