module.exports = {
  extends: 'eslint:recommended',
  env: {
    browser: true,
    es6: true
  },
  ecmaFeatures: {
    blockBindings: true,
    templateStrings: true
  },
  globals: {
    module: true,
    define: true
  },
  rules: {
    'no-console': 1,
    'eol-last': 1,
    'space-before-blocks': [1, 'always'],
    quotes: [1, 'single'],
    indent: [2, 2, {
      "SwitchCase": 1
    }]
  }
}
