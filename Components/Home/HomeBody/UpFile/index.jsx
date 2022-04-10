import React,{ useState, useEffect } from "react";
import ReactDom from "react-dom";
import gcss from "./index.module.scss";
import Popup from "../../../widget/Popup";
import {message} from "../../../../redux/actionSender";
import AskGY from "../../../../request/api";
import cloudSVG from './cloud.svg'

export default function UpFile(props){
    const [state, setState] = useState(props.state)
    const [file, setFile] = useState('')
    const [useNasID, setUseNasID] = useState(props.useNasID)


    useEffect(() => {
        setState(props.state)
    },[props.state])
    useEffect(() => {
        setUseNasID(props.useNasID)
    })

    const handleFileChange = event => {
        const file = event.target.files
        setFile(file)
    }
    const handleUpfileClick = () => {
        if(file.length ==0){
            message.warning('请选择文件');
            return
        }
        for(let i in file){
            if(file[i].size > 1024* 1024 * 1024){
                message.warning('文件大小不能超过1GB')
                return;
            }
        }
        const makeMd5 = new Worker('./makeMD5.js')
        makeMd5.postMessage({
            type:'message',
            data:'Hello World!'
        })
        makeMd5.postMessage({
            type:'file',
            data:file
        })
        makeMd5.onmessage = async e => {
            console.log(e.data)
            if(e.data.type == 'md5'){
                const md = await checkFile(file[e.data.fileIndex], e.data.md5, useNasID, props.now)
                if(md){
                    sendFile(file[e.data.fileIndex], e.data.md5, useNasID, props.now)
                }else{
                    console.log('文件上传完成')
                }
            }
        }
    }

    const element = <Popup close={props.close} state={state}>
        <div className={gcss.main}>
            <header>Upload Your File</header>
            <div>
                <div className={gcss.meihuainput}><img src={cloudSVG} alt=""/></div>
                <input type='file' multiple='multiple' onChange={handleFileChange}/>
            </div>
            <footer>
                <div onClick={handleUpfileClick} className='widthAuto'>UPLOAD</div>
            </footer>
        </div>
    </Popup>
    return ReactDom.createPortal(element,document.getElementById('popup_window'))
}
function checkFile(file, md5, useNasID, now){
    return new Promise(rec => {
        const sendMessage = JSON.stringify({
            type:'checkFile',
            data:{
                fileType:file.type,
                fileName:file.name,
                fileSize:file.size,
                ascription:now,
                md5
            }
        })
        window.canUseNasList[useNasID].send(sendMessage)
        window.canUseNasList[useNasID].onMessage(data => {
            if(data.type == 'checkFile' && data.md5 == md5){
                console.log(data)
                rec(data.state)
            }
        })
    })
}
function sendFile(file, md5, useNasID, now){
    //  读取二进制文件
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = async e => {
        console.log('文件读取完毕')
        //  建立二进制对象
        const atom = new Uint8Array(e.target.result)
        // const fileBinary = e.target.result;
        //  设置块大小为 4Kb
        const chunkSize = 1024 * 64;
        //  读取总块数
        const chunkTotal = Math.ceil(atom.length/chunkSize);
        //  开始传输
        const start = JSON.stringify({
            type:'file',
            data:{
                type:'start',
                chunkSize,
                chunkTotal,
                fileType:file.type,
                fileName:file.name,
                fileSize:file.size,
                ascription:now,
                md5
            }
        })
        window.canUseNasList[useNasID].send(start)
        const t = new Date().getTime()
        for(let i  = 0;i < chunkTotal;i++){
            console.log(i,'/',chunkTotal)
            if(i == chunkTotal - 1){
                const ing = JSON.stringify({
                    type:'file',
                    data:{
                        type:'ing',
                        file:Array.from(atom.slice(chunkSize * i, atom.length)),
                        ascription:now,
                        num:i,
                        md5:md5
                    }
                })
                window.canUseNasList[useNasID].send(ing)
            }else{
                const ing = await send_v(atom, chunkSize, i, md5)
                window.canUseNasList[useNasID].send(ing)
            }
        }

        const end = JSON.stringify({
            type:'file',
            data:{
                type:'end',
                data:{
                    md5:md5,
                    fileType:file.type,
                    fileName:file.name,
                    fileSize:file.size,
                    ascription:now,
                },
                md5
            }
        })
        window.canUseNasList[useNasID].send(end)
        console.log(file.name,'上传耗时',new Date().getTime() - t)
        const endState = await getFileEnd(md5,useNasID)
        console.log(endState)
    }
}
function getFileEnd(md5,useNasID){
    return new Promise(rec => {
        console.log(window.canUseNasList[useNasID])
        window.canUseNasList[useNasID].onMessage(e => {
            if(e.type =='fileEND' && e.md5 == md5){
                rec(e.state)
            }
        })
    })
}
async function send_v(atom, chunkSize, i, md5){
    return new Promise(rec => {
        const ing = JSON.stringify({
            type:'file',
            data:{
                type:'ing',
                file:Array.from(atom.slice(chunkSize * i, chunkSize * (i + 1))),
                num:i,
                md5:md5
            }
        })
        setTimeout(() => {
            rec(ing)
        },)
    })
}