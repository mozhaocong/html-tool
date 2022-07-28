export function getSearchString(query = {}) {
	const res = new URLSearchParams(query)
	return res.toString()
}
