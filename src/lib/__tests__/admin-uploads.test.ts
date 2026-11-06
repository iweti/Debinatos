import { Writable } from 'node:stream'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), sql: vi.fn(), upload: vi.fn() }))
vi.mock('server-only', () => ({}))
vi.mock('@/lib/server/auth', () => ({ requireAdmin: mocks.requireAdmin }))
vi.mock('@/lib/server/db', () => ({ database: () => mocks.sql }))
vi.mock('@/lib/server/cloudinary', () => ({ imageService: () => ({ sdk: { uploader: { upload_stream: mocks.upload } }, folder: 'test' }) }))

import { MAX_IMAGE_BYTES } from '@/lib/domain/image-upload'
import { uploadImage } from '@/lib/server/admin-uploads'

function form(size = 10, type = 'image/png') {
    const data = new FormData()
    data.set('file', new File([new Uint8Array(size)], 'photo.png', { type }))
    return data
}

beforeEach(() => {
    vi.resetAllMocks()
    mocks.requireAdmin.mockResolvedValue({ id: 'admin-id' })
    mocks.sql.mockResolvedValue([{ allowed: true }])
    mocks.upload.mockImplementation(
        (...[, callback]) =>
            new Writable({
                write(...[, , done]) {
                    done()
                },
                final(done) {
                    callback(undefined, { secure_url: 'https://res.cloudinary.com/test/image/upload/photo.png' })
                    done()
                },
            })
    )
})

describe('Upload validado no servidor', () => {
    it('recusa sem autenticação antes de consultar a cota ou o provedor', async () => {
        mocks.requireAdmin.mockRejectedValue(new Error('NEXT_REDIRECT'))
        await expect(uploadImage(form())).rejects.toThrow('NEXT_REDIRECT')
        expect(mocks.sql).not.toHaveBeenCalled()
        expect(mocks.upload).not.toHaveBeenCalled()
    })

    it.each([
        [0, 'image/png'],
        [MAX_IMAGE_BYTES + 1, 'image/png'],
        [10, 'image/svg+xml'],
    ])('recusa tamanho/tipo inválido (%s, %s)', async (size, type) => {
        expect(await uploadImage(form(size as number, type as string))).toHaveProperty('error')
        expect(mocks.sql).not.toHaveBeenCalled()
        expect(mocks.upload).not.toHaveBeenCalled()
    })

    it('recusa strings e arquivos ausentes', async () => {
        const data = new FormData()
        expect(await uploadImage(data)).toHaveProperty('error')
        data.set('file', 'https://example.com/file.png')
        expect(await uploadImage(data)).toHaveProperty('error')
        expect(mocks.upload).not.toHaveBeenCalled()
    })

    it.each([false, undefined])('não envia se a reserva não for explicitamente permitida (%s)', async (allowed) => {
        mocks.sql.mockResolvedValue([{ allowed }])
        expect(await uploadImage(form())).toHaveProperty('error')
        expect(mocks.upload).not.toHaveBeenCalled()
    })

    it('falha fechado se a migração/cota estiver indisponível', async () => {
        mocks.sql.mockRejectedValue(new Error('Database unavailable'))
        expect(await uploadImage(form())).toHaveProperty('error')
        expect(mocks.upload).not.toHaveBeenCalled()
    })

    it('aceita o limite exato, reserva antes do upload e retorna somente a URL', async () => {
        expect(await uploadImage(form(MAX_IMAGE_BYTES))).toEqual({ url: 'https://res.cloudinary.com/test/image/upload/photo.png' })
        expect(mocks.sql.mock.calls[0][1]).toBe('admin-id')
        expect(mocks.sql.mock.invocationCallOrder[0]).toBeLessThan(mocks.upload.mock.invocationCallOrder[0])
        expect(mocks.upload.mock.calls[0][0]).toMatchObject({ resource_type: 'image', allowed_formats: ['jpg', 'png', 'webp'], overwrite: false })
    })

    it('não expõe erros do provedor nem devolve a reserva após falhar', async () => {
        mocks.upload.mockImplementation(
            (...[, callback]) =>
                new Writable({
                    write(...[, , done]) {
                        callback(new Error('secret-provider-error'))
                        done()
                    },
                })
        )
        const result = await uploadImage(form())
        expect(result).toHaveProperty('error')
        expect(JSON.stringify(result)).not.toContain('secret-provider-error')
        expect(mocks.sql).toHaveBeenCalledOnce()
    })
})
