/*
 * @Description:
 * @Author: wanghengzhen
 * @Date: 2022-02-11 15:43:38
 * @LastEditTime: 2022-02-11 16:23:22
 */
module.exports = {
	root: true,
	env: {
		node: true,
		es6: true
	},
	extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	globals: {
		__webpack_public_path__: true
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': 'error'
	}
}
