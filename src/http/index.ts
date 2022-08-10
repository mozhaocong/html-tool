import axios from 'axios'
import { refreshToken, resAsyncRefreshToken } from './response'
import { isString, isTrue } from '../tools/typeJudgment'
type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
	[key in Key]: Value
}

interface axiosType {
	setConfigHeaders?: (config: ObjectMap) => ObjectMap
	resAsyncSuccess?: (item: ObjectMap) => Promise<ObjectMap>
	responseError?: () => void
	responseSuccess?: (item: ObjectMap) => boolean
	refreshToken?: refreshToken
}

export function axiosInit({ setConfigHeaders, responseSuccess, responseError, refreshToken }: axiosType) {
	//post请求头
	axios.defaults.baseURL = '' //正式
	if (!axios.defaults.headers) {
		// @ts-ignore
		axios.defaults.headers = {}
	}
	// axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'

	//允许跨域携带cookie信息
	// axios.defaults.withCredentials = true
	//设置超时
	axios.defaults.timeout = axios.defaults.timeout ?? 10000

	axios.interceptors.request.use(
		config => {
			if ((config as any)['Content-Type']) {
				const ContentType = (config as any)['Content-Type']
				if (ContentType.includes('application/x-www-form-urlencoded')) {
					if (!isString(config.data)) {
						let data = ''
						for (const item in config.data) {
							data += item + '=' + config.data[item] + '&'
						}
						config.data = data
					}
				}
			}
			const defHeaders = setConfigHeaders ? setConfigHeaders(config) : {}
			config.headers = {
				...config.headers,
				...defHeaders
			}
			return config
		},
		error => {
			return Promise.reject(error)
		}
	)

	axios.interceptors.response.use(
		async response => {
			if (response.status == 200) {
				let data = response
				if (isTrue(refreshToken)) {
					// 更新token
					data = await resAsyncRefreshToken(response, refreshToken)
				}
				if (responseSuccess) {
					if (!responseSuccess(response)) {
						return false
					}
				}
				return Promise.resolve(data)
			} else {
				return Promise.reject(response)
			}
		},
		error => {
			if (responseError) {
				responseError()
			}
			console.log(error)
		}
	)
}

/**
 * @param {String} url
 * @param {Object} data
 * @returns Promise
 */
export function axiosPost(url: string, data: any, options = {}): Promise<any> {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url,
			data: data,
			...options
		})
			.then((res: any) => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function axiosGet(url: string, data: any, options = {}): Promise<any> {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url,
			params: data,
			...options
		})
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function methodType(url: string, method: string, data: any, options = {}): Promise<any> {
	return new Promise((resolve, reject) => {
		axios({
			method: method as 'get',
			url,
			[method === 'get' ? 'data' : 'params']: data,
			...options
		})
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err)
			})
	})
}
