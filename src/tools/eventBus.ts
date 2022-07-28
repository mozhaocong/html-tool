// 观察订阅模式
import { isTrue } from '../index'

export default class EventBus {
	// 唯一id,用来单独移除订阅
	uuid = 0
	// 订阅者
	subscriber: {
		[index: string]: { uuid: number; fn: (...data: any) => void }[]
	} = {}
	// 订阅 消息
	on(key: string, fn: (...data: any) => void): number {
		if (!this.subscriber[key]) {
			this.subscriber[key] = []
		}
		const uuid = this.uuid
		this.subscriber[key].push({ uuid, fn: fn })
		this.uuid++
		return uuid
	}
	// 发布者 发布消息
	emit(key: string, ...data: any) {
		const fns = this.subscriber[key] //取出该消息对应的回调函数集合
		if (!isTrue(fns)) return
		fns.forEach((item: any) => {
			item.fn(...data)
		})
	}
	// 移除
	remove(key: string, uuid?: number) {
		const fns = this.subscriber[key] //取出该消息对应的回调函数集合
		if (!isTrue(fns)) return
		if (isTrue(uuid)) {
			this.subscriber[key] = fns.filter(res => res.uuid !== uuid)
		} else {
			delete this.subscriber[key]
		}
	}
}
