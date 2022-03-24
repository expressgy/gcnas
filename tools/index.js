
import { useLocation } from 'react-router-dom'
function randomString(len) {
	len = len || 8;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	let maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
function authentication(){
	if(SupermeGY.length == 0 && SupermeGYSSS.length == 0 && useLocation().pathname != '/login' && useLocation().pathname != '/sign' && useLocation().pathname != '/'){
		return true
	}
	else{
		return false
	}
}
function logined(){
	if(SupermeGY.length != 0 && SupermeGYSSS.length != 0 ){
		return true
	}else{
		return false
	}
}
export {randomString, authentication, logined}