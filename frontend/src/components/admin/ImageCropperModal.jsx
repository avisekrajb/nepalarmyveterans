import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { X, RotateCcw, RotateCw, ZoomIn, Crop, Wand2, Check } from 'lucide-react';

const getCroppedImg = (imageSrc, pixelCrop, rotation = 0) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const rotRad = (rotation * Math.PI) / 180;
      const { width: bBoxWidth, height: bBoxHeight } = getRotatedSize(image.width, image.height, rotRad);

      canvas.width = bBoxWidth;
      canvas.height = bBoxHeight;

      ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
      ctx.rotate(rotRad);
      ctx.translate(-image.width / 2, -image.height / 2);
      ctx.drawImage(image, 0, 0);

      const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.putImageData(data, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          blob.name = 'cropped-image.jpg';
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    };
    image.onerror = reject;
    image.src = imageSrc;
  });

const getRotatedSize = (width, height, rotation) => {
  if (!rotation) return { width, height };
  const absCos = Math.abs(Math.cos(rotation));
  const absSin = Math.abs(Math.sin(rotation));
  return {
    width: Math.floor(width * absCos + height * absSin),
    height: Math.floor(width * absSin + height * absCos),
  };
};

const ASPECT_RATIOS = [
  { label: '4:3', value: 4 / 3 },
  { label: 'Square', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
];

const ImageCropperModal = ({ imageSrc, onCancel, onCropDone, aspectRatio = 4 / 3 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState(aspectRatio);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const setRecommended = () => {
    setZoom(1.1);
    setRotation(0);
    setCrop({ x: 50, y: 50 });
    setRatio(aspectRatio);
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropDone(blob);
    } catch (error) {
      console.error('Crop failed:', error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Crop className="h-5 w-5 text-[#C9A227]" />
            <h3 className="font-semibold text-lg text-gray-800">Crop & Rotate Photo</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={setRecommended} className="flex items-center gap-1.5 text-xs font-medium text-[#1F3D2B] bg-[#1F3D2B]/5 hover:bg-[#1F3D2B]/10 px-3 py-2 rounded-xl transition-colors">
              <Wand2 className="h-3.5 w-3.5" /> Recommended
            </button>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          {/* Crop area */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{ height: 380 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={ratio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              cropShape="rect"
            />
          </div>

          {/* Live preview - shows exactly what the cropped result will look like */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-600" /> Live Preview (result)
                </span>
              </div>
              <div className="bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center" style={{ height: 380 }}>
                {croppedAreaPixels ? (
                  <CroppedPreview
                    imageSrc={imageSrc}
                    pixelCrop={croppedAreaPixels}
                    rotation={rotation}
                  />
                ) : (
                  <p className="text-gray-500 text-sm">Adjust crop to preview</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pb-6 space-y-4">
          {/* Aspect ratio */}
          <div>
            <span className="text-xs font-medium text-gray-500 mb-1.5 block">Aspect Ratio</span>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => setRatio(a.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ratio === a.value ? 'bg-[#1F3D2B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rotate */}
          <div>
            <span className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1.5">Rotate</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-600 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> 90°
              </button>
              <button onClick={() => setRotation((r) => (r + 90) % 360)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-600 transition-colors">
                <RotateCw className="h-3.5 w-3.5" /> 90°
              </button>
              <span className="text-xs text-gray-400 ml-2">Rotation: {rotation}°</span>
            </div>
          </div>

          {/* Zoom */}
          <div>
            <span className="text-xs font-medium text-gray-500 mb-1.5 block flex items-center gap-1.5"><ZoomIn className="h-3.5 w-3.5" /> Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#C9A227]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button onClick={onCancel} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={saving || !croppedAreaPixels}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#1F3D2B] text-white hover:bg-[#2E5940] transition-colors disabled:opacity-50"
            >
              {saving ? 'Processing...' : <><Check className="h-4 w-4" /> Apply Crop</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Renders the actual cropped + rotated result as the preview */
const CroppedPreview = ({ imageSrc, pixelCrop, rotation }) => {
  const [src, setSrc] = useState(null);
  const urlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getCroppedImg(imageSrc, pixelCrop, rotation)
      .then((blob) => {
        if (cancelled) return;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setSrc(url);
      })
      .catch(() => {});
    return () => { cancelled = true; if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, [imageSrc, pixelCrop, rotation]);

  if (!src) {
    return <p className="text-gray-500 text-sm">Generating preview...</p>;
  }

  return <img src={src} alt="Cropped result" className="max-w-full max-h-full rounded-xl" />;
};

export default ImageCropperModal;
