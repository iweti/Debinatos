import { describe, expect, it } from 'vitest'

import { formatMoney, MAX_PRICE_CENTS, parsePrice, priceInput, validPriceCents } from '../domain/money'

describe('Preços em reais', () => {
    it.each([
        ['19,90', 1990],
        ['19.90', 1990],
        [' 19,9 ', 1990],
        ['10', 1000],
        ['0,01', 1],
        ['0.29', 29],
        ['21474836,47', MAX_PRICE_CENTS],
    ])('converte %s sem arredondar centavos', (input, cents) => {
        expect(parsePrice(input)).toBe(cents)
        expect(parsePrice(priceInput(cents))).toBe(cents)
    })

    it.each(['', ' ', '0', '0,00', '-1', '19,999', '1.000,00', '1e2', 'Infinity', 'NaN', '10abc', '21474836,48'])('rejeita %j', (input) => {
        expect(parsePrice(input)).toBeUndefined()
    })

    it.each([null, undefined, '1990', 0, -1, 19.9, NaN, Infinity, MAX_PRICE_CENTS + 1])('recusa centavos inválidos: %s', (input) => {
        expect(validPriceCents(input)).toBe(false)
    })

    it('formata reais e totais grandes sem perder precisão', () => {
        expect(formatMoney(1990)).toBe('R$\u00a019,90')
        expect(formatMoney(0n)).toBe('R$\u00a00,00')
        expect(formatMoney(6970n)).toBe('R$\u00a069,70')
        expect(formatMoney(900719925474099301n)).toBe('R$\u00a09.007.199.254.740.993,01')
    })
})
