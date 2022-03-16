import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
//	以上为核心库

import App from "./App";
import './index.css'
import './widget.css'


ReactDom.render(
	<React.StrictMode>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
)
