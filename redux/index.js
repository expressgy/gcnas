import { createStore } from "redux";

const defaultState = {
    status : 0
}

function reducer(state = defaultState,action){
    console.log(action)
    switch (action.type){
        case 'test':
            return action.num
    }
}

const store = createStore(reducer)


export default store