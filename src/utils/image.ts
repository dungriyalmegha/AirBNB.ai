/** Unsplash helper so image size/quality can be tuned in one place. */
export function unsplash(id: string, w = 1600): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
}

/** Resize a picked file in the browser so it fits comfortably in localStorage. */
export function fileToCompressedDataUrl(file: File, maxSize = 1600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Not a valid image'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas unavailable'))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/** Resized URL for Unsplash images; other URLs are returned unchanged. */
export function sized(url: string, w: number): string {
  if (!url.includes('images.unsplash.com')) return url
  return url.replace(/([?&])w=\d+/, `$1w=${w}`)
}
