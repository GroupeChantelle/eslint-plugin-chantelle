import { configs, nod, legacy, nodCommonJs } from './server'

const name = '@nod/eslint-plugin-nod'

const checkArrayOfObjects = arrayOfObjects =>
  arrayOfObjects.map(arrayOfObjects =>
    expect(typeof arrayOfObjects).toBe('object')
  )

describe(name, () => {
  test('exports objects', () => {
    checkArrayOfObjects([configs, nod, legacy, nodCommonJs])
  })

  test('exports objects 2', () => {
    ;(({ nod, legacy, nodCommonJs }) =>
      checkArrayOfObjects([nod, legacy, nodCommonJs]))(configs)
  })
})
