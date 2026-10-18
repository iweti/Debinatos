import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { clearPhotos, loadPhoto, savePhoto } from '../storage/photos'

afterEach(async () => {
    await clearPhotos()
})

describe('Fotos locais em IndexedDB', () => {
    it('salva um arquivo e o recupera por uma referência estável', async () => {
        const photo = new File(['photo-demo'], 'encanto.jpg', {
            type: 'image/jpeg',
        })
        const source = await savePhoto(photo)
        expect(source).toMatch(/^idb:/)
        const stored = await loadPhoto(source)
        expect(stored?.type).toBe('image/jpeg')
        expect(await stored?.text()).toBe('photo-demo')
    })
    it('rejeita formato não suportado', async () => {
        await expect(savePhoto(new File(['svg'], 'image.svg', { type: 'image/svg+xml' }))).rejects.toThrow('JPG, PNG ou WebP')
    })
    it('rejeita imagens maiores que 5 MB', async () => {
        const photo = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', {
            type: 'image/png',
        })
        await expect(savePhoto(photo)).rejects.toThrow('5 MB')
    })
    it('limpa fotos ao restaurar a demonstração', async () => {
        const source = await savePhoto(new File(['photo'], 'photo.webp', { type: 'image/webp' }))
        await clearPhotos()
        expect(await loadPhoto(source)).toBeUndefined()
    })
})
