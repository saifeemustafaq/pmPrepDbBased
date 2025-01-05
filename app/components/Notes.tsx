'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { getNote, saveNote } from '../lib/notes';
import { formatDistanceToNow } from 'date-fns';

interface NotesProps {
  questionId: string;
}

export function Notes({ questionId }: NotesProps) {
  const [lastEdited, setLastEdited] = useState<string | null>(null);

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
    },
  });

  useEffect(() => {
    const note = getNote(questionId);
    if (note && editor) {
      editor.commands.setContent(note.content);
      setLastEdited(note.lastEdited);
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