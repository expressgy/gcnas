import React,{ useState, useEffect } from "react";
import gcss from './index.module.scss'
import AskGY from "../../../../../request/api";

export default function TURN(props){
    const [turnData, setTurnData] = useState('')
    const [refresh,setRefresh] = useState(true)
    useEffect(async () => {
        console.log('发请求')
        const responseData = await AskGY.getTurnData({})
        if(responseData.type = 'success'){
            setTurnData(responseData.data)
        }
    },[true])
    return (<div className={gcss.main} style={props.style}>
        <header>
            <div>TURN</div>
            <div>添加</div>
        </header>
        <div className={gcss.main}>

        </div>
        <footer></footer>
    </div>)
}