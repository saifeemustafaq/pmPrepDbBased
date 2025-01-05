'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { getNote, saveNote } from '../lib/notes';
import { formatDistanceToNow } from 'date-fns';
import { useAnalytics } from '../hooks/useAnalytics';

interface NotesProps {
  questionId: string;
}

export function Notes({ questionId }: NotesProps) {
  const [lastEdited, setLastEdited] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px]',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      saveNote(questionId, content);
      setLastEdited(new Date().toISOString());
      
      // Track note update
      trackEvent(
        'note_update',
        'Notes',
        questionId,
        content.length
      );
    },
  });

  useEffect(() => {
    const note = getNote(questionId);
    if (note && editor && !editor.isDestroyed) {
      // Only update if editor is empty or content is significantly different
      const currentContent = editor.getHTML();
      const isEmptyEditor = currentContent === '<p></p>' || currentContent === '';
      if (isEmptyEditor || (note.content && note.content !== currentContent)) {
        editor.commands.setContent(note.content || '');
        setLastEdited(note.lastEdited);
        
        // Track note load
        trackEvent(
          'note_load',
          'Notes',
          questionId,
          note.content ? note.content.length : 0
        );
      }
    }
  }, [questionId, editor]);

  return (
    <div className="bg-purple-50/70 p-6 rounded-lg border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <PencilIcon className="w-4 h-4 text-purple-700" />
        <h4 className="font-semibold text-purple-900 text-sm uppercase tracking-wide">
          My Notes
        </h4>
      </div>
      
      <div className="bg-white rounded-md p-4 border border-purple-100">
        <EditorContent editor={editor} />
      </div>
      
      {lastEdited && (
        <div className="mt-2 text-xs text-purple-600">
          Last edited: {formatDistanceToNow(new Date(lastEdited), { addSuffix: true })}
        </div>
      )}
    </div>
  );
} 