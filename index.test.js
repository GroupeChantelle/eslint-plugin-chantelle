/* eslint fp/no-unused-expression:0, fp/no-nil:0, better/explicit-return:0 */
import { configs, chantelle, legacy, chantelleCommonJs } from './src'

const checkArrayOfObjects = arrayOfObjects =>
  arrayOfObjects.map(arrayOfObjects =>
    expect(typeof arrayOfObjects).toBe('object')
  )

test('exports objects', () => {
  checkArrayOfObjects([configs, chantelle, legacy, chantelleCommonJs])
})

test('exports objects 2', () => {
  ;(({ chantelle, legacy, chantelleCommonJs }) =>
    checkArrayOfObjects([chantelle, legacy, chantelleCommonJs]))(configs)
})
