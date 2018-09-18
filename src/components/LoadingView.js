/**
 * Created by zhangzuohua on 2018/1/26.
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
} from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
export  default  class LoadingView extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        if(this.props.visible){
            return (
                <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                    <ActivityIndicator color = {"black"} animating size={"large"}/>
                </View>
            );

        }else{
            return <View/>;
        }

    }
}





