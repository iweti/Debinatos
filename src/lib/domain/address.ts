import type { Address } from '../types/store'

export function validAddress(address: Address) {
    return (
        /^\d{8}$/.test(address.cep.replace(/\D/g, '')) &&
        !!address.street.trim() &&
        !!address.number.trim() &&
        !!address.district.trim() &&
        !!address.city.trim() &&
        /^[A-Za-z]{2}$/.test(address.state)
    )
}
