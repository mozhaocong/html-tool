import 'ramda'
import { isTrue, isString, isArray, isObject, isNumber, isFunction} from './tools/typeJudgment'
import { serialNumber, DebouncedFunc, debounce, throttle } from './tools/common'
import {setArrayData, forArrayData, getArrayFilterData, setArrayFilter, ArrayKeyToMap, ArrayKeyToObject, ObjectToArray, ArrayObjectIncludes, setObjetToObject, deepClone } from './tools/data'

export {isTrue, isString, isArray, isObject, isNumber, isFunction, setObjetToObject, ObjectToArray, ArrayKeyToObject, ArrayKeyToMap, ArrayObjectIncludes, setArrayFilter, getArrayFilterData, forArrayData, setArrayData, serialNumber, DebouncedFunc, debounce, throttle, deepClone}


