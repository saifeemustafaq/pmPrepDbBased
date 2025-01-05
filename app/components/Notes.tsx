'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { PencilIcon, Bold, Italic, List, Undo, Redo, Download, Trash2, FileText } from 'lucide-react';
import { getNote, saveNote } from '../lib/notes';
import { formatDistanceToNow } from 'date-fns';
import { useAnalytics } from '../hooks/useAnalytics';

interface NotesProps {
  questionId: string;
}

export function Notes({ questionId }: NotesProps) {
  const [lastEdited, setLastEdited] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const { trackEvent } = useAnalytics();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {},
        orderedList: {},
        listItem: {},
        bold: {},
        italic: {},
        strike: {},
        code: {},
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {},
        blockquote: {},
        horizontalRule: {},
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-2',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      saveNote(questionId, content);
      setLastEdited(new Date().toISOString());
      setWordCount(words);
      
      trackEvent(
        'note_update',
        'Notes',
        questionId,
        content.length
      );
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });

  // Load initial content
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const note = getNote(questionId);
    if (!note) return;

    const currentContent = editor.getHTML();
    const isEmptyEditor = currentContent === '<p></p>' || currentContent === '';
    const hasContentChanged = note.content && note.content !== currentContent;

    // Only update if we really need to
    if ((isEmptyEditor && note.content) || (hasContentChanged && note.content)) {
      editor.commands.setContent(note.content, false);
      setLastEdited(note.lastEdited);
      
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      
      trackEvent(
        'note_load',
        'Notes',
        questionId,
        note.content.length
      );
    }
  }, [questionId, editor, trackEvent]); // Add editor and trackEvent to dependencies

  const handleDownloadMarkdown = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${questionId}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent(
      'notes_download',
      'Notes',
      questionId + '_markdown',
      content.length
    );
  };

  const handleDownloadText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${questionId}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent(
      'notes_download',
      'Notes',
      questionId + '_text',
      content.length
    );
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear these notes? This action cannot be undone.')) {
      editor?.commands.clearContent();
      saveNote(questionId, '');
      setLastEdited(new Date().toISOString());
      setWordCount(0);

      trackEvent(
        'notes_clear',
        'Notes',
        questionId,
        0
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between p-4 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 p-1.5 rounded-md">
            <PencilIcon className="w-4 h-4 text-purple-700" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold text-purple-900 text-sm uppercase tracking-wide">
              My Notes
            </h4>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Markdown supported
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={handleDownloadMarkdown}
              className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors flex items-center gap-1"
              title="Download as Markdown"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">.md</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors flex items-center gap-1"
              title="Download as plain text"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">.txt</span>
            </button>
          </div>
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
        <div className="border-b border-purple-100">
          <div className="flex items-center gap-1 p-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('bold')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('italic')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive('bulletList')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
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
                  ? 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
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
                  ? 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg border border-gray-100 focus-within:border-purple-200 transition-colors">
          <EditorContent editor={editor} />
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{wordCount} words</span>
          {lastEdited && (
            <span title={new Date(lastEdited).toLocaleString()}>
              Last edited {formatDistanceToNow(new Date(lastEdited), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 