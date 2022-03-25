import React,{useState, useEffect} from "react";
import gcss from './index.module.scss'
import store from "../../../redux";
import close from './close.svg'

export default function Popup(){
    const [element, setElement] = useState('')
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const storeData = store.getState().popup;
            if(!storeData) return false
            setElement(storeData.element)
            unsubscribe()
        })
    })
    const handlePopupclose = () => {
        setElement('')
    }



    return(element.length == 0 ? <></> :
        <div  className={gcss.popup}>
            <div>
                <div>{element}</div>
                <div className={gcss.close} onClick={handlePopupclose}>
                    <img src={close} alt=""/>
                </div>
            </div>
        </div>)
}