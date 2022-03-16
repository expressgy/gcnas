import Index from "../Components/Index";
import Test from "../Components/Test";
import Login from "../Components/Login";
// import Message from "../Components/widget/Message";


export default [
	{
		path:'/',
		element:<Index/>
	},
	{
		path: '/test',
		element: <Test/>
	},
	{
		path: '/login',
		element:<Login/>
	}
]