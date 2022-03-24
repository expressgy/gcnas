import React,{ useState, useEffect } from "react";
import {message, refresh, goto} from "../../../redux/actionSender";
import AskGY from "../../../request/api";
import gcss from './index.module.scss';
import { useNavigate } from'react-router-dom'

export default function ConfigUser(props){
    if(!props.userInfoState){
        return (<div>正在等待数据更新</div>)
    }
    const navigate = useNavigate()
    const [oldUsername,setOldUsername] = useState(window.me)
    const [oldEmial,setOldEmail] = useState(window.userInfo.email)
    const [oldNickname,setOldNickname] = useState(window.userInfo.nickname)
    const [newNickname,setNewNickname] = useState(window.userInfo.nickname)
    const [oldPass,setOldPass] = useState('')
    const [newPass1,setNewPass1] = useState('')
    const [newPass2,setNewPass2] = useState('')

    const [upInfoState, setUpInfoState] = useState(true)
    const [upPasswordState, setUpPasswordState] = useState(true)
    const checkPassword = () => {
        if(oldPass.length > 8 && newPass1.length > 8 && newPass1 == newPass2){
            return true
        }else{
            return false
        }
    }
    useEffect(() => {
        setNewNickname(window.userInfo.nickname)
        setOldNickname(window.userInfo.nickname)
    },[oldNickname])
    const handleEmailChange = event =>{
        setNewNickname(event.target.value)
    }
    const handlePasswordChange = event => {
        const value = event.target.value
        const name = event.target.getAttribute('_name')
        if(name == 'oldP'){
            setOldPass(value)
        }else if(name == 'newP1'){
            setNewPass1(value)
        }else if(name == 'newP2'){
            setNewPass2(value)
        }
    }
    const basicDataUp = async () => {
        if(oldNickname == newNickname){
            message.warning('昵称未修改，无法更新！')
            return
        }else if(newNickname.length == 0){
            message.warning('昵称为空，无法更新！')
            return
        }else if(newNickname.length > 128){
            message.warning('昵称过长，无法更新！')
            return
        }else{
            const responseData = await AskGY.updateUserInfo({
                nickname : newNickname
            })
            setUpInfoState(!upInfoState)
            const setUpInfoStateTimeout = setTimeout(() => {
                setUpInfoState(!upInfoState)
            },3000)
            if(responseData.type == 'success'){
                if(!upInfoState){
                    clearTimeout(setUpInfoStateTimeout);
                    setUpInfoState(!upInfoState)
                }
                message.success(responseData.message)
                setOldNickname(newNickname)
                refresh('/home')
            }
        }
    }
    const passwordUp = async () => {
        if(newPass1.length > 256){
            message.warning('密码过长，无法修改！')
            return
        }else if(oldPass.length < 8){
            message.warning('原始密码过短，请检查！')
            return
        }else if(newPass1 != newPass2){
            message.warning('两次密码输入不一致，请检查！')
            return
        }else if(newPass1.length < 8){
            message.warning('新密码过短，无法修改！')
            return
        }

        const responseData = await AskGY.updateUserPass({
            oldPass,
            newPass1
        })
        const setUpPasswordStateTimeout = setTimeout(() => {
            setUpPasswordState(!upPasswordState)
        },3000)
        if(responseData.type == 'success'){
            if(!upPasswordState){
                clearTimeout(setUpPasswordStateTimeout);
                setUpPasswordState(!upPasswordState)
            }
            message.success(responseData.message+'，请重新登录！')
            window.SupermeGY = ''
            window.SupermeGYSSS = ''
            window.me = ''
            window.userInfo = ''
            setTimeout(() => {
                navigate('/login')
            },1500)
        }
    }
    return(<div style={props.style} className={gcss.main}>
        <header className={gcss.title}>Configure User</header>
        <div className={gcss.body}>
            <div>
                <div>
                    <div>
                        <div className={gcss.title}>Username</div>
                        <div className={gcss.text}>{oldUsername}</div>
                    </div>
                    <div>
                        <div className={gcss.title}>Email</div>
                        <div className={gcss.text}>{oldEmial}</div>
                    </div>
                    <div>
                        <div className={gcss.title}>NickName</div>
                        <div><input type="text" value={newNickname} onChange={handleEmailChange}/></div>
                    </div>
                </div>
                <div style={oldNickname != newNickname ? {cursor:'pointer'} : {cursor:'not-allowed'}} onClick={basicDataUp}>
                    Confirm Basic Information
                </div>
            </div>
            <div>
                <div>
                    <div>
                        <div className={gcss.title}>Password</div>
                        <div className={gcss.password}>
                            <div>
                                <div className={gcss.title}>Old Password</div>
                                <div><input _name='oldP' type="password" value={oldPass} onChange={handlePasswordChange}/></div>
                            </div>
                            <div>
                                <div className={gcss.title}>New Password</div>
                                <div>
                                    <div><input _name='newP1' type="password" value={newPass1} onChange={handlePasswordChange}/></div>
                                    <div><input _name='newP2' type="password" value={newPass2} onChange={handlePasswordChange}/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={checkPassword() ? {pointerEvents: 'auto'} : {cursor:'not-allowed'}} onClick={passwordUp}>
                    Update Password
                </div>
            </div>
        </div>
        <footer>
            <div></div>
        </footer>
    </div>)
}