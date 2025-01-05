export interface Note {
  content: string;
  lastEdited: string;
}

interface NotesStore {
  [questionId: string]: Note;
}

const NOTES_STORAGE_KEY = 'pm-prep-notes';

export function getNotes(): NotesStore {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(NOTES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function getNote(questionId: string): Note | null {
  const notes = getNotes();
  return notes[questionId] || null;
}

export function saveNote(questionId: string, content: string): void {
  const notes = getNotes();
  notes[questionId] = {
    content,
    lastEdited: new Date().toISOString()
  };
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
} 