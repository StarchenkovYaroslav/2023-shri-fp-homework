/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { allPass, compose, count, equals, prop, values, lte, lift, not, complement, length } from 'ramda'

// получение цветов
const getStarColor = prop('star')
const getSquareColor = prop('square')
const getTriangleColor = prop('triangle')
const getCircleColor = prop('circle')

// определение цветов
const isWhite = equals('white')
const isRed = equals('red')
const isOrange = equals('orange')
const isGreen = equals('green')
const isBlue = equals('blue')
const isNotWhite = complement(isWhite)
const isNotRed = complement(isRed)

// определение цвета звезды
const isStarRed = compose(isRed, getStarColor)
const isStarNotWhite = compose(isNotWhite, getStarColor)
const isStarNotRed = compose(isNotRed, getStarColor)

// определение цвета квадрата
const isSquareOrange = compose(isOrange, getSquareColor)
const isSquareGreen = compose(isGreen, getSquareColor)
const isSquareNotWhite = compose(isNotWhite, getSquareColor)

// определение цвета треугольника
const isTriangleWhite = compose(isWhite, getTriangleColor)
const isTriangleGreen = compose(isGreen, getTriangleColor)
const isTriangleNotWhite = compose(isNotWhite, getTriangleColor)

// определение цвета круга
const isCircleWhite = compose(isWhite, getCircleColor)
const isCircleBlue  = compose(isBlue, getCircleColor)

// получение количества цветов
const getAllColors = values()
const getFiguresCount = compose(length, getAllColors)

const getGreenCount = compose(count(isGreen), getAllColors)
const getBlueCount = compose(count(isBlue), getAllColors)
const getRedCount = compose(count(isRed), getAllColors)
const getOrangeCount = compose(count(isOrange), getAllColors)
const getNotWhiteCount = compose(count(isNotWhite), getAllColors)


// вспомогательные функции для валидаторов
const hasTwoGreenFigures = compose(equals(2), getGreenCount)
const hasOneRedFigure = compose(equals(1), getRedCount)
const areTriangleAndSquareOfSameColor = lift(equals)(getTriangleColor, getSquareColor)
const areTriangleAndSquareNotWhite = allPass([isTriangleNotWhite, isSquareNotWhite])

// функции валидаторов
const hasTwoOrMoreGreenFigures = compose(lte(2), getGreenCount)
const redCountEqualsBlueCount = lift(equals)(getRedCount, getBlueCount)
const hasThreeNotWhiteFigures = compose(equals(3), getNotWhiteCount)
const areAllFiguresOrange = lift(equals)(getFiguresCount, getOrangeCount)
const areAllFiguresGreen = lift(equals)(getFiguresCount, getGreenCount)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isStarRed, isSquareGreen, isTriangleWhite, isCircleWhite])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = hasTwoOrMoreGreenFigures

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = redCountEqualsBlueCount

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isStarRed, isSquareOrange, isCircleBlue])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = hasThreeNotWhiteFigures

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([hasTwoGreenFigures, isTriangleGreen, hasOneRedFigure])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = areAllFiguresOrange

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isStarNotWhite, isStarNotRed])

// 9. Все фигуры зеленые.
export const validateFieldN9 = areAllFiguresGreen

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([areTriangleAndSquareOfSameColor, areTriangleAndSquareNotWhite])
