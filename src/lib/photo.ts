/**
 * Reads an image file the user picked (or shot via the camera) and returns a
 * downscaled, JPEG-encoded data URL safe to store in localStorage.
 *
 * - max edge 720px (covers all device retina cases without bloating storage)
 * - quality 0.82
 * - falls back to the original data URL if downscaling somehow fails
 */
export async function fileToDownscaledDataUrl(
  file: File,
  maxEdge = 720,
  quality = 0.82,
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.onerror = () => reject(fr.error || new Error('FileReader failed'))
    fr.readAsDataURL(file)
  })

  try {
    const img = await loadImage(dataUrl)
    const { width, height } = img
    const longest = Math.max(width, height)
    if (longest <= maxEdge) return dataUrl

    const scale = maxEdge / longest
    const w = Math.round(width * scale)
    const h = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return dataUrl
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', quality)
  } catch {
    return dataUrl
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = src
  })
}
