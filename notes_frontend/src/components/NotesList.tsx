import { component$ } from "@builder.io/qwik";

export interface NoteListItem {
  id: string;
  title: string;
  updatedAt: number;
}

// PUBLIC_INTERFACE
export const NotesList = component$<{
  notes: NoteListItem[];
  onSelectNote: (noteId: string) => void;
  selectedNoteId: string | null;
}>((props) => {
  return (
    <ul class="notes-list">
      {props.notes.length === 0 && <li class="no-notes">No notes found.</li>}
      {props.notes.map((note) => (
        <li
          key={note.id}
          tabIndex={0}
          class={{
            "note-list-item": true,
            selected: props.selectedNoteId === note.id,
          }}
          onClick$={() => { props.onSelectNote(note.id); }}
        >
          <div class="title">{note.title || <em>Untitled</em>}</div>
          <div class="timestamp">
            {new Date(note.updatedAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
});
