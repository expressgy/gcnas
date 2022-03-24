import React,{ useState, useEffect } from "react";


import gcss from './index.module.scss';

export default function SpecifyRepos(props){
    return(<div style={props.style} className={gcss.main}>
        <header className={gcss.title}>SpecifyRepos</header>
        <div className={gcss.body}></div>
        <footer></footer>
    </div>)
}