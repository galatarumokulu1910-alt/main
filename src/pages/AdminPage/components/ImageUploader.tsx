import { useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    bucketName?: string;
    folderPath?: string;
    maxWidth?: number; // Configurable max width per placeholder
}

export default function ImageUploader({
    value,
    onChange,
    bucketName = 'media',
    folderPath = 'uploads',
    maxWidth = 1920 // Default max width if not specified
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const optimizeImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context not available'));
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            // Extract original filename without extension to use with .webp
                            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                            const optimizedFile = new File([blob], `${originalName}.webp`, { type: 'image/webp' });
                            resolve(optimizedFile);
                        } else {
                            reject(new Error('Image optimization failed'));
                        }
                    }, 'image/webp', 0.8);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            const originalFile = e.target.files[0];
            setUploading(true);
            setError(null);

            // Optimize the image before upload
            const file = await optimizeImage(originalFile);

            const fileExt = 'webp';
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${folderPath}/${fileName}`;

            // Upload the optimized webp file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, { upsert: true, contentType: 'image/webp' });

            if (uploadError) throw uploadError;

            // Get the Public URL
            const { data } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            // Pass the public URL back to the parent form
            onChange(data.publicUrl);
        } catch (err: any) {
            console.error('Görsel yüklenirken hata oluştu:', err.message);
            setError('Görsel yüklenirken hata oluştu. Lütfen dosya boyutunu kontrol edip tekrar deneyin.');
        } finally {
            setUploading(false);
        }
    };

    const clearImage = () => {
        onChange('');
    };

    return (
        <div className="image-uploader">
            {error && <div className="admin-error">{error}</div>}

            {value ? (
                <div className="image-uploader-preview">
                    <img src={value} alt="Preview" />
                    <div className="image-uploader-actions">
                        <button
                            type="button"
                            onClick={clearImage}
                            className="admin-btn-icon text-danger"
                            title="Görseli kaldır"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="image-uploader-dropzone">
                    <label className="image-uploader-label">
                        {uploading ? (
                            <div className="image-uploader-loading">
                                <Loader2 size={24} className="spin" />
                                <span>Yükleniyor...</span>
                            </div>
                        ) : (
                            <div className="image-uploader-idle">
                                <UploadCloud size={32} />
                                <span>Görsel yüklemek için tıklayın</span>
                                <span className="text-muted">JPEG, PNG, WEBP (maks. 5MB)</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden-input"
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
