import React, {useState, useEffect} from "react";
import gcss from './index.module.scss'
import store from "../../../redux";
import AskGY from "../../../request/api";
import { randomString } from "../../../tools";
import { message } from "../../../redux/actionSender";
import homeSVG from './home.svg'
import backSVG from './back.svg'
import flushSVG from './flush.svg'
import upfileSVG from './upfile.svg'
import UpFile from "./UpFile";

export default function HomeBody(){
    const [useNasID, setUseNasID] = useState('')
    const [wsState, setWsState] = useState(true)
    const [connectionState, setConnectionState] = useState(false)
    const [showFileType, setShowFileType] = useState(0)

    const [upfileWindowState, setUpfileWindowSatte] = useState(false)

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
                                <div><img src={homeSVG} alt=""/></div>
                                <div><img src={backSVG} alt=""/></div>
                                <div><img src={flushSVG} alt=""/></div>
                                <div className={gcss.path}>USERNAMEyjJGg</div>
                            </div>
                            <div className={gcss.cmdfile}>
                                <div onClick={ handleUpfileOpen }><img src={upfileSVG} alt=""/></div>
                            </div>
                            <UpFile state={ upfileWindowState } close={ handleUpfileClose } useNasID={useNasID}></UpFile>
                        </div>
                    </header>
                    <div></div>
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
    callback()
}