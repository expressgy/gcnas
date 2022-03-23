import Ask from "./index";


const AskGY = {
    /**
     * 注册模块
     * */
    //  用户名查重
    checkDuplicateForUsername : async info => {return Ask.post('/askgy/sign/checkDuplicateForUsername',info)},
    //  发送邮件验证码
    sendEmailCode : async info  => {return Ask.post('/askgy/sign/sendEmailCode',info)},
    //  注册账号
    veriEmailCode : async info  => {return Ask.post('/askgy/sign/veriEmailCode',info)},

    /**
     * 登录模块
     * */
    cheakPassword : async info => {return Ask.post('./askgy/login/checkPassword',info)},
    /**
     * Home模块
     * */

    /**
     * ********* Home Setting
     * */
    getUserInfo : async info => {return Ask.post('./askgy/home/getUserInfo',info)}
}

export default AskGY