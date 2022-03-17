import store from "./index";
import {MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_WARNING,MESSAGE_INFO,MESSAGEN} from "./constant";
import {randomString} from "../tools";

const messageDelay = 4000


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
            const message = {
                type: MESSAGE_INFO,
                data,
                id:randomString()
            }
            store.dispatch(message)
            setTimeout(() => {
                message.type = MESSAGEN
                store.dispatch(message)
            },messageDelay)
        }
    }
