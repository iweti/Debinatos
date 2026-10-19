export function Loading() {
    return (
        <div className="mx-auto flex min-h-96 max-w-7xl items-center justify-center gap-3 px-6 text-sm text-muted" role="status">
            <span className="size-5 animate-spin rounded-full border-2 border-brand/20 border-t-brand motion-reduce:animate-none" />
            Preparando seus encantos…
        </div>
    )
}
