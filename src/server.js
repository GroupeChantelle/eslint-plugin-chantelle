/* eslint fp/no-mutating-methods:0, fp/no-mutation:0, fp/no-let:0, better/no-new:0, no-console:0, fp/no-unused-expression:0, better/no-ifs:0 */
import cleanjs from 'eslint-config-cleanjs'
import pick from 'lodash.pick'
import merge from 'lodash.merge'
import reduce from 'lodash.reduce'
import { peerDependencies } from '../package.json'

export const pluginsDependencies = reduce(
  peerDependencies,
  (plugins, version, dependency) => {
    if (dependency.indexOf('eslint-plugin') === 0) {
      plugins.push(dependency.replace('eslint-plugin-', ''))
    }
    return plugins
  },
  []
)

export const nodRules = {
  // flow
  'flowtype/space-after-type-colon': 0,
  'flowtype/space-before-type-colon': 0,

  // fp
  'fp/no-rest-parameters': 0,

  // better
  'better/no-new': 0,

  // react
  'react/no-unused-prop-types': 1,
  'react/jsx-indent': 0,
  'react/jsx-filename-extension': 0,
  'react/jsx-closing-tag-location': 0,
  'react/jsx-one-expression-per-line': 0,

  'array-callback-return': 2,
  'arrow-parens': [2, 'as-needed'],

  'new-cap': 0,
  'key-spacing': [
    2,
    {
      beforeColon: false,
      afterColon: true
    }
  ],

  'import/no-extraneous-dependencies': [
    1,
    {
      devDependencies: true,
      optionalDependencies: true,
      peerDependencies: true
    }
  ],
  'import/no-unresolved': 1,

  'global-require': 1,
  'no-unused-vars': 1,
  'no-underscore-dangle': 1,
  'no-template-curly-in-string': 1,
  'no-shadow': 0,
  'no-use-before-define': 1,
  'no-param-reassign': 1,
  'block-scoped-var': 1,
  'no-nested-ternary': 1
}

export const propsToPick = ['env', 'parserOptions', 'root', 'settings']

export const getConfigBase = () => ({
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'prettier',
    'plugin:flowtype/recommended',
    'plugin:jest/recommended',
    'plugin:fp/recommended'
  ],
  plugins: [
    '@nod/nod',
    'jest',
    'babel',
    'flowtype',
    'fp',
    'import',
    'jsx-a11y',
    'react',
    'better'
  ],

  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true
  },

  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

const isPluginRule = ruleName =>
  pluginsDependencies.some(plugin => ruleName.indexOf(`${plugin}/`) === 0)

const getConfigRules = config =>
  Object.keys(config && config.rules ? config.rules : {}).reduce(
    (rules, ruleName) => {
      const result = Object.assign({}, rules)
      const key = isPluginRule(ruleName) ? `${ruleName}` : ruleName

      result[key] = config.rules[ruleName]

      return result
    },
    {}
  )

const extendConfig = (config, ext) => {
  let extension = ext

  if (typeof extension === 'string') {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    extension = require(ext)
  }

  const extensionRules = {
    rules: Object.assign({}, getConfigRules(extension), nodRules)
  }

  return merge(config, pick(extension, propsToPick), extensionRules)
}

export const createConfig = extension => {
  let config = extendConfig(getConfigBase(), extension)

  if (extension.extends && extension.extends.length) {
    config = extension.extends.reduce(extendConfig, config)
  }

  return config
}

const emptyConfig = Object.assign({}, createConfig({}))
const cleanJsConfig = createConfig(cleanjs)
const { parserOptions, rules } = cleanJsConfig

export const legacy = emptyConfig
export const nod = cleanJsConfig
export const nodCommonJs = {
  ...cleanJsConfig,
  parserOptions: {
    ...parserOptions,
    sourceType: 'script'
  },
  rules: {
    ...rules,
    'global-require': 0,
    'import/no-commonjs': 0,
    'fp/no-mutation': 0
  }
}

export const configs = { legacy, nod, nodCommonJs }
export default configs
