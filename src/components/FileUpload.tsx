import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFilesUpload: (files: File[]) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUpload, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    console.log('📁 Files selected:', fileArray.map(f => f.name));
    onFilesUpload(fileArray);
  }, [onFilesUpload]);

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
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    handleFiles(e.target.files);
  }, [disabled, handleFiles]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`border-2 border-dashed border-gray-300 rounded-3xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30 relative ${
          isDragging ? 'border-blue-500 bg-blue-100/50 border-solid' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Upload GDC Inspection Reports
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Drag and drop your PDF inspection reports, programme specifications, or curriculum documents
          </p>

          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 mx-auto w-fit cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Choose Files</span>
          </label>

          <p className="text-sm text-gray-500 mt-4">
            Supports PDF, DOC, DOCX, TXT files. Multiple files allowed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
