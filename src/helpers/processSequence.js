/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  allPass,
  compose,
  prop,
  test,
  tap,
  andThen,
  modulo,
  length,
  __, otherwise, curry,
} from 'ramda'

// валидация
const regChars = /^[1-9]\d*\.?\d+$/
const regLength = /^.{3,9}$/

const isOfValidChars = test(regChars)
const isOfValidLength = test(regLength)

const isValueValid = allPass([isOfValidChars, isOfValidLength])
const validate = value => new Promise((resolve, reject) => {
  return isValueValid(value) ? resolve(value) : reject('validationError')
})

// обработка промиса
const promise = curry((rejectHandler, resolveHandler, promise) => {
  return compose(
    otherwise(rejectHandler),
    andThen(resolveHandler),
    promise,
  )
})

// математические функции
const round = (string) => Math.round(Number(string))
const square = (number) => Math.pow(number, 2)
const mod3 = modulo(__, 3)

// функции api
const api = new Api();

const convertNumberBase = api.get('https://api.tech/numbers/base')
const getConvertedNumber = (number) => convertNumberBase({from: 2, to: 10, number: `${number}`})
const getAnimal = (animalId) => api.get(`https://animals.tech/${animalId}`)({})
const parseServerResponse = prop('result')

// master функция
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const promiseWithRejection = promise(handleError)
  const log = tap(writeLog)

  const handleAnimal = compose(
    tap(handleSuccess),
    parseServerResponse,
  )

  const handleConvertedNumber = compose(
    promiseWithRejection(handleAnimal, getAnimal),
    log,
    mod3,
    log,
    square,
    log,
    length,
    parseServerResponse,
  )

  const handleValidatedInput = compose(
    promiseWithRejection(handleConvertedNumber, getConvertedNumber),
    log,
    round,
  )

  compose(
    promiseWithRejection(handleValidatedInput, validate),
    log,
  )(value)
}

export default processSequence;
