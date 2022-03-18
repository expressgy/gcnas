const isValid = (s) => {
    while (true) {
        let len = s.length
        // 将字符串按照匹配对，挨个替换为''
        s = s.replace('{}', '').replace('[]', '').replace('()', '')
        // 有两种情况s.length会等于len
        // 1. s匹配完了，变成了空字符串
        // 2. s无法继续匹配，导致其长度和一开始的len一样，比如({],一开始len是3，匹配完还是3，说明不用继续匹配了，结果就是false
        if (s.length === len) {
            return len === 0
        }
    }
}

let a = '((()[)])'

console.log(isValid(a))