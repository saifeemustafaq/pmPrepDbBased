'use client';

import { useState, useEffect } from 'react';
import { EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';
import { format } from 'date-fns';
import { useAnalytics } from '../hooks/useAnalytics';
import { ChevronLeft, ChevronRight, Bold, Italic, List, Undo, Redo, Download, Trash2, BookOpen } from 'lucide-react';

interface OverallNotesProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OverallNotes({ isExpanded, onToggle }: OverallNotesProps) {
  const { trackEvent } = useAnalytics();
  const [wordCount, setWordCount] = useState(0);
  const [lastEdited, setLastEdited] = useState<Date | null>(null);
  
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-2',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      setLastEdited(new Date());
      
      localStorage.setItem('overallNotes', editor.getHTML());
      localStorage.setItem('lastEdited', new Date().toISOString());

      if (Math.floor(words / 10) !== Math.floor(wordCount / 10)) {
        trackEvent(
          'notes_update',
          'Overall Notes',
          'Word Count Milestone',
          Math.floor(words / 10) * 10
        );
      }
    },
  });

  // Load initial content
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const savedContent = localStorage.getItem('overallNotes');
    const savedLastEdited = localStorage.getItem('lastEdited');
    
    if (savedContent) {
      const currentContent = editor.getHTML();
      const isEmptyEditor = currentContent === '<p></p>' || currentContent === '';
      const hasContentChanged = savedContent !== currentContent;

      if (isEmptyEditor || hasContentChanged) {
        editor.commands.setContent(savedContent, false); // false prevents adding to history stack
        const text = editor.getText();
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        setWordCount(words);
      }
    }
    
    if (savedLastEdited) {
      setLastEdited(new Date(savedLastEdited));
    }
  }, [editor]);

  const handleDownload = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overall-notes-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent(
      'notes_download',
      'Overall Notes',
      'Download Notes',
      wordCount
    );
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
      editor?.commands.clearContent();
      localStorage.removeItem('overallNotes');
      localStorage.removeItem('lastEdited');
      setWordCount(0);
      setLastEdited(null);

      trackEvent(
        'notes_clear',
        'Overall Notes',
        'Clear Notes',
        0
      );
    }
  };

  useEffect(() => {
    trackEvent(
      'notes_toggle',
      'Overall Notes',
      isExpanded ? 'Expand' : 'Collapse',
      isExpanded ? 1 : 0
    );
  }, [isExpanded, trackEvent]);

  return (
    <div className={`fixed top-0 right-0 h-screen bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
      isExpanded ? 'w-80' : 'w-10'
    }`}>
      <div className="absolute -left-6 top-16 w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors z-20"
        onClick={onToggle}
        role="button"
        aria-label={isExpanded ? "Collapse notes" : "Expand notes"}
      >
        {isExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </div>

      <div className={`h-full flex flex-col ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-md">
              <BookOpen className="w-4 h-4 text-blue-700" />
            </div>
            <h2 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">Overall Notes</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Download notes"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Clear notes"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {editor && (
          <div className="border-b border-gray-200 h-[64px] flex items-center">
            <div className="flex items-center justify-center gap-1 w-full">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-md transition-colors ${
                  editor.isActive('bold')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-md transition-colors ${
                  editor.isActive('italic')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-md transition-colors ${
                  editor.isActive('bulletList')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="Bullet list"
              >
                <List className="w-4 h-4" />
              </button>
              <div className="mx-1 h-6 w-px bg-gray-200" />
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className={`p-1.5 rounded-md transition-colors ${
                  editor.can().undo()
                    ? 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className={`p-1.5 rounded-md transition-colors ${
                  editor.can().redo()
                    ? 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-gray-50 rounded-lg border border-gray-100 focus-within:border-blue-200 transition-colors h-full">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4">
            <span>{wordCount} words</span>
            {lastEdited && (
              <span title={lastEdited.toLocaleString()}>
                Last edited {format(lastEdited, 'MMM d, h:mm a')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 