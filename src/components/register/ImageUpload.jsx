import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../../lib/utils'
import { Upload, X, Check } from 'lucide-react'

const ImageUpload = ({ onImageSelected }) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)
            setImageSrc(imageDataUrl)
            setPreviewUrl(null)
        }
    }

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            )
            console.log('donee', { croppedImage })

            // Create a preview URL
            const url = URL.createObjectURL(croppedImage)
            setPreviewUrl(url)

            onImageSelected(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }, [imageSrc, croppedAreaPixels, onImageSelected])

    const cancelCrop = () => {
        setImageSrc(null)
        setPreviewUrl(null)
        onImageSelected(null)
    }

    if (previewUrl) {
        return (
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gold shadow-lg mb-4">
                    <img src={previewUrl} alt="Cropped" className="w-full h-full object-cover" />
                    <button
                        onClick={cancelCrop}
                        className="absolute top-0 right-0 bg-red-500 p-1 rounded-full m-1 hover:bg-red-600 transition-colors"
                    >
                        <X size={16} className="text-white" />
                    </button>
                </div>
                <p className="text-neon text-sm flex items-center gap-1"><Check size={16} /> Photo Ready</p>
            </div>
        )
    }

    if (imageSrc) {
        return (
            <div className="flex flex-col items-center w-full">
                <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden mb-4">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={cancelCrop}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 font-oswald uppercase"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={showCroppedImage}
                        className="px-4 py-2 bg-neon text-black rounded hover:bg-neon/80 font-oswald uppercase"
                    >
                        Confirm Crop
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white/5 text-white rounded-lg shadow-lg tracking-wide uppercase border border-white/10 cursor-pointer hover:bg-white/10 hover:border-gold transition-all group">
                <Upload className="w-8 h-8 text-gold group-hover:scale-110 transition-transform mb-2" />
                <span className="mt-2 text-base leading-normal font-oswald">Select Photo</span>
                <input type='file' className="hidden" accept="image/*" onChange={onFileChange} />
            </label>
        </div>
    )
}

export default ImageUpload
