import React,{ useState, useEffect } from "react";
import gcss from './index.module.scss'

export default function OSS(props){
    return (<div className={gcss.main} style={props.style}>
        <header>OSS</header>
        <div className={gcss.main}></div>
        <footer></footer>
    </div>)
}