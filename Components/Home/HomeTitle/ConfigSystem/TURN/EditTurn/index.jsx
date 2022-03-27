import React,{ useState, useEffect } from "react";
import ReactDom from "react-dom";
import gcss from "./index.module.scss";
import Popup from "../../../../../widget/Popup";
import {message} from "../../../../../../redux/actionSender";
import AskGY from "../../../../../../request/api";
import waning from './warning.svg'

export default function EditTurn(props){
    const [states, setState] = useState(props.state)
    const [turnData, setTurnData] = useState(props.turnData)
    const id = turnData.id

    const [path, setPath] = useState(turnData.turnpath)
    const [username, setUsername] = useState(turnData.turnuser)
    const [password, setPassword] = useState(turnData.turnpass)

    const [pathn, setPathn] = useState(path)
    const [usernamen, setUsernamen] = useState(username)
    const [passwordn, setPasswordn] = useState(password)

    const [editTurnState, setEditTurnState] = useState(true)
    const [deleteTurnState,setDeleteTurnState] = useState(true)

    const change = {
        path:setPathn,
        username:setUsernamen,
        password:setPasswordn
    }
    const handleInputChange  = event => {
        const name = event.target.getAttribute('_name')
        change[name](event.target.value)
    }
    const handleDeleteClick = async () => {
        if(!deleteTurnState){
            return
        }
        setDeleteTurnState(false)
        const deleteTimeout = setTimeout(() => {
            setDeleteTurnState(true)
        },3000)
        const responseData = await AskGY.deleteTurnData({
            id:id
        })
        if(responseData.type == 'success'){
            message.success(responseData.message)
            setDeleteTurnState(true)
            props.close()
        }
    }
    const handleEditClick = async () => {
        if(!editTurnState){
            return
        }
        if(path == pathn && usernamen == username && password == passwordn){
            message.info('无法作出修改，数据没有变化')
            return false
        }
        if(pathn.length == 0){
            message.info('无法作出修改，path不为空')
            return false
        }
        setEditTurnState(false)
        const deleteTimeout = setTimeout(() => {
            setEditTurnState(true)
        },3000)
        const responseData = await AskGY.editTurnData({
            id:id,
            username:usernamen,
            path:pathn,
            password:passwordn
        })
        if(responseData.type == 'success'){
            message.success(responseData.message)
            setEditTurnState(true)
            props.close()
        }
    }

    useEffect(() => {
        setState(props.state)
        setPath(turnData.turnpath)
        setUsername(turnData.turnuser)
        setPassword(turnData.turnpass)
    },[props.state])
    useEffect(() => {
        setPath(turnData.turnpath)
        setUsername(turnData.turnuser)
        setPassword(turnData.turnpass)
        setPathn(turnData.turnpath)
        setUsernamen(turnData.turnuser)
        setPasswordn(turnData.turnpass)
    },[turnData.turnpath])
    useEffect(() => {
        setTurnData(props.turnData)
    },[props.turnData])
    const element = <Popup close={props.close} state={states}>
        <div className={gcss.editTurnPopup}>
            <header>EDIT TURN</header>
            <div>
                <div>
                    <div>Path</div>
                    <div><input _name='path' type="text" value={pathn || ''} onChange={handleInputChange}/></div>
                </div>
                <div>
                    <div>Username</div>
                    <div><input _name='username' type="text" value={usernamen || ''} onChange={handleInputChange}/></div>
                </div>
                <div>
                    <div>Password</div>
                    <div><input _name='password' type="text" value={passwordn || ''} onChange={handleInputChange}/></div>
                </div>
            </div>
            <footer>
                <div className='widthAuto' onClick={handleDeleteClick}><img src={waning} alt=""/>Delete</div>
                <div className='widthAuto' onClick={handleEditClick}>Edit</div>
            </footer>
        </div>
    </Popup>
    return ReactDom.createPortal(element,document.getElementById('popup_window'))
}