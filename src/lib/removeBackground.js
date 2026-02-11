/**
 * Remove background from an image using remove.bg API
 * @param {Blob} imageBlob - The image file to process
 * @returns {Promise<Blob>} - Image with background removed
 */
export const removeBackground = async (imageBlob) => {
    const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY

    // Check if API key is configured
    if (!apiKey || apiKey === 'your_removebg_api_key_here') {
        console.warn('Remove.bg API key not configured. Skipping background removal.')
        return imageBlob // Return original image if no API key
    }

    try {
        const formData = new FormData()
        formData.append('image_file', imageBlob)
        formData.append('size', 'auto')

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey
            },
            body: formData
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.errors?.[0]?.title || 'Background removal failed')
        }

        const blob = await response.blob()
        return blob
    } catch (error) {
        console.error('Background removal error:', error)
        // Fallback: return original image if API fails
        alert('Background removal failed. Using original image.')
        return imageBlob
    }
}
