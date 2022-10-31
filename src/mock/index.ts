export function mockDataSource(item: any[], nubData = 10): any[] {
	const data = item.map(res => {
		return { key: res.dataIndex ?? res.key }
	})
	let nub = 0
	return [...new Array(nubData)].map(() => {
		const returnData: any = { id: nub }
		nub++
		for (const item of data) {
			returnData[item.key] = nub
			nub++
		}
		return returnData
	})
}
