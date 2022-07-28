import axios from 'axios'
import EventBus from '../tools/eventBus'

let initRefreshToken = false
const eventBus = new EventBus()

export interface refreshToken {
	judge: (item: ObjectMap) => boolean
	method: () => Promise<boolean>
}

// axios token过期更新token
export async function resAsyncRefreshToken(response: any, item: refreshToken) {
	if (item.judge(response)) {
		const res = await EventBusRefreshToken(item.method)
		if (res) {
			const data = await axios(response.config)
			return data
		}
	}
	return response
}

// 节流，多个接口同时token过期，就通过队列回调信息更新token
async function EventBusRefreshToken(method: () => Promise<boolean>): Promise<boolean> {
	if (initRefreshToken) {
		return new Promise(resolve => {
			function callback(value: any) {
				eventBus.remove('refreshToken', uuid)
				resolve(value)
			}
			const uuid = eventBus.on('refreshToken', callback)
		})
	} else {
		initRefreshToken = true
		const data = await method()
		eventBus.emit('refreshToken', data)
		initRefreshToken = false
		return data
	}
}

// // 更新token
// async function refreshToken() {
// 	const token = localStorage.getItem('sld_refresh_token')
// 	if (!token) return false
// 	const res = await oauthToken({ refreshToken: token }, { 'Content-Type': 'application/x-www-form-urlencoded' })
// 	if (res?.state * 1 === 200) {
// 		localStorage.setItem('sld_token', `Bearer ${res?.data?.access_token}`)
// 		localStorage.setItem('sld_refresh_token', `${res?.data?.refresh_token}`)
// 		return true
// 	}
// 	return false
// }
