// ========================================
// CMS Dashboard - UI Components: FileUpload
// ========================================

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image, File, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = 'image/*',
  multiple = false,
  maxSize = 10,
  label,
  error,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const maxSizeBytes = maxSize * 1024 * 1024;

    Array.from(files).forEach((file) => {
      if (file.size > maxSizeBytes) {
        alert(`Le fichier ${file.name} dépasse la taille maximale de ${maxSize}MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setIsUploading(true);
      try {
        await onUpload(validFiles);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="text-primary-600 font-medium">Cliquez</span> ou glissez-déposez
            </p>
            <p className="text-xs text-gray-400">
              {accept.includes('image') ? 'PNG, JPG, GIF' : 'Tous les fichiers'} jusqu'à {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Image Preview with remove
interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = '',
  onRemove,
  size = 'md',
}) => {
  return (
    <div className={`relative group ${sizeClasses[size]}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-lg"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
            opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// Media Grid
interface MediaGridProps {
  items: Array<{
    id: string;
    url: string;
    filename: string;
    type?: string;
  }>;
  onSelect?: (item: any) => void;
  onRemove?: (id: string) => void;
  selectable?: boolean;
  selectedIds?: string[];
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  onSelect,
  onRemove,
  selectable = false,
  selectedIds = [],
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {Array.isArray(items) && items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const isImage = item.type?.startsWith('image/') || false;

        return (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className={`
              relative group aspect-square rounded-lg overflow-hidden cursor-pointer
              border-2 transition-all
              ${isSelected
                ? 'border-primary-500 ring-2 ring-primary-200'
                : 'border-transparent hover:border-gray-300'
              }
            `}
          >
            {isImage ? (
              <img
                src={item.url}
                alt={item.filename}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                <File className="w-8 h-8 text-gray-400" />
                <p className="text-xs text-gray-500 mt-1 truncate px-2">
                  {item.filename}
                </p>
              </div>
            )}

            {/* Selection indicator */}
            {selectable && (
              <div
                className={`
                  absolute top-2 left-2 w-5 h-5 rounded-full border-2
                  flex items-center justify-center transition-all
                  ${isSelected
                    ? 'bg-primary-600 border-primary-600'
                    : 'bg-white/80 border-gray-300'
                  }
                `}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )}

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileUpload;
