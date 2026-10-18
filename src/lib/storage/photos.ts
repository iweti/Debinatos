const DB_NAME = 'debinatos-photos'
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)
        request.onupgradeneeded = () => request.result.createObjectStore('photos')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(new Error('Não foi possível abrir o armazenamento de fotos.'))
    })
}
export async function savePhoto(file: File): Promise<string> {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use uma foto JPG, PNG ou WebP.')
    if (file.size > 5 * 1024 * 1024) throw new Error('Cada foto deve ter até 5 MB.')
    const db = await openDB()
    const key = crypto.randomUUID()
    try {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction('photos', 'readwrite')
            tx.objectStore('photos').put(file, key)
            tx.oncomplete = () => resolve()
            tx.onerror = () => reject(new Error('Não foi possível salvar a foto. Verifique o espaço disponível.'))
            tx.onabort = () => reject(new Error('O salvamento da foto foi interrompido.'))
        })
        return `idb:${key}`
    } finally {
        db.close()
    }
}
export async function loadPhoto(source: string): Promise<Blob | undefined> {
    const db = await openDB()
    try {
        return await new Promise((resolve, reject) => {
            const req = db.transaction('photos').objectStore('photos').get(source.slice(4))
            req.onsuccess = () => resolve(req.result)
            req.onerror = () => reject(req.error)
        })
    } finally {
        db.close()
    }
}
export async function clearPhotos() {
    const db = await openDB()
    try {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction('photos', 'readwrite')
            tx.objectStore('photos').clear()
            tx.oncomplete = () => resolve()
            tx.onerror = () => reject(tx.error)
        })
    } finally {
        db.close()
    }
}
