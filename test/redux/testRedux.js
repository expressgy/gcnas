// 导入redux (不能使用ES6 的方式导入)
const redux = require("redux");

// 1. 定义初始化值
const initialState = {counter: 0};
// 2. reducer,定义处理器
function reducer(state = initialState, action) {}
// 3. store (创建的时候需要传入一个reducer)
const store = redux.createStore(reducer);
// 4. 订阅
store.subscribe(()=>{
    console.log('AAA')
})
// 5. 发布
setInterval(() => {
    store.dispatch({ type: "INCREMENT" });
},1000)
