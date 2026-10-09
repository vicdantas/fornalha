// Reduz a foto no próprio navegador antes do upload: uma foto de celular
// (4–8 MB) vira um WebP de ~150 KB, o que deixa a loja leve e poupa o Storage.
const MAX_SIDE = 1200
const QUALITY = 0.82

export async function compressImage(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', QUALITY))
  // Navegadores sem encoder WebP devolvem PNG (maior que o original): mantém a foto original.
  if (!blob || blob.type !== 'image/webp') return file

  const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
  return new File([blob], name, { type: 'image/webp' })
}
