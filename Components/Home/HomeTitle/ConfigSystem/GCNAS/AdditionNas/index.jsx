import React,{ useState, useEffect } from "react";
import ReactDom from "react-dom";
import gcss from "./index.module.scss";
import Popup from "../../../../../widget/Popup";
import {message} from "../../../../../../redux/actionSender";
import AskGY from "../../../../../../request/api";

export default function AdditionNas(props){
    const [state,setState] = useState(props.state)

    const [nasid, setNasID] = useState('')

    const [addTurnState, setAddTurnState] = useState(true)


    const handleInputChange  = event => {
        setNasID(event.target.value)
    }
    const handleAdditionTurnOnClick = async () => {
        if(!addTurnState){
            return false
        }
        if(nasid.length == 32){
            setAddTurnState(false)
            const addTurnTimeout = setTimeout(() => {
                setAddTurnState(true)
            })
            const responseData = await AskGY.addNasData({
                nasid
            })
            if(responseData.type == 'success'){
                message.success('添加NAS地址成功')
                clearTimeout(addTurnTimeout)
                setAddTurnState(true)
                props.close()
            }
        }else{
            message.warning('NASID length must be 32')
        }
    }

    useEffect(() => {
        setState(props.state)
    },[props.state])
    const element = <Popup close={props.close} state={state}>
        <div className={gcss.turnAddctionPopup}>
            <header>Addition TURN</header>
            <div>
                <div>
                    <div>Path</div>
                    <div><input _name='nasid' type="text" value={nasid || ''} onChange={handleInputChange} placeholder='xxxxxxxxxx'/></div>
                </div>
            </div>
            <footer>
                <div className='widthAuto' onClick={ handleAdditionTurnOnClick }>Addition</div>
            </footer>
        </div>
    </Popup>
    return ReactDom.createPortal(element,document.getElementById('popup_window'))
}