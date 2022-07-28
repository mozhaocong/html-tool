import { is, isEmpty, isNil } from 'ramda'
type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
	[key in Key]: Value
}
export function isString(value: any): value is string {
	return is(String, value)
}

export function isNumber(value: any): value is number {
	return is(Number, value)
}
export function isArray(value: any): value is [] {
	return is(Array, value)
}
export function isObject(value: any): value is ObjectMap {
	return is(Object, value)
}

export function isTrue(value: any): boolean {
	return !(isEmpty(value) || isNil(value))
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(fn: any): fn is Function {
	return is(Function, fn)
}

export function isBlob(fn: any): fn is Blob {
	return is(Blob, fn)
}

// 判断类型是不是函数
export function isFunctionOfOther(value: any, callValue: ObjectMap = {}) {
	if (isTrue(value)) {
		if (isFunction(value)) {
			return value(callValue) as any
		} else {
			return value
		}
	} else {
		return ''
	}
}
