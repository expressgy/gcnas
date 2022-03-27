import React,{ useState, useEffect } from "react";
import ReactDom from "react-dom";
import gcss from "./index.module.scss";
import Popup from "../../../../../widget/Popup";
import {message} from "../../../../../../redux/actionSender";
import AskGY from "../../../../../../request/api";

export default function AdditionTurn(props){
    const [state,setState] = useState(props.state)

    const [path, setPath] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [addTurnState, setAddTurnState] = useState(true)

    const change = {
        path:setPath,
        username:setUsername,
        password:setPassword
    }

    const handleInputChange  = event => {
        const name = event.target.getAttribute('_name')
        change[name](event.target.value)
    }
    const handleAdditionTurnOnClick = async () => {
        if(!addTurnState){
            return false
        }
        if(path.length != 0){
            setAddTurnState(false)
            const addTurnTimeout = setTimeout(() => {
                setAddTurnState(true)
            })
            const responseData = await AskGY.addTurnData({
                path,
                username,
                password
            })
            if(responseData.type == 'success'){
                message.success('添加Turn地址成功')
                clearTimeout(addTurnTimeout)
                setAddTurnState(true)
                props.close()
            }
        }else{
            message.warning('TURN Path Is Not Empty')
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
                    <div><input _name='path' type="text" value={path || ''} onChange={handleInputChange} placeholder='ecs.togy.top:3478'/></div>
                </div>
                <div>
                    <div>Username</div>
                    <div><input _name='username' type="text" value={username || ''} onChange={handleInputChange}/></div>
                </div>
                <div>
                    <div>Password</div>
                    <div><input _name='password' type="text" value={password || ''} onChange={handleInputChange}/></div>
                </div>
            </div>
            <footer>
                <div className='widthAuto' onClick={ handleAdditionTurnOnClick }>Addition</div>
            </footer>
        </div>
    </Popup>
    return ReactDom.createPortal(element,document.getElementById('popup_window'))
}