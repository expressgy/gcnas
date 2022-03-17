import React, {useState, useEffect} from 'react';
import { randomString } from "../../tools";
import store from '../../redux';
import {message} from "../../redux/actionSender";


import gcss from'./index.module.scss'
import login1 from './login5.jpg'
import usernameIco from './username.svg'
import passwordIco from './password.svg'

export default function Login() {
	const [username,setUsername] = useState('');
	const [password,setPassword] = useState('');
	const [rememberMe,setRememberMe] = useState(true)

	function go(){
		message.info('正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆正在登陆')
	}
	// useEffect(()=>{
	// 	const unsubscribe = store.subscribe(() => {
	// 		console.log(store.getState())
	// 	})
	// },[1])



	return (
		<div className={gcss.main}>
			<div className={gcss.loginBox}>
				<div><img className={gcss.login1} src={login1} alt=""/></div>
				<div className={gcss.loginInput}>
					<div>
						<div className={gcss.title+' widthAuto'}>Login</div>
						<div className={gcss.text}>变化对你来说是件好事。</div>
					</div>
					<div>
						<div>
							<div className={gcss.inputBox}>
								<div className={gcss.icoBox}><img className={gcss.ico} src={usernameIco} alt=""/></div>
								<div><input name={ randomString() } type="text" placeholder='username'/></div>
							</div>
							<div className={gcss.inputBox}>
								<div className={gcss.icoBox}><img className={gcss.ico} src={passwordIco} alt=""/></div>
								<div><input name={ randomString() } type="password" placeholder='password'/></div>
							</div>
							<div className={gcss.operation}>
								<div className={rememberMe ? gcss.remember : ''} onClick={ () => setRememberMe(!rememberMe)}>Remember me</div>
								<div>Register</div>
								<div>Retrieve</div>
							</div>
						</div>
					</div>
					<div>
						<div onClick={go}>GO</div>
					</div>
				</div>
			</div>
		</div>
	);
}