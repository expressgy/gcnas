import React,{ useState, useEffect } from "react";
import gcss from './index.module.scss'
import AskGY from "../../../../../request/api";
import {message, popup} from "../../../../../redux/actionSender";

export default function TURN(props){
    const [turnData, setTurnData] = useState([])
    const [refresh,setRefresh] = useState(true)
    const [getTurnState, setGetTurnState] = useState(false)
    useEffect(async () => {
        console.log('发请求')
        const responseData = await AskGY.getTurnData({})
        if(responseData.type = 'success'){
            setTurnData(responseData.data)
            setGetTurnState(true)
        }
    },[true])

    const handleAdditionClick = () => {
        popup(<div className={gcss.turnAddctionPopup}>
            <header>Addition TURN</header>
            <div>
                <div>
                    <div>Path</div>
                    <div><input type="text"/></div>
                </div>
                <div>
                    <div>Username</div>
                    <div><input type="text"/></div>
                </div>
                <div>
                    <div>Password</div>
                    <div><input type="text"/></div>
                </div>
            </div>
            <footer>
                <div>submit</div>
            </footer>
        </div>)
    }


    return (<div className={gcss.main} style={props.style}>
        <header>
            <div>TURN</div>
            <div onClick={handleAdditionClick}>Addition</div>
        </header>
        <div className={gcss.body}>
            { !getTurnState ? <div>正在获取Turn信息</div> :
                (() => {
                    if(turnData.length != 0){
                        return turnData.forEach((item, index) => {
                            return (<div style={getTurnState ? {display:'flex'} : {display: 'none'}}>{item}</div>)
                        })
                    }else{
                        return (<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'#fefefe',fontSize:'1.8rem'}}>No record!</div>)
                    }
                })()
            }
        </div>
        <footer></footer>
    </div>)
}

function TURNAddition(){
    const [path,setPath] = useState('')
    const handlePathChange = event => {
        setPath(event.target.value)
    }
    return
}