import React,{ useState, useEffect } from "react";


import gcss from './index.module.scss';
import AskGY from "../../../../request/api";
import { message, useNasConnection} from "../../../../redux/actionSender";

export default function SpecifyRepos(props){
    const [useNas, setUseNas] = useState(-1)
    const [nasList, setNasList] = useState([])
    const [getNasListState, setGetNasListState] = useState(false)
    useEffect(async () => {
        const responseData = await AskGY.getNasData({})
        if(responseData.type = 'success'){
            setNasList(responseData.data || [])
            setGetNasListState(true)
        }
    },[1])
    const handleClick = event => {
        const name = event.target.getAttribute('_name')
        setUseNas(name)
        const nasID = event.target.getAttribute('_nasid')
        if(window.canUseNasList[nasID] && window.canUseNasList[nasID].state){
            useNasConnection(nasID)
        }else{
            useNasConnection(nasID)
        }
    }
    return(<div style={props.style} className={gcss.main}>
        <header className={gcss.title}>SpecifyRepos</header>
        <div className={gcss.body}>
            <div>Choose your Repository</div>
            <div>
                <div className={gcss.info} style={ getNasListState ? {display:'none'} : {display: 'flex'} }></div>
                <div className={gcss.nasList}>
                    {
                        nasList.map((item,index) => {
                            return <div key={item.id} _name = { index } _nasid = { item.nasid } className={useNas == index ? gcss.choose : ''} onClick={handleClick}>{item.nasid}</div>
                        })
                    }
                </div>
            </div>
        </div>
        <footer></footer>
    </div>)
}

function createConnection(nasID){

}