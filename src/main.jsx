import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
//	以上为核心库

import App from "./App";
import './index.css'
import './widget.css'
import Message from '../Components/widget/Message'



//	检测浏览器是否存在本地存储
async function exitLocalStorage(){
	return new Promise((rec,rej) => {
		if(window.localStorage && window.sessionStorage)rec()
		else rej()
	})
}
//	初始化localstorage
async function initSupermeGY() {
	return new Promise((rec,rej) => {
		try{
			//	如果不存在SupermeGY，则初始化
			if(localStorage.getItem('SupermeGY') == null)localStorage.setItem('SupermeGY', '');
			if(sessionStorage.getItem('SupermeGYSSS') == null)sessionStorage.setItem('SupermeGYSSS', '');
			rec()
		}catch (e){rej()}
	})
}
//	关联全局变量
async function setSupermeGY(){
	return new Promise(async (rec,rej) => {
		await initSupermeGY()
		Object.defineProperty(window,'SupermeGY',{
			configurable:false,//	不可删除
			// writable:false,//	可修改,设置set和get后writable和value失效
			enumerable: false,//	不可枚举
			get:() => {
				return localStorage.getItem('SupermeGY')
			},
			set:(jwt) => {
				sessionStorage.setItem('SupermeGYSSS', jwt)
				localStorage.setItem('SupermeGY', jwt);
			}
		})
		Object.defineProperty(window,'SupermeGYSSS',{
			configurable:false,//	不可删除
			// writable:false,//	可修改,设置set和get后writable和value失效
			enumerable: false,//	不可枚举
			get:() => {
				return localStorage.getItem('SupermeGY').length != 0 ?  localStorage.getItem('SupermeGY') : sessionStorage.getItem('SupermeGYSSS')
			},
			set:(jwt) => {
				sessionStorage.setItem('SupermeGYSSS', jwt);
			}
		})
		rec()
	})
}

// 启动
async function start(){

	//	第一步设置JWT
	try{
		await exitLocalStorage()
		await setSupermeGY()
	}catch (e) {
		console.log('不支持LocalStorage!')
		ReactDom.render(<div>此浏览器不支持localStorage或sessionStorage，无法运行本程序</div>,document.getElementById('root'))
		return false
	}




	ReactDom.render(
		<React.StrictMode>
			<BrowserRouter>
				<App/>
			</BrowserRouter>
		</React.StrictMode>,
		document.getElementById('root')
	)
	ReactDom.render(
		<Message/>,
		document.getElementById('message_window')
	)
}
start()