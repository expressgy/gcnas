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
    //  User
    getUserInfo : async info => {return Ask.post('./askgy/home/getUserInfo',info)},
    updateUserInfo : async info => {return Ask.post('./askgy/home/updateUserInfo',info)},
    updateUserPass : async info => {return Ask.post('./askgy/home/updateUserPass',info)},
    //  System
    //      turn
    getTurnData : async info => {return Ask.post('./askgy/home/getTurnData',info)},
    addTurnData : async info => {return Ask.post('./askgy/home/addTurnData',info)},
    editTurnData : async info => {return Ask.post('./askgy/home/editTurnData',info)},
    deleteTurnData : async info => {return Ask.post('./askgy/home/deleteTurnData',info)},
    //      Nas
    getNasData : async info => {return Ask.post('./askgy/home/getNasData',info)},
    addNasData : async info => {return Ask.post('./askgy/home/addNasData',info)},
}

export default AskGY