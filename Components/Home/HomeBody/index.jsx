import React, {useState, useEffect, useRef} from "react";
import gcss from './index.module.scss'
import store from "../../../redux";
import AskGY from "../../../request/api";
import { randomString } from "../../../tools";
import { message } from "../../../redux/actionSender";


import homeSVG from './home.svg'
import backSVG from './back.svg'
import flushSVG from './flush.svg'
import upfileSVG from './upfile.svg'
import newfolder from './newfolder.svg'

import erSVG from './fileSVG/er.svg'
import EXCELSVG from './fileSVG/EXCEL.svg'
import FOLDERSVG from './fileSVG/FOLDER.svg'
import PDFSVG from './fileSVG/PDF.svg'
import PHOTOSVG from './fileSVG/PHOTO.svg'
import PPTSVG from './fileSVG/PPT.svg'
import TXTSVG from './fileSVG/TXT.svg'
import VIDEOSVG from './fileSVG/VIDEO.svg'
import WORDSVG from './fileSVG/WORD.svg'
import ZIPSVG from './fileSVG/ZIP.svg'
import CODESVG from './fileSVG/code.svg'
import ATOMSVG from './fileSVG/atom.svg'
import CSSSVG from './fileSVG/css.svg'
import HTMLSVG from './fileSVG/HTML.svg'
import RARSVG from './fileSVG/RAR.svg'
import Z7SVG from './fileSVG/7z.svg'
import EXESVG from './fileSVG/exe.svg'


import UpFile from "./UpFile";
import NewFolder from "./NewFolder";
import FileInfo from "./FileInfo";

const fileSVG = {
    er:erSVG,
    excel:EXCELSVG,
    folder:FOLDERSVG,
    pdf:PDFSVG,
    photo:PHOTOSVG,
    ppt:PPTSVG,
    txt:TXTSVG,
    video:VIDEOSVG,
    word:WORDSVG,
    zip:ZIPSVG,
    code:CODESVG,
    atom:ATOMSVG,
    css:CSSSVG,
    html:HTMLSVG,
    rar:RARSVG,
    z7:Z7SVG,
    exe:EXESVG
}

export default function HomeBody(){
    const [useNasID, setUseNasID] = useState('')
    const [wsState, setWsState] = useState(true)
    const [connectionState, setConnectionState] = useState(false)
    const [showFileType, setShowFileType] = useState(0)
    const [refresh,setRefresh] = useState(true)
    const [now,setNow] = useState(0)
    const [fileList, setFileList] = useState([])

    const [upfileWindowState, setUpfileWindowSatte] = useState(false)
    const [newFolderWindowState, setNewFolderWindowState] = useState(false)
    const [fileInfoWindowState, setFileInfoWindowState] = useState(false)
    const [infoData, setInfoData] = useState({})


    useEffect(async () => {
        //  初始化可用nas列表
        window.canUseNasList = {}
        const iceData = await  AskGY.getTurnData({})
        if(iceData.type == 'success'){
            const a = []
            for (let i of iceData.data){
                a.push({
                    "urls": 'turn:'+i.turnpath,
                    "username": i.turnuser,
                    "credential": i.turnpass
                })
            }
            window.ice = a
        }
    },[0])
    useEffect(() => {
        //  接受切换Nas消息
        const unsubscribe = store.subscribe(() => {
            const storeData = store.getState().useNas;
            // if(Object.keys(storeData).length == 0) return false
            if(!storeData) return false
            setUseNasID(storeData.nasID)
            console.log(storeData.nasID)
        })
        return () => {
            unsubscribe()
        }
    })
    useEffect(() => {
        //  开启Socket
        const webSocketPath = 'ws://localhost:10001'
        window.sl = new signalling(webSocketPath,SupermeGYSSS)
        window.sl.onclose(e => {
            setWsState(!wsState)
        })
        window.sl.onopen(async () => {
            let ice = window.sl.getIceConfig()
            window.defaultIceConfig = ice.concat(window.ice)
            const nasList = await AskGY.getNasData({})
            if(nasList.type = 'success'){
                for(let i of nasList.data)
                    if(i.state == 9){
                        setUseNasID(i.nasid)
                    }
            }
        })
        return () => {
            window.sl.close(e => {
                console.log(e)
            })
        }
    },[wsState])

    useEffect(() => {
        if(useNasID.length != 0){
            //  开始
            console.log('开始链接RTC')
            // 页面布局写好了打开
            createConnection(useNasID,() => {
                setConnectionState(true)
            })
        }
    },[useNasID])

    const handleChooseFileType = event => {
        const name = event.target.getAttribute('_name')
    }


    const handleUpfileOpen = () => {
        setUpfileWindowSatte(true)
    }
    const handleUpfileClose = () => {
        return (() => {
            setUpfileWindowSatte(false)
        })()
    }

    const handleNewFolderOpen = () => {
        setNewFolderWindowState(true)
    }
    const handleNewFolderClose = () => {
        return (() => {
            setNewFolderWindowState(false)
        })()
    }
    const handleFileInfoClose = () => {
        return (() => {
            setFileInfoWindowState(false)
        })()
    }
    const refreshFunc = () => {
        return setRefresh(!refresh)
    }

    const handleRefreshClick = () => {
        //  刷新页面
        setRefresh(!refresh)
        message.info('Refreshing')
    }
    const handleGobackClick = () => {
        //  返回上一级
        if(now == 0){
            message.warning('根目录无法退回')
            return
        }else{

        }
    }
    const handleGohomeClick = async () => {
        //  回到根目录
        if(connectionState){
            const fileList = await getList(0,useNasID)
            console.log(fileList)
            setFileList(fileList.data)
        }
    }

    const handleFileClick = event => {
        return async function (){
            if(event.isfolder == 1){
                const fileList = await getList(event.id,useNasID)
                console.log(fileList)
                setFileList(fileList.data)
                setNow(event.id)
            }else{
                setInfoData(event)
                setFileInfoWindowState(true)
            }
        }
    }
    const senInfoData = () => {
        return infoData
    }

    useEffect(async () => {
        if(connectionState){
            const fileList = await getList(now,useNasID)
            console.log(fileList)
            setFileList(fileList.data)
        }
    },[connectionState,refresh])



    if(connectionState){
        return (<div className={gcss.main}>
            <div className={gcss.mbody}>
                <div className={gcss.left}>
                    <header>
                        <div>{useNasID}</div>
                    </header>
                    <div>
                        <div className={gcss.title}>MENU</div>
                        <div  className={gcss.menuList}>
                            <div _name='all' onClick={handleChooseFileType} className={showFileType == 0 ? gcss.choose : ''}>All</div>
                            <div _name='video' onClick={handleChooseFileType} className={showFileType == 1 ? gcss.choose : ''}>Video</div>
                            <div _name='Music' onClick={handleChooseFileType} className={showFileType == 2 ? gcss.choose : ''}>Music</div>
                            <div _name='document' onClick={handleChooseFileType} className={showFileType == 3 ? gcss.choose : ''}>Document</div>
                            <div _name='other' onClick={handleChooseFileType} className={showFileType == 4 ? gcss.choose : ''}>Other</div>
                        </div>
                    </div>
                    <footer>footer</footer>
                </div>
                <div className={gcss.right}>
                    <header>
                        <div>
                            <div className={gcss.cmdpath}>
                                <div onClick={handleGohomeClick}><img src={homeSVG} alt=""/></div>
                                <div onClick={handleGobackClick}><img src={backSVG} alt=""/></div>
                                <div onClick={handleRefreshClick}><img src={flushSVG} alt=""/></div>
                                <div className={gcss.path}>USERNAMEyjJGg</div>
                            </div>
                            <div className={gcss.cmdfile}>
                                <div onClick={ handleNewFolderOpen }><img src={newfolder} alt="新建文件夹" title='新建文件夹'/></div>
                                <div onClick={ handleUpfileOpen }><img src={upfileSVG} alt="上传文件" title='上传文件'/></div>
                            </div>
                            <UpFile state={ upfileWindowState } close={ handleUpfileClose } useNasID={useNasID} now={now} refreshFunc={refreshFunc}></UpFile>
                            <NewFolder  state={ newFolderWindowState } close={ handleNewFolderClose } useNasID={useNasID} now={now} refreshFunc={refreshFunc}/>
                        </div>
                    </header>
                    <div>
                        <div className={gcss.fileBody}>
                            {fileList.map((item, index) => {
                                return (<div key={item.id} className={gcss.fileBox} title={item.filename} onClick={handleFileClick(item)}>
                                    <div className={gcss.fileICO}>
                                        <img src={returnICO(item)} alt=""/>
                                    </div>
                                    <div className={gcss.filename}>{item.filename}</div>
                                </div>)
                            })}
                        </div>
                        <FileInfo  state={ fileInfoWindowState } close={ handleFileInfoClose } useNasID={useNasID} now={now} refreshFunc={refreshFunc} data={senInfoData}/>
                    </div>
                    <footer></footer>
                </div>
            </div>
        </div>)
    }else{
        return (<div className={gcss.main}>
            <div className={gcss.wait}>Wait . . .</div>
        </div>)
    }

}
function getList(next,useNasID){
    return new Promise(rec => {
        const ms = JSON.stringify({
            type:'getFileList',
            next
        })
        window.canUseNasList[useNasID].send(ms);
        window.canUseNasList[useNasID].onMessage(e => {
            if(e.type == 'getFileList'){
                rec(e)
            }
        })
    })
}

//  信令服务
class signalling{
    //  WebSocket对象
    #ws
    //  心跳间隔时间
    #Timeout = 5000
    //  心跳包起始
    #heartNum = 0
    //  ws状态
    state = false
    //  获取到的自身的uuid
    #uuid
    //  连接上服务器时触发
    defaultIceConfig
    //  与信令服务建立通信时的初始化操作
    canclose = false
    constructor(webSocketPath, Token) {

        this.#ws = new WebSocket(webSocketPath, Token);
        this.#ws.onopen = () => {
            this.#ws.send(JSON.stringify({type:'gy521'}))
            //  重置心跳包
            this.#heartNum = 0
            //  设置连接状态为正常
            this.state = true
            //  与服务器断开连接
        }
        this.#ws.onmessage = data => {
            let message = null;
            try{    //  将服务端数据转化为JSON格式
                message = JSON.parse(data.data)
            }catch (e) {    //  如果不能转化为JSON格式，本次消息作废
                console.log('非JSON字符',data.data)
                return false
            }
            //  判断当前连接状态
            // if(message.type != 'heart') console.log('Server Message',message)
            if(!this.state) return
            switch (message.type) {
                case 'gy521':
                    //  开始
                    //  读取自身UUID
                    this.#uuid = message.uuid
                    //  服务器传来的ice信息
                    this.defaultIceConfig = message.defaultIceConfig
                    //  发送心跳起始包
                    this.#ws.send(
                        JSON.stringify({
                            type: 'heart',
                            heartNum:this.#heartNum
                        })
                    )
                    break
                case 'heart':
                    //  心跳
                    //  判断心跳是否丢失
                    if (message.heartNum - 1 != this.#heartNum) {
                        console.log('系统故障，心跳丢失')
                        this.#ws.close()
                        return false
                    } else {
                        this.#heartNum += 2
                    }
                    //  设置延迟发送心跳包
                    setTimeout(() => {
                        if(this.state){
                            this.#ws.send(
                                JSON.stringify({
                                    type: 'heart',
                                    heartNum: this.#heartNum
                                })
                            )
                        }
                    }, this.#Timeout)
                    break
            }
        }
    }
    //  主动关闭ws
    onclose(callback){
        this.#ws.onerror = e => {
            this.state = false
            if(!this.canclose){
                callback()
            }
        }
        this.#ws.onclose = e => {
            this.state = false
            if(!this.canclose){
                callback()
            }
        }
    }
    onopen(callback){
        const op = () => {
            setTimeout(() => {
                callback()
                this.#ws.removeEventListener('open', op)
            },1500)
        }
        this.#ws.addEventListener('open', op)
    }
    close(){this.#ws ? this.#ws.close() : false}
    getIceConfig(){return this.defaultIceConfig}
    createConnection(nasName){
        return new Promise(rec => {
            this.#ws.send(JSON.stringify({
                type:'createConnection',
                data:{
                    type:'request',
                    rtcName:new Date().getTime() + randomString(5),
                    master:nasName
                }
            }))
            setTimeout(() => {
                rec(false)
            },3000)
            const responseData = data => {
                let message = null;
                try{
                    //  将服务端数据转化为JSON格式
                    message = JSON.parse(data.data)
                }catch (e) {
                    //  如果不能转化为JSON格式，本次消息作废
                    console.log('非JSON字符',data.data)
                    return false
                }
                if(message.type == 'createConnection'){
                    this.#ws.removeEventListener('message',responseData)
                    rec(message)
                }
            }
            this.#ws.addEventListener('message',responseData)
        })
    }
    createRTC(master, offer, rtcName){
        return new Promise(rec => {
            this.#ws.send(JSON.stringify({
                type:'createRTC',
                data:{
                    type:'request',
                    rtcName,
                    from:this.#uuid,
                    to:master,
                    offer
                }
            }))
            setTimeout(() => {
                rec(false)
            },3000)
            const responseData = data => {
                let message = null;
                try{
                    //  将服务端数据转化为JSON格式
                    message = JSON.parse(data.data)
                }catch (e) {
                    //  如果不能转化为JSON格式，本次消息作废
                    console.log('非JSON字符',data.data)
                    return false
                }
                if(message.type == 'createRTC'){
                    this.#ws.removeEventListener('message',responseData)
                    rec(message.data.answer)
                }
            }
            this.#ws.addEventListener('message',responseData)
        })
    }
    sendICE(master, ice, rtcName){
        this.#ws.send(JSON.stringify({
            type:'ICE',
            device:'user',
            state:true,
            data:{
                rtcName,
                from:this.#uuid,
                to:master,
                ice
            }
        }))
    }
    onICE(master,callback){
        const responseData = data => {
            let message = null;
            try{
                //  将服务端数据转化为JSON格式
                message = JSON.parse(data.data)
            }catch (e) {
                //  如果不能转化为JSON格式，本次消息作废
                console.log('非JSON字符',data.data)
                return false
            }
            if(message.type == 'ICE' && message.data.from == master){
                callback(message.data.ice)
            }
        }
        this.#ws.addEventListener('message',responseData)
    }
}

//  RTC
class U_RTC{
    #defaultIceConfig
    #RTC
    #onMessage
    #RTCD_HEART
    #RTCChannelOpen
    constructor(iceConfig) {
        this.#defaultIceConfig = iceConfig
    }
    #makeHash(){
        return new Promise(async rec => {
            const generateConfig = {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1])
            }
            const cert = await RTCPeerConnection.generateCertificate(generateConfig)
            const rtcOption = {
                certificates : [cert],
                iceServers: this.#defaultIceConfig
            }
            rec(rtcOption)
        })
    }
    async initU_RTC(callback){
        const rtcOption = await this.#makeHash()
        // console.log(rtcOption)
        this.#RTC = new RTCPeerConnection(rtcOption)
        this.RTCD = this.#RTC.createDataChannel('GY')
        this.#RTC.ondatachannel = event => {
            this.dataChannelState(event)
        }
        this.#RTC.onicecandidate = callback
        // setInterval(() => {
        //     console.log('iceConnectionState',this.#RTC.iceConnectionState)
        //     console.log('connectionState',this.#RTC.connectionState)
        // },3000)
    }
    createOffer(){
        return new Promise(async rec => {
            const offerOption = {
                offerToReceiveAudio:false,
                offerToReceiveVideo:false
            }
            const offer = await this.#RTC.createOffer(offerOption)
            await this.#RTC.setLocalDescription(offer)
            rec(offer)
        })
    }
    setAnswer(answer){
        this.#RTC.setRemoteDescription(answer)
    }
    setICE(ice){
        this.#RTC.addIceCandidate(ice)
    }
    dataChannelState(event){
        const RTCChannel = event.channel;
        RTCChannel.onmessage = msg=>{
            try{
                const message = JSON.parse(msg.data)
                if(message.type != 'heart'){
                    this.#onMessage(message)
                }
            }catch (e) {
                console.log('非JSON数据',msg.data)
            }
        }

        RTCChannel.onopen = ()=>{
            this.#RTCChannelOpen('open')
            console.log('DataChannel is Open',this)
            this.#RTCD_HEART = setInterval(() => {
                this.RTCD.send(JSON.stringify({
                    type:'heart'
                }))
            },5000)}
        RTCChannel.onclose = ()=>{
            console.log('DataChannel is Close')
            clearInterval(this.#RTCD_HEART)
        }
        RTCChannel.onerror = (e)=>{console.log('DataChannel is error',e)}
    }
    send(data){
        this.RTCD.send(data)
    }
    onMessage(callback){
        this.#onMessage = (data) => {
            callback(data)
        }
    }
    RTCChannelOnOpen(callback){
        this.#RTCChannelOpen = open => {
            callback()
        }
    }
}

async function createConnection(nasID,callback){
    const canConnection = await sl.createConnection(nasID)
    message.warning(canConnection.data.message)
    console.log(canConnection)
    if(!canConnection.data.state)return false
    const master = canConnection.data.master
    const rtcName = canConnection.data.rtcName
    //  进行点对点连接
    //  获取默认ICE配置
    const defaultIceConfig = sl.getIceConfig()
    //  初始化ICE配置
    const userRTC = new U_RTC(window.defaultIceConfig)
    sl.onICE(master,ice => {
        userRTC.setICE(ice)
    })
    await userRTC.initU_RTC(ice => {
        // console.log('生成ICE')
        setTimeout(() => {
            if(ice.candidate){
                //  开始交换ice信息
                sl.sendICE(master, ice.candidate, rtcName)
            }else{
                console.log('ICE协商结束')
            }
        },1000)

    })
    const offer = await userRTC.createOffer()
    const answer = await sl.createRTC(master, offer, rtcName)
    userRTC.setAnswer(answer)
    window.canUseNasList[nasID] = userRTC
    userRTC.RTCChannelOnOpen(() => {
        callback()
    })
}

function returnICO(data){
    const f = data.filename.split('.').slice(-1)[0];
    if(data.isfolder){
        return fileSVG.folder
    }
    if(data.filetype.indexOf('application/vnd.openxmlformats-o') > -1){
        console.log(f)
        if(f.indexOf('xls') > -1){
            return fileSVG.excel
        }else if(f.indexOf('doc') > -1){
            return fileSVG.word
        }else if(f.indexOf('ppt') > -1){
            return fileSVG.ppt
        }
    }else if(data.filetype.indexOf('pdf') > -1){
        return fileSVG.pdf
    }else if(data.filetype.indexOf('javascript') > -1){
        return fileSVG.code
    }else if(data.filetype.indexOf('zip') > -1){
        return fileSVG.zip
    }
    if(f.indexOf('xls') > -1){
        return fileSVG.excel
    }else if(f.indexOf('doc') > -1){
        return fileSVG.word
    }else if(f.indexOf('ppt') > -1){
        return fileSVG.ppt
    }else if(f.indexOf('zip') > -1){
        return fileSVG.zip
    }else if(f.indexOf('rar') > -1){
        return fileSVG.rar
    }else if(f.indexOf('gz') > -1){
        return fileSVG.zip
    }else if(f.indexOf('7z') > -1){
        return fileSVG.z7
    }else if(f.indexOf('mp4') > -1){
        return fileSVG.video
    }else if(f.indexOf('mkv') > -1){
        return fileSVG.video
    }else if(f.indexOf('rmvb') > -1){
        return fileSVG.video
    }else if(f.indexOf('avi') > -1){
        return fileSVG.video
    }else if(f.indexOf('c') > -1){
        return fileSVG.atom
    }else if(f.indexOf('cpp') > -1){
        return fileSVG.atom
    }else if(f.indexOf('jsx') > -1){
        return fileSVG.code
    }else if(f.indexOf('html') > -1){
        return fileSVG.html
    }else if(f.indexOf('css') > -1){
        return fileSVG.css
    }else if(f.indexOf('exe') > -1){
        return fileSVG.exe
    }

    return fileSVG.er
}
