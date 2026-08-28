/**
 * Normalizes an image URL, specifically converting Google Drive sharing links
 * to direct download links that can be used in <img> tags.
 */
export const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) return ''

  // Handle Google Drive links
  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    // Look for ID in query params (?id=...) or path (/d/...)
    const match = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/]+)/)
    const id = match ? match[1] : null

    if (id) {
      // Return the direct content URL which is often more reliable for previewing
      return `https://drive.usercontent.google.com/download?id=${id}&export=view`
    }
  }

  return url
}
