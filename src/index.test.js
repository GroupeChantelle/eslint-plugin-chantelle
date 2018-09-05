/* eslint fp/no-unused-expression:0, fp/no-nil:0, better/explicit-return:0, no-shadow:0 */
import { configs, nod, legacy, nodCommonJs } from "."

const checkArrayOfObjects = arrayOfObjects =>
  arrayOfObjects.map(arrayOfObjects =>
    expect(typeof arrayOfObjects).toBe('object')
  )

test('exports objects', () => {
  checkArrayOfObjects([configs, nod, legacy, nodCommonJs])
})

test('exports objects 2', () => {
  ;(({ nod, legacy, nodCommonJs }) =>
    checkArrayOfObjects([nod, legacy, nodCommonJs]))(configs)
})
