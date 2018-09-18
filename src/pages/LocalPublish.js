import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import HttpUtil from '../utils/HttpUtil';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export default class App extends React.Component {

    state = {
        avatarSource: null,
        base64Data:'',
        width:100,
        height:100,
        top: 0,
        left: 0,
        fontSize: 14,
        type:'',
        color: '000000',
        uri:'',
        response:''
    };

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
            skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response-1-1-1-1-1-1-1 = ', response);
            if (!response.data) return false;
            let responseData = response.data.replace(/\+/g, '-').replace(/\//g, '_');
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


    PostThumb = async(item,dotop,index) => {
        let formData = new FormData();
        console.log('formDataformDataformDataformData=',formData);
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
        console.log('resresresresresres=====',res);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                        {this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                            this.props.navigation.navigate('localPublishMake', { 
                                x: 0, 
                                y: 0,
                                nurl:this.state.uri,
                                width:this.state.width,
                                height:this.state.height,
                                response: this.state.response
                            })
                        }
                    </View>
                </TouchableOpacity> 
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.PostThumb();
                }}>
                    {this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                        <Image style={styles.avatar} source={this.state.avatarSource} />
                    }
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    }
});
