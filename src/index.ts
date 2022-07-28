import 'ramda'
export { isTrue, isString, isArray, isObject, isNumber, isFunction, isBlob, isFunctionOfOther } from './tools/typeJudgment'
export { serialNumber, DebouncedFunc, debounce, throttle } from './tools/common'
export {
	setArrayData,
	forArrayData,
	getArrayFilterData,
	setArrayFilter,
	ArrayKeyToMap,
	ArrayKeyToObject,
	ObjectToArray,
	ArrayObjectIncludes,
	setObjetToObject,
	deepClone
} from './tools/data'

export { default as EventBus } from './tools/eventBus'
export { axiosInit, get, post, methodType } from './http'
