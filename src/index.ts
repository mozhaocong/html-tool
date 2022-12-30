export { isTrue, isString, isArray, isObject, isNumber, isFunction, isBlob, isFunctionOfOther, isBoolean } from './tools/typeJudgment'
export { serialNumber, debounce, throttle } from './tools/common'
export { autoCompute, numCompute } from './tools/calculation'
export {
	setArrayData,
	forArrayData,
	getArrayFilterData,
	setArrayFilter,
	arrayKeyToMap,
	arrayKeyToObject,
	objectToArray,
	arrayObjectIncludes,
	setObjetToObject,
	deepClone,
	dataNumberToString,
	dayJsDataToString,
	arrayObjectJudgeNullObject,
	objectFilterEmpty,
	objectFilterNull,
	arrayGetData,
	objectRecursiveMerge,
	arrayToObject,
	getArrayReduceObject,
	getArrayToObjectTargetValue,
	objectRepeatObject,
	arrayGetDataList,
	diffFormData
} from './tools/data'

export { default as EventBus } from './tools/eventBus'
export { axiosInit, axiosGet, axiosPost, methodType } from './http'
export { getSearchString } from './tools/url'
export { mockDataSource } from './mock'
