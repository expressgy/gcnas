import store from "./index";
import {MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_WARNING,MESSAGE_INFO,MESSAGEN,GOTO} from "./constant";
import { randomString } from "../tools";

const messageDelay = 4000


export const message = {
        success: data => {
            const message = {
                type: 'message',
                messageType:MESSAGE_SUCCESS,
                data,
                id:randomString()
            }
            store.dispatch(message)
            setTimeout(() => {
                message.messageType = MESSAGEN
                store.dispatch(message)
            },messageDelay)
        },
        warning: data => {
            const message = {
                type: 'message',
                messageType: MESSAGE_WARNING,
                data,
                id:randomString()
            }
            store.dispatch(message)
            setTimeout(() => {
                message.messageType = MESSAGEN
                store.dispatch(message)
            },messageDelay)
        },
        error: data => {
            const message = {
                type: 'message',
                messageType: MESSAGE_ERROR,
                data,
                id:randomString()
            }
            store.dispatch(message)
            setTimeout(() => {
                message.messageType = MESSAGEN
                store.dispatch(message)
            },messageDelay)
        },
        info: data => {
            const message = {
                type: 'message',
                messageType: MESSAGE_INFO,
                data,
                id:randomString()
            }
            store.dispatch(message)
            setTimeout(() => {
                message.messageType = MESSAGEN
                store.dispatch(message)
            },messageDelay)
        }
    }

export const goto = (from,to) => {
    const action = {
        type:GOTO,
        from,
        to
    }
    store.dispatch(action)
}
