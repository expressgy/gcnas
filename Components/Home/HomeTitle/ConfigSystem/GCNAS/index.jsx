import React,{ useState, useEffect } from "react";
import gcss from './index.module.scss'
import EditTurn from "../TURN/EditTurn";
import AskGY from "../../../../../request/api";
import AdditionNas from "./AdditionNas";

export default function GCNAS(props){
    const [turnData, setTurnData] = useState([])
    const [refresh,setRefresh] = useState(true)
    const [getNasState, setGetNasState] = useState(false)

    const [additionTurnState, setAdditionTurnState] = useState(false)
    const [editTurnState, setEditTurnState] = useState(false)
    const [editTurnData, setEditTurnData] = useState([])

    useEffect(async () => {
        const responseData = await AskGY.getNasData({})
        if(responseData.type = 'success'){
            setTurnData(responseData.data || [])
            setGetNasState(true)
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
            <div>GCNAS</div>
            <div onClick={handleAdditionOpen}>Addition</div>
            <AdditionNas state={additionTurnState} close={handleAdditionClose}/>
        </header>
        <div className={gcss.body}>
            { !getNasState ? <div>正在获取GCNAS信息</div> :
                (() => {
                    if(turnData.length != 0){
                        return <div><div key={0} style={getNasState ? {display:'flex'} : {display: 'none'}}>
                            <div>id</div>
                            <div>NasID</div>
                            <div>State</div>
                            <div>command</div>
                        </div>{turnData.map((item, index) => {
                            return (<div key={item.id} style={getNasState ? {display:'flex'} : {display: 'none'}}>
                                <div>{index + 1}</div>
                                <div>{item.nasid}</div>
                                <div>{item.state}</div>
                                <div _name={index} >NaN</div>
                                {/*<div _name={index} /!*onClick={handleEditOpen}*!/>NaN</div>*/}
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