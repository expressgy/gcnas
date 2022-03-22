import Index from "../Components/Index";
import Test from "../Components/Test";
import Login from "../Components/Login";
import Sign from "../Components/Sign";
import Home from "../Components/Home";
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
	},
	{
		path: '/sign',
		element:<Sign/>
	},
	{
		path: '/home',
		element:<Home/>
	}
]