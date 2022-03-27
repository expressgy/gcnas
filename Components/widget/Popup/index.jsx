import React,{useState, useEffect} from "react";
import gcss from './index.module.scss'
import close from './close.svg'

/**
 *
 * 说明：
 * 1.   状态为state
 * 2.   关闭为close
 * 3.   子组件为 display:flex
 * */


export default function Popup(props){
    const [state, setState] = useState(props.state)
    useEffect(() => {
        setState(props.state)
    },[props.state, props.close])
    const handleCloseClick = event => {
        props.close()
    }
    return <div style={state ? {display:'flex'} : {display:'none'}} className={gcss.show}>
        <div>
            <div>{props.children}</div>
            <div className={gcss.close}><img src={close} alt="close" onClick={handleCloseClick}/></div>
        </div>
    </div>
}