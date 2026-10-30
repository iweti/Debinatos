import { performance } from 'node:perf_hooks'

import { describe, expect, it, vi } from 'vitest'

import { guardReactPerformanceTiming } from '../client/react-performance'

const detail = { devtools: { trackGroup: 'Server Components ⚛', tooltipText: 'Page Errored' } }

function timing() {
    const target = { measure: performance.measure.bind(performance) as Performance['measure'] }
    guardReactPerformanceTiming(target)
    return target
}

describe('React development performance timing workaround', () => {
    it.each([-1, -23583.898, -Infinity])('normalizes a React component end timestamp of %s', (end) => {
        const entry = timing().measure('\u200bPage', { start: 0, end, detail })
        expect(entry.startTime).toBe(0)
        expect(entry.duration).toBe(0)
        expect(entry.detail).toEqual(detail)
    })

    it('retains a valid start time when the end is uninitialized', () => {
        const entry = timing().measure('\u200bPage', { start: 25, end: -Infinity, detail })
        expect(entry.startTime).toBe(25)
        expect(entry.duration).toBe(0)
    })

    it('preserves valid React component measurements', () => {
        const entry = timing().measure('\u200bPage', { start: 10, end: 30, detail })
        expect(entry.startTime).toBe(10)
        expect(entry.duration).toBe(20)
    })

    it('does not hide invalid application measurements or missing marks', () => {
        expect(() => timing().measure('upload', { start: 0, end: -1 })).toThrow()
        expect(() => timing().measure('\u200bPage', { start: 0, end: -1 })).toThrow()
        expect(() => timing().measure('upload', 'missing-start-mark')).toThrow()
    })

    it('preserves the receiver and all arguments for ordinary measurements', () => {
        const original = vi.fn<Performance['measure']>()
        const target = { measure: original }
        guardReactPerformanceTiming(target)
        target.measure('ordinary', 'start-mark', 'end-mark')
        expect(original).toHaveBeenCalledWith('ordinary', 'start-mark', 'end-mark')
        expect(original.mock.contexts[0]).toBe(target)
    })

    it('does not wrap the measurement function twice', () => {
        const target = timing()
        const measure = target.measure
        guardReactPerformanceTiming(target)
        expect(target.measure).toBe(measure)
    })
})
