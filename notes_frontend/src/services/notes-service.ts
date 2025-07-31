import type { Signal } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";

/**
 * Note model for frontend.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number; // unix timestamp
}

/**
 * Service for managing notes data.
 * Temporarily uses in-memory store; can be replaced with DB API later.
 */
export function useNotesService(): {
  notes: Signal<Note[]>;
  createNote: (title: string, content: string) => Note;
  updateNote: (noteId: string, data: { title: string; content: string }) => void;
  deleteNote: (noteId: string) => void;
  getNote: (noteId: string) => Note | null;
  searchNotes: (query: string) => Note[];
} {
  // Simulated notes data for development
  const notes = useSignal<Note[]>([]);
  const getNote = (noteId: string) =>
    notes.value.find((n) => n.id === noteId) ?? null;

  // PUBLIC_INTERFACE
  function createNote(title: string, content: string): Note {
    const note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      content,
      updatedAt: Date.now(),
    };
    notes.value = [note, ...notes.value];
    return note;
  }

  // PUBLIC_INTERFACE
  function updateNote(noteId: string, { title, content }: { title: string; content: string }) {
    notes.value = notes.value.map((note) =>
      note.id !== noteId
        ? note
        : {
            ...note,
            title,
            content,
            updatedAt: Date.now(),
          }
    );
  }

  // PUBLIC_INTERFACE
  function deleteNote(noteId: string) {
    notes.value = notes.value.filter((note) => note.id !== noteId);
  }

  // PUBLIC_INTERFACE
  function searchNotes(query: string): Note[] {
    const q = query.trim().toLowerCase();
    if (!q) return notes.value;
    return notes.value.filter(
      (note) =>
        note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)
    );
  }

  return { notes, createNote, updateNote, deleteNote, getNote, searchNotes };
}
