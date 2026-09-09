// @ts-check
const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const typescriptEslint = require('typescript-eslint');

module.exports = typescriptEslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended
    ],
    rules: {
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/button-has-type': 'error'
    }
  }
);

