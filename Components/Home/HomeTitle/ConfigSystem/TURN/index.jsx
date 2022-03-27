import React,{ useState, useEffect } from "react";
import gcss from './index.module.scss'
import AskGY from "../../../../../request/api";
import {message} from "../../../../../redux/actionSender";
import AdditionTurn from "./AdditionTurn";
import EditTurn from "./EditTurn";

export default function TURN(props){
    const [turnData, setTurnData] = useState([])
    const [refresh,setRefresh] = useState(true)
    const [getTurnState, setGetTurnState] = useState(false)

    const [additionTurnState, setAdditionTurnState] = useState(false)
    const [editTurnState, setEditTurnState] = useState(false)
    const [editTurnData, setEditTurnData] = useState([])



    useEffect(async () => {
        console.log('发请求')
        const responseData = await AskGY.getTurnData({})
        if(responseData.type = 'success'){
            setTurnData(responseData.data || [])
            setGetTurnState(true)
        }
    },[refresh])

    const handleAdditionOpen = () => {
        setAdditionTurnState(true)
    }
    const handleAdditionClose = () => {
        return (() => {
            setRefresh(!refresh)
            setAdditionTurnState(false)
        })()
    }

    const handleEditOpen = event => {
        const name = event.target.getAttribute('_name')
        setEditTurnState(true)
        setEditTurnData(turnData[name])
    }
    const handleEditClose = () => {
        return (() => {
            setRefresh(!refresh)
            setEditTurnState(false)
        })()
    }


    return (<div className={gcss.main} style={props.style}>
        <header>
            <div>TURN</div>
            <div onClick={handleAdditionOpen}>Addition</div>
            <AdditionTurn state={additionTurnState} close={handleAdditionClose}/>
        </header>
        <div className={gcss.body}>
            { !getTurnState ? <div>正在获取Turn信息</div> :
                (() => {
                    if(turnData.length != 0){
                        return <div><div key={0} style={getTurnState ? {display:'flex'} : {display: 'none'}}>
                            <div>id</div>
                            <div>path</div>
                            <div>username</div>
                            <div>password</div>
                            <div>command</div>
                        </div>{turnData.map((item, index) => {
                            return (<div key={item.id} style={getTurnState ? {display:'flex'} : {display: 'none'}}>
                                <div>{index + 1}</div>
                                <div>{item.turnpath}</div>
                                <div>{item.turnuser}</div>
                                <div>{item.turnpass}</div>
                                <div _name={index} onClick={handleEditOpen}>Edit</div>
                            </div>)
                        })}<EditTurn state={editTurnState} turnData={editTurnData} close={handleEditClose}/></div>
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