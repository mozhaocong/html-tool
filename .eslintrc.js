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
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': 'error'
	}
}
