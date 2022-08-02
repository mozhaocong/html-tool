export function getSearchString(query = {}): string {
	const res = new URLSearchParams(query)
	return res.toString()
}
