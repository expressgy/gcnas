import React,{ useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import gcss from './index.module.scss'
import mainP from './index1.jpg'

export default function Index(){
	const navigate = useNavigate()
	return(
		<div className={gcss.main}>
			<div onClick={ () => navigate('/login')}>
				<div className={gcss.mainP}><img src={mainP} alt=""/></div>
				<div className={gcss.text}>Every time I think of you , I always catch my breath</div>
			</div>
		</div>
	)
}