import React,{ useState, useEffect } from "react";
import ReactDom from "react-dom";
import gcss from "./index.module.scss";
import Popup from "../../../widget/Popup";
import {message} from "../../../../redux/actionSender";
import AskGY from "../../../../request/api";

export default function NewFolder(props){
    const [state, setState] = useState(props.state)
    const [folderName, setFolderName] = useState('')
    const [useNasID, setUseNasID] = useState(props.useNasID)


    useEffect(() => {
        setState(props.state)
    },[props.state])
    useEffect(() => {
        setUseNasID(props.useNasID)
    })

    const handleFolderNameChange = event => {
        setFolderName(event.target.value)
    }
    const handleCreateFolderClick = async () => {
        if(folderName.length == 0 || folderName.length > 128){
            message.warning('文件名不合法')
            return;
        }
        const data = await createFolder(folderName, props.now, useNasID)
        if(data.data && data.data.affectedRows && data.data.affectedRows==1){
            props.refreshFunc()
        }
        console.log(data)
    }

    const element = <Popup close={props.close} state={state}>
        <div className={gcss.main}>
            <header>Create new Folder</header>
            <div>
                <input type='text' value={folderName}  onChange={handleFolderNameChange}/>
            </div>
            <footer>
                <div onClick={handleCreateFolderClick} className='widthAuto'>Create</div>
            </footer>
        </div>
    </Popup>
    return ReactDom.createPortal(element,document.getElementById('popup_window'))
}

function createFolder(filename, now, useNasID){
    return new Promise(rec => {
        const ms = JSON.stringify({
            type:'createFolder',
            now,
            filename
        })
        window.canUseNasList[useNasID].send(ms);
        window.canUseNasList[useNasID].onMessage(e => {
            if(e.type == 'createFolder'){
                rec(e)
            }
        })
    })
}
