import store from "./index";
import {MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_WARNING,MESSAGE_INFO} from "./constant";
import {randomString} from "../tools";

export const message = {
        success: data => {
            store.dispatch(
                {
                    type: MESSAGE_SUCCESS,
                    data,
                    id:randomString()
                }
            )
            setTimeout(() => {
                store.dispatch(
                    {
                        type: 'messagen',
                        data,
                        id:randomString()
                    }
                )
            },4000)
        },
        warning: data => {
            store.dispatch({
                type: MESSAGE_WARNING,
                data,
                id:randomString()
            })
        },
        error: data => {
            store.dispatch({
                type: MESSAGE_ERROR,
                data,
                id:randomString()
            })
        },
        info: data => {
            store.dispatch({
                type: MESSAGE_INFO,
                data,
                id:randomString()
            })
            setTimeout(() => {
                store.dispatch(
                    {
                        type: 'messagen',
                        data,
                        id:randomString()
                    }
                )
            },4000)
        }
    }
