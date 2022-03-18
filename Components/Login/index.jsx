import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { randomString } from "../../tools";
import {message} from "../../redux/actionSender";


import gcss from'./index.module.scss'
import login1 from './login5.jpg'
import usernameIco from './username.svg'
import passwordIco from './password.svg'

export default function Login() {
	const [username,setUsername] = useState('');
	const [password,setPassword] = useState('');
	const [rememberMe,setRememberMe] = useState(true);

	const navigate = useNavigate();

	function go(){
		const text = veriUsername(username,password);
		if(text.next){
			// 登录请求
		}else{
			message[text.type](text.data)
		}
	}
	function changeWord(event){
		if(event.target.placeholder == 'username'){
			setUsername(event.target.value)
		}else{
			setPassword(event.target.value)
		}
	}



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
								<div><input name={ randomString() } type="text" placeholder='username' onChange={changeWord}/></div>
							</div>
							<div className={gcss.inputBox}>
								<div className={gcss.icoBox}><img className={gcss.ico} src={passwordIco} alt=""/></div>
								<div><input name={ randomString() } type="password" placeholder='password' onChange={changeWord}/></div>
							</div>
							<div className={gcss.operation}>
								<div className={rememberMe ? gcss.remember : ''} onClick={ () => setRememberMe(!rememberMe)}>Remember me</div>
								<div onClick={() => navigate('/sign')}>Register</div>
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

function veriUsername(u,p){
	if(u.length < 8){
		return{
			next:false,
			type:'warning',
			data:'用户名长度不会小于8位'
		}
	}else if(u.length > 128){
		return{
			next:false,
			type:'warning',
			data:'用户名长度不会大于128位'
		}
	}if(p.length < 8){
		return{
			next:false,
			type:'warning',
			data:'密码长度不会小于8位'
		}
	}else if(p.length > 256){
		return{
			next:false,
			type:'warning',
			data:'密码长度不会大于256位'
		}
	}else{
		return {
			next: true
		}
	}

}