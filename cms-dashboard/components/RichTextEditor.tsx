// ========================================
// CMS Dashboard - UI Components: RichTextEditor
// ========================================

import React, { useRef, useEffect, useState } from 'react';
import { sanitizeHtml } from '../lib/sanitize';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  onClick,
  active,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`
      p-2 rounded-lg transition-colors
      ${active
        ? 'bg-primary-100 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
  >
    {icon}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Commencez à écrire...',
  minHeight = '200px',
  maxHeight = '500px',
  disabled = false,
  error,
  label,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        className={`
          border rounded-xl overflow-hidden transition-all
          ${isFocused ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-300'}
          ${error ? 'border-red-500 ring-2 ring-red-100' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b border-gray-200">
          <ToolbarButton
            icon={<Undo className="w-4 h-4" />}
            onClick={() => execCommand('undo')}
            title="Annuler"
          />
          <ToolbarButton
            icon={<Redo className="w-4 h-4" />}
            onClick={() => execCommand('redo')}
            title="Rétablir"
          />
          
          <ToolbarDivider />
          
          <ToolbarButton
            icon={<Heading1 className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'h1')}
            title="Titre 1"
          />
          <ToolbarButton
            icon={<Heading2 className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'h2')}
            title="Titre 2"
          />
          <ToolbarButton
            icon={<Heading3 className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'h3')}
            title="Titre 3"
          />
          
          <ToolbarDivider />
          
          <ToolbarButton
            icon={<Bold className="w-4 h-4" />}
            onClick={() => execCommand('bold')}
            title="Gras"
          />
          <ToolbarButton
            icon={<Italic className="w-4 h-4" />}
            onClick={() => execCommand('italic')}
            title="Italique"
          />
          <ToolbarButton
            icon={<Underline className="w-4 h-4" />}
            onClick={() => execCommand('underline')}
            title="Souligné"
          />
          
          <ToolbarDivider />
          
          <ToolbarButton
            icon={<AlignLeft className="w-4 h-4" />}
            onClick={() => execCommand('justifyLeft')}
            title="Aligner à gauche"
          />
          <ToolbarButton
            icon={<AlignCenter className="w-4 h-4" />}
            onClick={() => execCommand('justifyCenter')}
            title="Centrer"
          />
          <ToolbarButton
            icon={<AlignRight className="w-4 h-4" />}
            onClick={() => execCommand('justifyRight')}
            title="Aligner à droite"
          />
          
          <ToolbarDivider />
          
          <ToolbarButton
            icon={<List className="w-4 h-4" />}
            onClick={() => execCommand('insertUnorderedList')}
            title="Liste à puces"
          />
          <ToolbarButton
            icon={<ListOrdered className="w-4 h-4" />}
            onClick={() => execCommand('insertOrderedList')}
            title="Liste numérotée"
          />
          
          <ToolbarDivider />
          
          <ToolbarButton
            icon={<Quote className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'blockquote')}
            title="Citation"
          />
          <ToolbarButton
            icon={<Code className="w-4 h-4" />}
            onClick={() => execCommand('formatBlock', 'pre')}
            title="Code"
          />
          
          <ToolbarDivider />
          
          <ToolbarButton
            icon={<Link className="w-4 h-4" />}
            onClick={insertLink}
            title="Insérer un lien"
          />
          <ToolbarButton
            icon={<Image className="w-4 h-4" />}
            onClick={insertImage}
            title="Insérer une image"
          />
        </div>

        {/* Editor Content */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="prose prose-sm max-w-none p-4 focus:outline-none"
          style={{
            minHeight,
            maxHeight,
            overflowY: 'auto',
          }}
          data-placeholder={placeholder}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

// Textarea Markdown alternative
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  error?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Écrivez en Markdown...',
  rows = 10,
  label,
  error,
}) => {
  const [preview, setPreview] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="border border-gray-300 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-4 py-2 text-sm font-medium ${
              !preview
                ? 'text-primary-700 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Écrire
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-4 py-2 text-sm font-medium ${
              preview
                ? 'text-primary-700 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Aperçu
          </button>
        </div>

        {/* Content */}
        {preview ? (
          <div
            className="prose prose-sm max-w-none p-4 min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-4 resize-none focus:outline-none font-mono text-sm"
          />
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
