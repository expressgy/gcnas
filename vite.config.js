import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            //这里是通过请求/api 来转发到 https://api.pingping6.com/
            //假如你要请求https://api.*.com/a/a
            //那么axios的url，可以配置为 /api/a/a
            '/askgy': 'http://localhost:5000/'
        },
	host:'0.0.0.0'
    }
})
