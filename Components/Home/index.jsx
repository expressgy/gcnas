import React, {useState, useEffect} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {message} from "../../redux/actionSender";
import gcss from './index.module.scss';
import { authentication } from "../../tools";

export default function Home() {
    const navigate = useNavigate()
    if(authentication()){
        useEffect(() =>  setTimeout(() => navigate('/login'),4000))
        return <>你没有权限访问此页面</>
    }
    return (<div>Hello World!</div>);
}