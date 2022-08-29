import { has, isNil } from 'ramda'
import { isNumber, isObject, isTrue } from './typeJudgment'
import dayjs from 'dayjs'
type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
	[key in Key]: Value
}
export function objectToArray(object: ObjectMap): ObjectMap {
	return Object.keys(object).map(item => {
		return { value: item, label: object[item] }
	})
}

export function arrayKeyToMap(list: Array<ObjectMap>, key: string): Map<string, any> {
	const data: Map<string, any> = new Map()
	list.forEach(item => {
		if (item[key]) {
			data.set(item[key], item)
		}
	})
	return data
}

export function arrayKeyToObject(list: Array<ObjectMap>, key: string): ObjectMap {
	const data: ObjectMap = {}
	list.forEach(item => {
		if (item[key]) {
			data[item[key]] = item
		}
	})
	return data
}

// 对象与对象赋值
export function setObjetToObject(data: ObjectMap, setData: ObjectMap): void {
	for (const i in data) {
		if (!isNil(setData[i])) {
			data[i] = setData[i]
		}
	}
}
// 设置递归数组
export function setArrayData(item: any[], call: (callItem: ObjectMap) => ObjectMap): ObjectMap[] {
	return item.map(res => {
		if (isTrue(res.children)) {
			res.children = setArrayData(res.children, call)
		}
		return { ...call(res) }
	})
}

// 设置递归数组
export function forArrayData(item: any[], call: (callItem: ObjectMap, index: number) => void, index = 0): void {
	item.forEach(res => {
		call(res, index)
		if (isTrue(res.children)) {
			forArrayData(res.children, call, index + 1)
		}
	})
}

// 过滤递归数组
export function setArrayFilter(item: any[], call: (callItem: ObjectMap) => boolean): any[] {
	return item.filter((res: any) => {
		if (isTrue(res.children)) {
			res.children = setArrayFilter(res.children, call)
		}
		return call(res)
	})
}

// 递归数组筛选出对应的数据
export function getArrayFilterData(item: any[], call: (callItem: ObjectMap) => boolean): any[] {
	let data: any[] = []
	item.forEach((res: any) => {
		if (call(res)) {
			data.push(res)
		}
		if (isTrue(res.children)) {
			data = [...data, ...getArrayFilterData(res.children, call)]
		}
	})
	return data
}

// 递归深拷贝
export function deepClone(source: any, call?: (item: any) => any): any {
	if (typeof source !== 'object') {
		// 非对象类型(undefined、boolean、number、string、symbol)，直接返回原值即可
		if (call) {
			return call(source)
		}
		return source
	}
	if (source === null) {
		// 为null类型的时候
		return source
	}
	if (source instanceof Date) {
		// Date类型
		return new Date(source)
	}
	if (source instanceof RegExp) {
		// RegExp正则类型
		return new RegExp(source)
	}

	let result: any
	if (Array.isArray(source)) {
		// 数组
		result = []
		source.forEach(item => {
			result.push(deepClone(item, call))
		})
		return result
	} else {
		// 为对象的时候
		result = {}
		const keys = [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)] // 取出对象的key以及symbol类型的key
		keys.forEach(key => {
			const item = source[key]
			result[key] = deepClone(item, call)
		})
		return result
	}
}

// data = [{id:1},{id:2}] key= 'id' item=2
export function arrayObjectIncludes(data: ObjectMap[], key: string, item: string): boolean {
	if (!isTrue(data)) return false
	return data.map(item => item[key]).includes(item)
}

export function objectFilterEmpty(item: ObjectMap = {}): ObjectMap {
	const data: ObjectMap = {}
	for (const key in item) {
		if (isTrue(item[key])) {
			data[key] = item[key]
		}
	}
	return data
}

// 对象过滤空数据
export function ObjectFilterNull(data: ObjectMap = {}): ObjectMap {
	const params: ObjectMap = {}
	for (const key in data) {
		if (isTrue(data[key])) {
			params[key] = data[key]
		}
	}
	return params
}

// 判断ArrayObject是否存在空Object
export function arrayObjectJudgeNullObject(data: Array<ObjectMap> = []): boolean {
	let judge = true
	for (const item of data) {
		if (!isTrue(ObjectFilterNull(item))) {
			judge = false
			break
		}
	}
	return judge
}

export function dayJsDataToString(data: any, format = 'YYYY-MM-DD HH:mm:ss'): ObjectMap {
	const returnData: ObjectMap = {}
	for (const key in data) {
		const item = data[key]
		if (isObject(item)) {
			if (item.$d && item.$M) {
				returnData[key] = dayjs(item as any).format(format)
				continue
			}
		}
		returnData[key] = deepClone(item)
	}
	return returnData
}

// 数据数字转字符串
export function dataNumberToString(source: any): any {
	return deepClone(source, item => {
		return isNumber(item) ? item + '' : item
	})
}

export function arrayGetData(sourceData: any[] = [], getData = {}): any[] {
	return sourceData.filter(item => {
		let returnData = true
		for (const key in getData) {
			// @ts-ignore
			if (getData[key] !== item[key]) {
				returnData = false
			}
		}
		return returnData
	})
}

export function objectRepeatObject(itemA: ObjectMap, itemB: ObjectMap, callback: (key: string, a: any, b: any) => void): void {
	for (const itemAKey in itemA) {
		if (has(itemAKey, itemB)) {
			callback(itemAKey, itemA[itemAKey], itemB[itemAKey])
		}
	}
}
