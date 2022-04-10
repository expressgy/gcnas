import React,{ useState, useEffect } from "react";
import ReactDom from "react-dom";
import gcss from "./index.module.scss";
import Popup from "../../../widget/Popup";
import {message} from "../../../../redux/actionSender";
import AskGY from "../../../../request/api";

export default function FileInfo(props){
    const [state, setState] = useState(props.state)
    const [useNasID, setUseNasID] = useState(props.useNasID)
    const [fileData, setFileData] = useState(props.data())
    const [filename, setFilename] = useState(fileData.filename)



    useEffect(() => {
        setState(props.state)
        setFileData(props.data())
        setFilename(props.data().filename)
    },[props.state,props.data()])
    useEffect(() => {
        setUseNasID(props.useNasID)
    })
    const handleFilenameChange = event => {
        setFilename(event.target.value)
    }
    const handleEditFilename = async () => {
        if(filename == fileData.filename){
            message.info('名称没有变化，无法修改！')
            return;
        }else if(filename.length == 0 || filename.length > 128){
            message.warning('名称不合法');
            return;
        }
        const ms = await  editFilename(filename, fileData.id, useNasID);
        console.log(ms)
        if(ms.data.affectedRows == 1){
            message.success('edit Succeful')
            props.refreshFunc()
            props.close()
        }
    }
    const handleDeleteClick = async () => {
        const ms = await deleteFile(fileData.id, useNasID);
        console.log(ms)
        if(ms.data.affectedRows == 1){
            message.success('edit Succeful')
            props.refreshFunc()
            props.close()
        }
    }

    const element = <Popup close={props.close} state={state}>
        <div className={gcss.main}>
            <header>FileInfo</header>
            <div>
                <div>
                    <div>FileName</div>
                    <div><input type="text" value={filename || ''} onChange={handleFilenameChange}/></div>
                </div>
                <div>
                    <div>CreateTime</div>
                    <div>{ formatDate(new Date(fileData.createtime), "yyyy年MM月dd日 hh:mm:ss") }</div>
                </div>
                <div>
                    <div>FileSize</div>
                    <div>{ getfilesize(fileData.filesize) }</div>
                </div>
            </div>
            <footer>
                <div className='widthAuto' onClick={handleEditFilename}>Edit</div>
                <div className='widthAuto' onClick={handleDeleteClick}>Delete</div>
                <div className='widthAuto'>Donwload</div>
            </footer>
        </div>
    </Popup>
    return ReactDom.createPortal(element,document.getElementById('popup_window'))
}

function formatDate(timestamp, fmt) {

    if (!timestamp) {
        return "";
    }
    try {
        var date = timestamp;
        if (typeof timestamp == "number") {
            date = new Date(timestamp);
        }

        if (!fmt)
            fmt = "yyyy-MM-dd hh:mm";


        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    catch (e) {
        return "";
    }
}
// 计算文件大小函数(保留两位小数), Size为字节大小
function getfilesize(size) {
    if (!size)
        return "0K";

    var num = 1024.00; //byte

    if (size < num)
        return size + "B";
    if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + "K"; //kb
    if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
    if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}



function editFilename(filename, id, useNasID){
    return new Promise(rec => {
        const ms = JSON.stringify({
            type:'editFilename',
            id,
            filename
        })
        window.canUseNasList[useNasID].send(ms);
        window.canUseNasList[useNasID].onMessage(e => {
            if(e.type == 'editFilename'){
                rec(e)
            }
        })
    })
}
function deleteFile(id, useNasID){
    return new Promise(rec => {
        const ms = JSON.stringify({
            type:'deleteFile',
            id,
        })
        window.canUseNasList[useNasID].send(ms);
        window.canUseNasList[useNasID].onMessage(e => {
            if(e.type == 'deleteFile'){
                rec(e)
            }
        })
    })
}