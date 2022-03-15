import React,{ useState,useEffect } from "react";
import { useRoutes } from "react-router-dom";
//	以上为核心库

import routes from "../routes";

export default function App(){
	const myRoutes = useRoutes(routes);
	return(
		<div id="App">
			{ myRoutes }
		</div>
	)
}