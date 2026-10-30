const installed = Symbol.for('debinatos.react-performance-guard')

/** Temporary workaround for https://github.com/vercel/next.js/issues/86060. */
export function guardReactPerformanceTiming(target: Pick<Performance, 'measure'>) {
    const original = target.measure as Performance['measure'] & { [installed]?: boolean }
    if (original[installed]) return

    const measure: Performance['measure'] = function (this: Pick<Performance, 'measure'>, name, options, endMark) {
        if (
            name.startsWith('\u200b') &&
            typeof options === 'object' &&
            options !== null &&
            options.detail?.devtools?.trackGroup === 'Server Components ⚛' &&
            typeof options.start === 'number' &&
            typeof options.end === 'number' &&
            (options.start < 0 || options.end < 0)
        ) {
            // Aborted/errored Flight entries can retain an uninitialized negative end time.
            // Keep a valid zero-length timing entry, preserving the original error metadata.
            const start = Math.max(0, options.start)
            return original.call(this, name, { ...options, start, end: Math.max(start, options.end) })
        }
        return original.call(this, name, options, endMark)
    }
    target.measure = Object.assign(measure, { [installed]: true })
}
