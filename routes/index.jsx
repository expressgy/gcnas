import Index from "../Components/Index";
import Login from "../Components/Login";
import Sign from "../Components/Sign";
import Home from "../Components/Home";
import NotFound from "../Components/NotFound";
// import Message from "../Components/widget/Message";


export default [
	{
		path: '*',
		element: <NotFound/>
	},
	{
		path:'/',
		element:<Index/>
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