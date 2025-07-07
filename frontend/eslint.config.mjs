// Import global variables for browser and Jest environments
import globals from 'globals';

// Import necessary ESLint plugins
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react'; // Renamed to avoid conflict
import reactHooks from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest'; // Renamed to avoid conflict
import tsPlugin from '@typescript-eslint/eslint-plugin'; // Renamed to avoid conflict
import tsParser from '@typescript-eslint/parser';
import { fixupPluginRules } from '@eslint/compat';

export default [
  // Apply recommended ESLint rules for JavaScript
  js.configs.recommended,

  {
    files: ['src/**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    ignores: ['src/types/hoops_web_viewer.d.ts', 'src/types/tcc.d.ts'],
    languageOptions: {
      parser: tsParser, // Properly set TypeScript parser
      parserOptions: {
        project: './tsconfig.json', // Ensure this points to your tsconfig.json
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        Communicator: 'readonly',
        React: 'readonly',
        ReactElement: 'readonly',
        process: "readonly",
      }, // Merge browser and Jest globals
    },
    plugins: {
      react: reactPlugin, // React plugin
      'react-hooks': fixupPluginRules(reactHooks), // React Hooks plugin
      jest: fixupPluginRules(jestPlugin), // Jest plugin
      '@typescript-eslint': fixupPluginRules(tsPlugin), // TypeScript ESLint plugin
    },
    settings: {
      react: {
        version: 'detect', // Auto-detect the React version
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // React-specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-fragments': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-closing-bracket-location': 'error',
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/no-unused-prop-types': 'error',
      'react/no-multi-comp': 'error',
      'react/no-danger': 'error',
      'react/no-array-index-key': 'error',
      'react/self-closing-comp': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',

      // General JavaScript rules
      'no-unused-vars': 'off', // Handled by TypeScript
      'no-console': 'off',
      'array-callback-return': 'error',
      'no-use-before-define': 'off', // Handled by TypeScript
      '@typescript-eslint/no-use-before-define': 'error',
      'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      'react/react-in-jsx-scope': 'off',

      // Allow some Three.js-related properties that ESLint may not recognize
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'userData',
            'object',
            'intensity',
            'position',
            'args',
            'castShadow',
            'metalness',
            'roughness',
            'emissive',
            'rotation',
            'aoMapIntensity',
            'displacementScale',
            'normalMap-encoding',
          ],
        },
      ],
    },
  },
];
