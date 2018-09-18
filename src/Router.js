/**
 * Created by zhangzuohua on 2018/1/22.
 */
import React, {Component} from 'react';
import {
    Platform,
    View,
    I18nManager,
    TouchableOpacity,
    Easing,
    StatusBar,
    Animated,
    DeviceEventEmitter,
    Image,
} from 'react-native';
import {StackNavigator,TabNavigator} from 'react-navigation';
import Detail from './pages/Detail';
import add from './pages/Add';
import web from './pages/web';
import Home from './pages/Home';
import ScrollTabView from './pages/ScrollTabView';
import LocalPublish from './pages/LocalPublish';
import ScrollTabViewRand from './pages/ScrollTabViewRand';
import ScrollTabViewBiaoqingbao from './pages/ScrollTabViewBiaoqingbao';
import ScrollTabViewTouxiang from './pages/ScrollTabViewTouxiang';
import TouxiangDetail from './pages/TouxiangDetail';
import creatBiaoqingIndex from './pages/creat/creatBiaoqingIndex';
import creatBiaoqing from './pages/creat/Biaoqing';
import localPublish from './pages/creat/localPublish';
import OnlyTextCreat from './pages/creat/OnlyTextCreat';
import localPublishMake from './pages/creat/localPublishMake';
import creatBiaoqingResult from './pages/creat/Result';
import Tab from './components/Tab'
import Login from  './pages/Login'
import SearchTag from './pages/Search/index';
import Search from './pages/Search/search';
import My from './pages/My/Index';
import Publish from './pages/My/Publish'
import LocalCollection from './pages/LocalCollection'
import LocalBiaoqingCollection from './pages/LocalBiaoqingCollection'
import LocalTouxiangCollection from './pages/LocalTouxiangCollection'
import User from './pages/User'
const tabbaroption = {
    activeTintColor: 'red',
    inactiveTintColor: '#999999',
    showIcon: true,
    style: {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    indicatorStyle: {
        opacity: 0
    },
    iconStyle:{
        paddingBottom:0,
        paddingTop:0,
        padding:0,
        marginTop:0,
        marginBottom:0,
        width:SCALE(40),
        height:SCALE(40),
    },
    labelStyle:{
        paddingTop:0,
        paddingBottom:SCALE(10),
        marginTop:0,
        padding:0,
        fontSize:FONT(10),
        color:'#888888'
    },
    tabStyle: {
        height:Platform.OS==='ios'?SCALE(98):SCALE(100),
        justifyContent:'center',
        alignItems:'center'
    }
};

const _configureTransition = () => {
    return {
        duration: 100,
        timing: Animated.spring,
        tension: 800,
        friction: 100,
    };
}
const TabNavigaApp = TabNavigator({
    New: { screen: ScrollTabView },
    creatBiaoqingIndex: { screen: creatBiaoqingIndex },
    add: { screen: add },
    LocalBiaoqingCollection: { screen: LocalBiaoqingCollection },
    My:{screen: My},
},{
    lazy: true,
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: tabbaroption,
    configureTransition:()=>_configureTransition(),
    tabBarComponent:props => <Tab {...props}/>
});
const NavgationApp = StackNavigator({
    Home: {screen: Home},
    Index: {screen: TabNavigaApp},
    Detail: {screen: Detail},
    Web: {screen: web},
    localPublish: { screen: localPublish },
    OnlyTextCreat: { screen: OnlyTextCreat },
    localPublishMake: { screen: localPublishMake },
    ScrollTabViewRand: { screen: ScrollTabViewRand },
    Touxiang: { screen: ScrollTabViewTouxiang },
    LocalPublish: { screen: LocalPublish },
    creatBiaoqingIndex: {screen: creatBiaoqingIndex},
    Login: {screen: Login},
    creatBiaoqing: {screen: creatBiaoqing},
    add: {screen: add},
    creatBiaoqingResult: {screen: creatBiaoqingResult},
    Publish: {screen: Publish},
    TouxiangDetail: {screen: TouxiangDetail},
    LocalBiaoqingCollection: {screen: LocalBiaoqingCollection},
    LocalTouxiangCollection: {screen: LocalTouxiangCollection},
    LocalCollection: {screen: LocalCollection},
    User: {screen: User},
    SearchTag: {screen: SearchTag},
    Search:{screen:Search}
}, {initialRouteName: 'Index'});
export default class Router extends React.Component {
    render() {
        return <NavgationApp/>;
    }
}