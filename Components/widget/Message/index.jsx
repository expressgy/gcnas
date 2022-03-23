import React, {useState, useEffect} from 'react';
import store from "../../../redux";

import {MESSAGE_ERROR,MESSAGE_SUCCESS,MESSAGE_WARNING,MESSAGE_INFO} from "../../../redux/constant";

import gcss from './index.module.scss'
import info from './info.svg'
import success from './success.svg'
import warning from './warning.svg'
import error from './error.svg'

const svg = {
    [MESSAGE_INFO]:info,
    [MESSAGE_SUCCESS]:success,
    [MESSAGE_WARNING]:warning,
    [MESSAGE_ERROR]:error
}

export default function Message(){
    const [messageList,setMessageList] = useState({})
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const storeData = store.getState().message;
            if(storeData.messageType.indexOf('message_') > -1){
                setMessageList({...messageList,[storeData.id]:storeData})
                unsubscribe()
            }else if(storeData.messageType.indexOf('messagen') > -1){
                delete messageList[storeData.id]
                const a = JSON.parse(JSON.stringify(messageList))
                setMessageList(a)
                unsubscribe()
            }
        })
    })
    return (
        <>
            {Object.keys(messageList).map((index,item) => {
                return (<div className={gcss.box}  style={{top:`${2 * item}rem`}} key={messageList[index].id}><div><img src={svg[messageList[index].messageType]} alt=""/></div><div className={gcss.p}>{messageList[index].data}</div></div>)
            })}
        </>
    )
}
