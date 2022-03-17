import React, {useState, useEffect} from 'react';
import store from "../../../redux";

export default function Message(){
    const [messageList,setMessageList] = useState({})
    const [num,setNum] = useState(0)
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const storeData = store.getState();
            if(storeData.type.indexOf('message_') > -1){
                setMessageList({...messageList,[storeData.id]:storeData})
                unsubscribe()
            }else if(storeData.type.indexOf('messagen') > -1){
                const a = messageList
                delete a[storeData.id]
                console.log('???',a)
                setMessageList(a)
                unsubscribe()
            }
        })
    })
    return (
        <div>
            <div onClick={() => setNum(num+1)}>sxasxas</div>
            {Object.keys(messageList).map((index,item) => {
                console.log(index,item)
                return (<div key={messageList[index].id}>{messageList[index].data}</div>)
            })}
        </div>
    )
}
