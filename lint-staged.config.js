module.exports = {
	'{src,tests}/**/*.{ts,tsx}': 'eslint --fix',
	'src/**/*.scss': 'stylelint --fix',
	'**/*.{ts,tsx,scss,js,json}': 'prettier --write',
};
