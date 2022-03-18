import React, {useState, useEffect} from 'react';


import gcss from './index.module.scss'
import {useNavigate} from "react-router-dom";

export default function Sign(){
    const [username,setusername] = useState('');
    const [passwd1,setPasswd1] = useState('');
    const [passws2,setPasswd2] = useState('');
    const [nick,setNick] = useState('');
    const [email,setEmail] = useState('');
    const [code] = useState('');

    const navigate = useNavigate();

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
                        <div><input className={gcss.input1} type="text"/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>PassWord</div>
                        <div><input className={gcss.input1} type="password"/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>PassWord</div>
                        <div><input className={gcss.input1} type="password"/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>NickName</div>
                        <div><input className={gcss.input1} type="text"/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name+' widthAuto'}>Email</div>
                        <div><input className={gcss.input1} type="text"/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.name}>Code</div>
                        <div><input className={gcss.input2} type="text"/></div>
                    </div>
                    <div className={gcss.inputFather}>
                        <div className={gcss.gotoOther} onClick={()=> {navigate('/login')}}>login</div>
                    </div>
                </div>
                <footer><div className={gcss.go}>GO</div></footer>
            </div>
        </div>
    )
}