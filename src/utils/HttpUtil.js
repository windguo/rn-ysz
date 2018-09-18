
import {DeviceEventEmitter,Alert,NetInfo,Platform,Dimensions} from 'react-native';
import Toast from 'react-native-root-toast'
import RNFetchBlob from 'react-native-fetch-blob'
import _fetch from './_fetch'
const deviceWidth = Dimensions.get('window').width;      //设备的宽度
const deviceHeight = Dimensions.get('window').height;
const OS = Platform.OS==='ios'?'iOS':'Android';
const ContentType  = Platform.OS === 'ios' ? 'application/json' :  'multipart/form-data';
const baseParams = {
    'credentials': 'include',
    'Accept': 'application/json',
    'Content-Type': ContentType,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
};
const TIMEOUT = 30000;
const CONFIG = {timeout:TIMEOUT,followRedirects:false};
GLOBAL.BaseCode = 0;
export default class HttpRequest {

    static flag = true;
    static NetFlag = true;
    //监听网络连接状态
    static async checkNet(){
        let isNet ={};
        if(HttpRequest.NetFlag){
            HttpRequest.NetFlag = false;
            isNet = await fetch("https://www.baidu.com").then((res)=>{
                console.log('有网络',res);
                HttpRequest.NetFlag = true;
                return true;
            }).catch((err)=>{
                console.log('没有网络',err);
                DeviceEventEmitter.emit('data', 'NoNetWork');//跳转到没有网路界面
                setTimeout(()=>{HttpRequest.NetFlag = true;},3000);
                return false;
            });
            return isNet;
        };
    }

    static baseUrl(){
        console.log("baseUrl BaseCode",GLOBAL.BaseCode);
        switch(parseInt(GLOBAL.BaseCode)){
            case 0:
                return "http://www.jianjie8.com";
            case 1:
                return "http://hk.jianjie8.com";

        }
        // return 'http://www.jianjie8.com';
    }

    static async GETtype(url,headers) {
        console.log('GETtype url',url);
        let res = await RNFetchBlob.config({fileCache:true,...CONFIG}).fetch('GET',url,{
            ...baseParams,
            ...headers
        }).then((res)=>{
            console.log('res',res);
            let type = res.respInfo.headers['Content-Type'];
            console.log('type',type);
            if(type.indexOf('image')>=0){
                return true;
            }
            return false;
        }).catch(async (err) => {
            console.log('发生意外');
            if (err.message.indexOf('timed out') >= 0) {
                Toast.show('请求超时', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                return false;
            }
            let check = await HttpRequest.checkNet();
            if (!check) {
                return false;
            }

            return false;
        });
        return res;
    }

    static async GET(url,headers) {
        url = url.indexOf("http://m.jianjie8.com")>=0?url:HttpRequest.baseUrl()+url;

        // url = HttpRequest.baseUrl()+url;
        url = encodeURI(url);
       // url = 'http://www.jianjie8.com/e/api/?getJson=test';
        console.log('GET url',url);
        let res = await RNFetchBlob.config({fileCache:true,...CONFIG}).fetch('GET',url + '&ad=1',{
            ...baseParams,
            ...headers
        }).then((res)=>{
            console.log('search res',res);
            console.log('res.json',res.json());
            return res.json();
        }).catch(async (err) => {
            //检测是否有网络
            let check = await HttpRequest.checkNet();
            if (!check) {
                return false;
            }
            // console.log("GET 打印这里111");
            //检测是否超时
            if (err.message.indexOf('timed out') >= 0) {
                Toast.show('请求超时', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                return false;
            }
            // console.log("GET 打印这里22222222");

            //切换服务器
          //  GLOBAL.BaseCode = (parseInt(GLOBAL.BaseCode)+1)%2;
          //  console.log("GET BaseCode",GLOBAL.BaseCode);
            //检测数据格式
            if(err.message.indexOf('JSON') >= 0) {
                Toast.show('请求失败', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: false,
                    delay: 0
                });
                return false;
            }

            Toast.show('请求失败', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: false,
                delay: 0
            });
            console.log('其他错误',err.message);
            return false;
        });
        console.log('res',res);
       // HttpRequest.emitData(res);
        return res;
    }

    static async POST(url, params,type) {
        // url = url.indexOf("http://m.jianjie8.com")>=0?url:HttpRequest.baseUrl()+url;
        // url = HttpRequest.baseUrl()+url;
       let res = _fetch(fetch(url,{
                method: 'POST',
                headers: {...baseParams},
                body: params
            }),30000).then((res) => {
           console.log('活久见',res);
           let result;
           type ? result = res : result = res.json();
                return result;
            }).catch(async(err) => {
           if(err.message.indexOf('timed out') >= 0) {
               Toast.show('请求超时', {
                   duration: Toast.durations.LONG,
                   position: Toast.positions.BOTTOM,
                   shadow: true,
                   animation: true,
                   hideOnPress: false,
                   delay: 0
               });
               return false;
           }

           let check = await HttpRequest.checkNet();
           if (!check) {
               return false;
           }

           //切换服务器
         //  GLOBAL.BaseCode = (parseInt(GLOBAL.BaseCode)+1)%2;
        //   console.log("POST BaseCode",GLOBAL.BaseCode);

           if(err.message.indexOf('Unexpected') >= 0) {
               Toast.show('失败', {
                   duration: Toast.durations.LONG,
                   position: Toast.positions.BOTTOM,
                   shadow: true,
                   animation: true,
                   hideOnPress: false,
                   delay: 0
               });
               return false;
           }

           Toast.show('失败', {
               duration: Toast.durations.LONG,
               position: Toast.positions.BOTTOM,
               shadow: true,
               animation: true,
               hideOnPress: false,
               delay: 0
           });
           console.log('其他错误',err.message);
           return false;
            });
        return res;
    }





    static emitData(res){
        if(res.status==='999999'&&res.message.indexOf('登录')>-1){
            if(HttpRequest.flag){
                HttpRequest.flag = false;
                console.log('丢失cookie跳到登录页面');
                DeviceEventEmitter.emit('data', 'Login');
                setTimeout(()=>{HttpRequest.flag = true;},2000)
            }
        }
    }

    static async POSTIMAGE(url,imageSource, headers, security) {
        let formData = new FormData();
        let file = [];
        for(let i=0;i<imageSource.length;i++){
            file = {uri: imageSource[i], type: 'application/octet-stream', name: 'image.jpg'};
        }
        formData.append('file', file);
        let HEADERS = {
            'Accept': 'application/json',
            'source': 'app',
            'Content-Type' :'multipart/form-data',
            'Uni-Source':'OA/Server(PHP)',//上传图片需要的参数
        };
        let result = await fetch(url, {
            method: 'POST',
            headers: {
                ...HEADERS,
                ...headers,
            },
            body: formData
        }).then((response) => response.json()).catch((error) => {
            console.log('error', error);
        });
        HttpRequest.emitData(result);
        return result;
    }

    static async POSTImage(url, params,headers) {
        console.log('url',url);
        console.log('params', params);
        let data = [];
        for(let i=0;i<params.length;i++){
            data.push({file:{uri:params[i],type:'application/octet-stream', name: 'image.jpg'},})
        }
        console.log('images', data);
        let res = await RNFetchBlob.config(CONFIG).fetch('POST',url, {
            ...headers,
            'Accept': 'application/json',
            'source': 'app',
            'Content-Type' :'multipart/form-data',
            'Uni-Source':'OA/Server(PHP)',//上传图片需要的参数
        }, data)
            .uploadProgress((written, total) => {
                console.log('uploaded', written / total)
            })
            // listen to download progress event
            .progress((received, total) => {
                console.log('progress', received / total)
            })
            .then((res) => {
                console.log('res.json', res.json());
                return res.json();
            }).catch(async (err) => {
                let check = await HttpRequest.checkNet();
                console.log('check', check);
                if (!check) {
                    return false;
                }
                if(err.message.indexOf('timed out') >= 0) {
                    Toast.show('请求超时', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: false,
                        delay: 0
                    });
                    return false;
                }
                return false;
            });
        HttpRequest.emitData(res);
        console.log('res', res);
        return res;
    }
}


