import { createContext, useContext } from 'react'

import type { CartAnimationPhoto } from './CartAdditionAnimation'

export const CartAnimationContext = createContext<(photo: CartAnimationPhoto) => void>(() => {})
export const useCartAnimation = () => useContext(CartAnimationContext)
