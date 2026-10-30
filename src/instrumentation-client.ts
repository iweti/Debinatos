import { guardReactPerformanceTiming } from '@/lib/client/react-performance'

// Install before hydration; production measurements remain untouched.
if (process.env.NODE_ENV === 'development') {
    guardReactPerformanceTiming(performance)
}
