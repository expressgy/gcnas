import React, {useState, useEffect} from 'react';
import {message} from "../../redux/actionSender";
import AskGY from "../../request/api"


import gcss from './index.module.scss'
import {useNavigate} from "react-router-dom";

export default function Sign(){
    const [username,setUsername] = useState('');
    const [passwd1,setPasswd1] = useState('');
    const [passws2,setPasswd2] = useState('');
    const [nickname,setNick] = useState('');
    const [email,setEmail] = useState('');
    const [code,setCode] = useState('');

    //  判断邮箱格式正则表达式
    const reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;


    const navigate = useNavigate();


    function handleChangeForUsername(event){
        console.log(event)
        if(event.target.value.length > 128 ){
            message.warning('用户名长度超限')
            setUsername(username)
            return false
        }else{
            setUsername(event.target.value)
        }
    }
    function handleChangeForPasswd1(event){
        if(event.target.value.length > 256 ){
            message.warning('密码长度超限')
            setPasswd1(passwd1)
            return false
        }else{
            setPasswd1(event.target.value)
        }
    }
    function handleChangeForPasswd2(event){
        if(event.target.value.length > 256 ){
            message.warning('密码长度超限')
            setPasswd2(passws2)
            return false
        }else{
            setPasswd2(event.target.value)
        }
    }
    function handleChangeForNick(event){
        if(event.target.value.length > 32 ){
            message.warning('昵称长度超限')
            setNick(nickname)
            return false
        }else{
            setNick(event.target.value)
        }
    }
    function handleChangeForEmail(event){
        if(event.target.value.length > 128 ){
            message.warning('邮箱长度超限')
            setEmail(email)
            return false
        }else{
            setEmail(event.target.value)
        }
    }
    function handleChangeForCode(event){
        if(event.target.value.length > 8 ){
            message.warning('验证码长度超限')
            setCode(code)
            return false
        }else{
            setCode(event.target.value)
        }
    }
    function showSend(){
        if(reg.test(email)){
            return (<div onClick={send}>Send</div>)
        }else{
            return (``)
        }
    }
    async function send(){
        //  用户名查重
        const responseData = await AskGY.checkDuplicateForUsername({username})
        console.log(responseData)
        if(responseData.type == 'success'){
            //  发送验证码
            const responseData2 = await AskGY.sendEmailCode({username,email})
            if(responseData2.type == 'success'){
                message.success(responseData2.message)
            }
        }
    }
    async function go(){
        if(username.length < 8){
            message.warning('用户名长度需大于8位')
            return false
        }else if(passwd1.length < 8){
            message.warning('密码长度需大于8位')
            return false
        }else if(passwd1 != passws2){
            message.warning('两次驶入的密码需要一致')
            return false
        }else if(!reg.test(email)){
            message.warning('邮箱格式错误')
            return false
        }else if(code.length < 4){
            message.warning('请输入邮箱验证码Code')
            return false
        }

        // 前往注册
        const responseData = await AskGY.veriEmailCode({
            username,
            password:passwd1,
            email,
            code,
            nickname
        })
        if(responseData.type == 'success'){
            message[responseData.type](responseData.message)
            /**
             *
             * 存储JWT
             *
             * */
            navigate('/home')
        }
    }
    return (
        <div className={gcss.main}>
            <div className={gcss.signBox}>
                <header>
                    <div className={gcss.title+' widthAuto'}>Sign</div>
                    <div className={gcss.text}>变化为一种常态，尝试着不去否认它。</div>
                </header>
                <div className={gcss.inputBox}>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>UserName</div>
                        <div><input className={gcss.input1} type="text" onChange={handleChangeForUsername} value={username}/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>PassWord</div>
                        <div><input className={gcss.input1} type="password" onChange={handleChangeForPasswd1} value={passwd1}/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>PassWord</div>
                        <div><input className={gcss.input1} type="password" onChange={handleChangeForPasswd2} value={passws2}/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>NickName</div>
                        <div><input className={gcss.input1} type="text" onChange={handleChangeForNick} value={nickname}/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>Email</div>
                        <div className={gcss.send}><div><input className={gcss.input1} type="text" onChange={handleChangeForEmail} value={email}/></div>{showSend()}</div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name}>Code</div>
                        <div><input className={gcss.input2} type="text" onChange={handleChangeForCode} value={code}/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.gotoOther} onClick={()=> {navigate('/login')}}>login</div>
                    </div>
                </div>
                <footer><div className={gcss.go} onClick={go}>GO</div></footer>
            </div>
        </div>
    )
}