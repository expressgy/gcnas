import React,{ useState, useEffect } from "react";
import TURN from "./TURN";
import GCNAS from "./GCNAS";
import OSS from "./OSS";

import gcss from './index.module.scss';
import ConfigUser from "../ConfigUser";
import SpecifyRepos from "../SpecifyRepos";

export default function ConfigSystem(props){
    const [menuState, setMenuState] = useState([1,0,0])

    const handleMenuChoose = event => {
        const name = event.target.getAttribute('_name');
        const newState = new Array(3).fill(0);
        newState[name] = 1
        setMenuState(newState)
    }


    return(<div style={props.style} className={gcss.main}>
        <header className={gcss.title}>Configure System</header>
        <div className={gcss.body}>
            <div className={gcss.configMenu}>
                <div className={gcss.menuTitle}>System Setting Menu</div>
                <div className={gcss.menuBody}>
                    <div _name='0' className={menuState[0] ? `${gcss.menuList} ${gcss.menuListOnChoose}` : gcss.menuList} onClick={handleMenuChoose}>Configure TURN</div>
                    <div _name='1' className={menuState[1] ? `${gcss.menuList} ${gcss.menuListOnChoose}` : gcss.menuList} onClick={handleMenuChoose}>Configure GC.NAS</div>
                    <div _name='2' className={menuState[2] ? `${gcss.menuList} ${gcss.menuListOnChoose}` : gcss.menuList} onClick={handleMenuChoose}>Configure Ali OSS</div>
                </div>
            </div>
            <div className={gcss.configBody}>
                <TURN style={menuState[0] ? {display:"flex"} : {display:"none"}}/>
                <GCNAS style={menuState[1] ? {display:"flex"} : {display:"none"}}/>
                <OSS style={menuState[2] ? {display:"flex"} : {display:"none"}}/>
            </div>
        </div>
        <footer></footer>
    </div>)
}