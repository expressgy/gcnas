import React, {useState, useEffect} from "react";
import gcss from './index.module.scss';
import AskGY from "../../request/api";

import deno from './deno.svg'

export default function HomeTitle(){
    const [settingState, setSettingState] = useState(false)
    const [userInfo, setUserInfo] = useState({})

    useEffect(async () => {
        const responstData = await AskGY.getUserInfo({username:window.me})
    },[0])



    return (<div className={gcss.main}>
        <div className={gcss.title}>
            <div className={gcss.entryBox}>
                <div>
                    <div className={gcss.avatarBox}><img src={deno} alt=""/></div>
                    <div>{(() => settingState ? userInfo.nickname : '')()}</div>
                </div>
            </div>
            <div className={gcss.menuBox}>menu</div>
        </div>
        <div className={gcss.body}></div>
    </div>)
}