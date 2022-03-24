import React, {useState, useEffect} from "react";
import { Route } from'react-router-dom'
import gcss from './index.module.scss';
import AskGY from "../../request/api";

import ConfigUser from "./ConfigUser";
import ConfigSystem from "./ConfigSystem";
import SpecifyRepos from "./SpecifyRepos";

import deno from './deno.svg'
import copyright from './copyright.webp'
import hometltle from './hometitle.jpg'
import store from "../../redux";

export default function HomeTitle(){
    const [refresh, setRefresh] = useState(false);
    const [settingState, setSettingState] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [settingMenuState, setSettingMenuState] = useState([1,0,0])
    const [userInfoState, setUserInfoState] = useState(false)

    useEffect(async () => {
        // username:window.me 获取的用户名
        const responstData = await AskGY.getUserInfo({})
        window.userInfo = responstData.data
        setUserInfo(window.userInfo)
        setUserInfoState(true)
    },[refresh])
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const storeData = store.getState().refresh;
            if(storeData && location.pathname == storeData.master){
                setRefresh(!refresh)
                setUserInfoState(false)
            }
        })
        return () =>{
            unsubscribe()
        }
    })

        //  开关设置界面
    function titleSwitch(){
        setSettingState(!settingState)
    }
        //  菜单界面开关
    function chooseConfigMenu(event){
        const a = event.target.getAttribute('_name');
        const newState = new Array(3).fill(0)
        newState[a] = !settingMenuState[a]
        setSettingMenuState(newState)
    }



    return (<div className={`${gcss.main} ${settingState ? gcss.mainOpen : ''}`}>
        <div className={gcss.title}>
            <div className={gcss.entryBox} onClick={titleSwitch}>
                <div>
                    <div className={gcss.avatarBox}><img src={deno} alt=""/></div>
                    <div className={gcss.avatarTextBox}>{(() => settingState ? userInfo.nickname : '')()}</div>
                </div>
            </div>
            <div className={gcss.menuBox} style={settingState ? {display:"flex"} : {display:"none"}}>
                <div className={gcss.menu}>
                    <div _name='0' onClick={chooseConfigMenu} className={settingMenuState[0] ? gcss.chooseConfigMenu : ''}>Configure User</div>
                    <div _name='1' onClick={chooseConfigMenu} className={settingMenuState[1] ? gcss.chooseConfigMenu : ''}>Configure SYstem</div>
                    <div _name='2' onClick={chooseConfigMenu} className={settingMenuState[2] ? gcss.chooseConfigMenu : ''}>Specify Repository</div>
                </div>
                <div className={`${gcss.logOut} widthAuto`}>退出登录</div>
            </div>
        </div>
        <div className={gcss.body} style={settingState ? {display:"flex",backgroundImage:`url(${hometltle})`} : {display:"none",backgroundImage:`url(${hometltle})`}}>
            <div className={gcss.copyright}>
                <div>
                    <div>TOGY.GC</div>
                    <div>TOGY evolved from togy2021. Togy2021 is a network storage system developed by Python flash. Due to the limitations of the conditions at that time, the system could not be improved. Now, I have developed this network attached storage system based on P2P transmission, which is constructed by JavaScript, polished the previous system and improved the stability and practicability of the system.</div>
                </div>
            </div>
            <div className={gcss.configWindow}>
                <ConfigUser style={settingMenuState[0] ? {display:"flex"} : {display:"none"}} userInfoState={userInfoState}/>
                <ConfigSystem style={settingMenuState[1] ? {display:"flex"} : {display:"none"}} userInfoState={userInfoState}/>
                <SpecifyRepos style={settingMenuState[2] ? {display:"flex"} : {display:"none"}} userInfoState={userInfoState}/>
            </div>
        </div>
    </div>)
}