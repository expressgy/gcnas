import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import store from "../../redux";
import {message,goto} from "../../redux/actionSender";
import gcss from './index.module.scss';
import { authentication, randomString } from "../../tools";

import HomeTitle from "../HomeTitle";
import HomeBody from "../HomeBody";


export default function Home() {
    const navigate = useNavigate()
    const location = useLocation()
    /**
     * 写完了解注释，不然下面不提示，鉴权
     * */
    // if(authentication()){
    //     useEffect(() =>  setTimeout(() => navigate('/login'),4000))
    //     return <>你没有权限访问此页面</>
    // }
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const storeData = store.getState().goto;
            if(storeData && location.pathname == storeData.from){
                navigate(storeData.to)
                goto(randomString(),randomString())
            }
        })
        return () =>{
            unsubscribe()
        }
    })
    return (<div className={gcss.main}>
        <div className={gcss.titleNNN}></div>
        <HomeTitle/>
        <div className={gcss.body}><HomeBody/></div>
    </div>);
}