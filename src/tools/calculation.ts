import { isTrue } from './typeJudgment'
// 精确数据
export function numCompute(A, B, F, digit) {
	digit = digit || 1
	function zeroPadding(number) {
		const array = number.toString().split('.')
		if (array.length === 2) {
			for (let i = 0; i < digit; i++) {
				array[1] += '0'
			}
			return parseInt(array[0] + array[1].substring(0, digit))
		} else {
			let data = ''
			for (let i = 0; i < digit; i++) {
				data += '0'
			}
			return parseInt(array[0] + data) || 0
		}
	}
	if (!isTrue(A) || !isTrue(B)) {
		return 0
	}
	const m = Math.pow(10, digit)
	const dataA = zeroPadding(A)
	const dataB = zeroPadding(B)
	let parseData = 0
	switch (F) {
		case '+':
			parseData = (dataA + dataB) / m
			break
		case '-':
			parseData = (dataA - dataB) / m
			break
		case '*':
			parseData = (dataA * dataB) / (m * m)
			break
		case '/':
			parseData = dataA / dataB
			break
	}
	// return parseData
	const parseDataString = parseData?.toFixed(digit)
	return Number(parseDataString || 0)
}

export function autoCompute(A = 0, B = 0, F) {
	let digit = 0
	const List = [A, B]
	List.forEach(res => {
		if (!isTrue(res)) {
			return
		}
		const digitData = res.toString().split('.')
		if (digitData[1]) {
			if (digit < digitData[1].length) {
				digit = digitData[1].length
			}
		}
	})
	return numCompute(A, B, F, digit)
}

export function formatNumber(num, digit = 2) {
	return Number(num.toFixed(digit))
}
