import axios from "axios";
import { message, goto } from "../redux/actionSender";

const Ask = axios.create({})

// 添加请求拦截器
Ask.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8'
    }
    //  这里要添加Token
    console.log(JSON.parse(config.data))
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
Ask.interceptors.response.use(function (response) {
    console.log('响应拦截器:',response)
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if(response.data.type == 'warning' || response.data.type == 'error'){
        message[response.data.type](response.data.message)
        // if(response.data.code == 401){
        //     message.error('未检测到Token或Token无效，请重新登录!')
        //     window.SupermeGY = ''
        //     window.SupermeGYSSS = ''
        //     goto(window.location.pathname,'/login')
        // }
    }
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // return Promise.reject(error);
    message.error(error)
});

export default Ask