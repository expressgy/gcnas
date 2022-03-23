import { GOTO } from "./constant";

const defaultState = {
    status : 0
}

export default function reducer(state = defaultState,action){
    switch (action.type){
        case 'message':
            return {...state,message:action}
        case GOTO:
            return {...state,[GOTO]:action}
    }
}