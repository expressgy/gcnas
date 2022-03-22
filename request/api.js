import Ask from "./index";


const AskGY = {
    checkDuplicateForUsername : async info => {return Ask.post('/askgy/sign/checkDuplicateForUsername',info)},
    sendEmailCode : async info  => {return Ask.post('/askgy/sign/sendEmailCode',info)},
    veriEmailCode : async info  => {return Ask.post('/askgy/sign/veriEmailCode',info)},
}

export default AskGY