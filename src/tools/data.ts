import { difference, has, isNil } from 'ramda'
import { isNumber, isObject, isTrue, isArray } from './typeJudgment'
import dayjs, { isDayjs } from 'dayjs'
import { isMoment } from 'moment'
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
	if (typeof source !== 'object' || isDayjs(source) || isMoment(source)) {
		// 非对象类型(undefined、boolean、number、string、symbol, isDayjs, isMoment)，直接返回原值即可
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
export function objectFilterNull(data: ObjectMap = {}): ObjectMap {
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
		if (!isTrue(objectFilterNull(item))) {
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

//arrayGetData-start
// const sourceData = [
// 	{ title: '样品需求单号', dataIndex: 'a1' },
// 	{ title: '赫特SPU款号', dataIndex: 'a2' },
// 	{ title: '采购数量', dataIndex: 'a3' test:1 },
// 	{ title: '采购数量', dataIndex: 'a3'  test:2},
// 	{ title: '下单时间', dataIndex: 'a4' },
// ]
// const getData = { title: '采购数量', test:2 }
// console.log(arrayGetDataList(sourceData, getData)) [{ title: '采购数量', dataIndex: 'a3' }]
//arrayGetData-end
export function arrayGetData(sourceData: ObjectMap[] = [], getData = {}): ObjectMap[] {
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

//arrayGetDataList-start
// const sourceData = [
// 	{ title: '样品需求单号', dataIndex: 'a1' },
// 	{ title: '赫特SPU款号', dataIndex: 'a2' },
// 	{ title: '采购数量', dataIndex: 'a3' },
// 	{ title: '下单时间', dataIndex: 'a4' },
// ]
// const getDataList = [{ title: '采购数量' }, { title: '样品需求单号' }]
// console.log(arrayGetDataList(sourceData, getDataList))
//arrayGetDataList-end
export function arrayGetDataList(sourceData: ObjectMap[] = [], getDataList: ObjectMap[] = []): ObjectMap[] {
	if (!(isTrue(sourceData) && isTrue(getDataList))) return []
	const returnData = []
	for (const item of getDataList) {
		for (const source of sourceData) {
			let isOk = true
			for (const key in item) {
				if (source[key] !== item[key]) {
					isOk = false
				}
			}
			if (isOk) {
				returnData.push(source)
				break
			}
		}
	}
	return returnData
}

export function objectRepeatObject(itemA: ObjectMap, itemB: ObjectMap, callback: (key: string, a: any, b: any) => void): void {
	for (const itemAKey in itemA) {
		if (has(itemAKey, itemB)) {
			callback(itemAKey, itemA[itemAKey], itemB[itemAKey])
		}
	}
}

//objectRecursiveMerge-start
// const data: any = { a: { b: 1, c: 2 } }
// // const itemA = ['a', 'b']
// // const itemData = { a: { b: { c: { f: 1 } }, d: 2 }, e: {} }
// // const data: any = { a: { b: 1, c: 2 } }
// // const itemA = ['a', 'b']
// const itemData = { a: { b: 2, d: 2 } }
// // const itemData = { a: { b: { c: 2 }, d: 2 } }
// // const itemData = { a: { b: {} } }
// const mergeData = objectRecursiveMerge(data, itemData)
// console.log('objectRecursiveMerge', mergeData, data)
//objectRecursiveMerge-end

export function objectRecursiveMerge(dataSource: ObjectMap = {}, mergeData: ObjectMap = {}) {
	const data = deepClone(dataSource)
	function mergeDataFor(item: any = {}) {
		const { target, mergeData, pTarget = {}, pMergeData = {}, key = '' } = item
		if (!isTrue(target)) {
			pTarget[key] = pMergeData[key]
			return
		}
		if (isObject(target) && isTrue(target) && isObject(mergeData) && isTrue(mergeData)) {
			for (const itemKey in mergeData) {
				mergeDataFor({
					target: target[itemKey],
					mergeData: mergeData[itemKey],
					pTarget: target,
					pMergeData: mergeData,
					key: itemKey
				})
			}
		} else {
			pTarget[key] = mergeData
			return
		}
	}
	mergeDataFor({ target: data, mergeData })
	return data
}

//arrayToObject-start
// const testArray = ['a', 'b', 'c']
// const testObject = { a: { b: { c: 2, d: 2 } } }
// // const testObject = { a: { b: 1 } }
// const arrayData = arrayToObject(testObject, testArray, item => {
// 	console.log('item', item)
// 	return 1
// })
// console.log('arrayToObject', testObject, arrayData)
//arrayToObject-ned

export function arrayToObject(dataSource: ObjectMap = {}, arrayData: Array<string | number> = [], setData?: (returnData: any) => any): ObjectMap {
	const data = deepClone(dataSource)
	let replaceData = data
	let itemData: ObjectMap = {}
	let key: any = ''
	try {
		for (const item of arrayData) {
			itemData = replaceData
			if (!isTrue(replaceData[item])) {
				replaceData[item] = {}
			}
			replaceData = replaceData[item]
			key = item
		}
	} catch (e) {
		console.error(e, '数组转对象，数据源与数组类型不匹配', 'dataSource', dataSource, 'arrayData', arrayData)
		return {}
	}

	if (!setData) {
		return deepClone(dataSource)
	}
	const returnData = setData(deepClone(itemData[key]))
	itemData[key] = returnData
	return data
	// if (isTrue(returnData)) {
	// 	itemData[key] = returnData
	// 	return data
	// } else {
	// 	return deepClone(dataSource)
	// }
}

//getArrayToObjectTargetValue-start

// const testArray = ['a', 'b', 'c']
// const testObject = { a: { b: { c: 2, d: 2 } } }
// console.log(
// 	'getArrayToObjectTargetValue',
// 	getArrayToObjectTargetValue(testObject, testArray)
// )
// 就是通过数组查找除对象的值 上面就是返回  testObject 的 c的值

//getArrayToObjectTargetValue-end

export function getArrayToObjectTargetValue(dataSource: ObjectMap = {}, arrayData: Array<string | number> = []): any {
	let data = ''
	arrayToObject(dataSource, arrayData, value => {
		data = value
		return value
	})
	return data
}

// const testArray = ['a', 'b', 'c']
// const testObject = { a: { b: { c: 2, d: 2 } } }
// console.log(
// 	'getArrayReduceObject',
// 	getArrayReduceObject(testObject, testArray)
// )

// 和getArrayToObjectTargetValue 一样作用， 就是一个是for 一个是reduce
export function getArrayReduceObject(dataSource: ObjectMap = {}, arrayData: Array<string | number> = []): any {
	const data = deepClone(dataSource)
	let array = deepClone(arrayData)
	array = [data, ...array]
	try {
		return array.reduce((total: any, num: any) => {
			return total[num] || {}
		})
	} catch (e) {
		console.error(e, '数组转对象，数据源与数组类型不匹配', 'dataSource', dataSource, 'arrayData', arrayData)
		return ''
	}
}

// const data = { test: { data: [{ a: 1 }] } }
// const data1 = { test: { data: [{ a: 2, b: 1 }, { a: 3 }] }, sd: 1 }
// const data2 = { test: { data: [{ a: 1 }] }, sd: 1 }
// const logData = diffFormData(data,data1)
// console.log(logData)
export function diffFormData(sourceData, targetData) {
	if (isTrue(sourceData) && isObject(sourceData) && isTrue(targetData) && isObject(targetData)) {
		const targetKey = Object.keys(targetData)
		const sourceKey = Object.keys(sourceData)
		const diffKey = difference(targetKey, sourceKey) || []
		for (const key in sourceData) {
			if (isObject(sourceData[key]) && isObject(targetData[key])) {
				diffFormData(sourceData[key], targetData[key])
			} else if (isArray(sourceData[key]) && isArray(targetData[key])) {
				sourceData[key].forEach((item, index) => {
					diffFormData(item, targetData[key][index])
				})
			}
		}
		diffKey.forEach(res => {
			try {
				sourceData[res] = targetData[res]
			} catch {}
		})
	}
	return sourceData
}
