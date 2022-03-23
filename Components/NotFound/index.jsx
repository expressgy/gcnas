import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import gcss from './index.module.scss'

export default function NotFound(){
    const [timeout,settimeout] = useState(5)
    const navigate = useNavigate()
    useEffect(() => {
        if(timeout == 0){
            navigate('/login')
        }else{
            setTimeout(() => {
                settimeout(timeout - 1)
            },1000)
        }
    },[timeout])
    return <div className={gcss.main}>
        <div>
            <div className={gcss.title}>Not Found 404 !</div>
            <div className={gcss.text}>将在 {timeout} 秒后进入登录页！</div>
        </div>
    </div>
}