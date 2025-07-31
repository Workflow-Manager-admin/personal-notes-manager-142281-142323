import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Sidebar } from "../components/Sidebar";
import { NotesList } from "../components/NotesList";
import { NoteEditor } from "../components/NoteEditor";
import { useNotesService } from "../services/notes-service";

// PUBLIC_INTERFACE
/**
 * The main page implements sidebar navigation, search, editable note area, and note list.
 */
export default component$(() => {
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    searchNotes,
  } = useNotesService();

  const selectedNoteId = useSignal<string | null>(null);
  const isCreating = useSignal(false);
  const isEditing = useSignal(false);
  const searchTerm = useSignal("");

  const filteredNotes = () =>
    searchTerm.value.trim() ? searchNotes(searchTerm.value) : notes.value;

  const selectNote = $((noteId: string) => {
    selectedNoteId.value = noteId;
    isCreating.value = false;
    isEditing.value = false;
  });

  const handleCreateNote = $(() => {
    isCreating.value = true;
    selectedNoteId.value = null;
    isEditing.value = false;
  });

  const handleSearch = $((q: string) => {
    searchTerm.value = q;
    // If we search, we exit editing/creating modes
    isCreating.value = false;
    isEditing.value = false;
    selectedNoteId.value = null;
  });

  const handleEdit = $(() => {
    isEditing.value = true;
    isCreating.value = false;
  });

  // Handles save both for new and edit
  const handleSave = (title: string, content: string) => {
    if (isCreating.value) {
      const n = createNote(title, content);
      selectedNoteId.value = n.id;
      isCreating.value = false;
    } else if (
      selectedNoteId.value &&
      getNote(selectedNoteId.value)
    ) {
      updateNote(selectedNoteId.value, { title, content });
      isEditing.value = false;
    }
  };

  const handleDelete = $(() => {
    if (selectedNoteId.value) {
      deleteNote(selectedNoteId.value);
      selectedNoteId.value = null;
      isEditing.value = false;
      isCreating.value = false;
    }
  });

  const handleCancel = $(() => {
    isEditing.value = false;
    isCreating.value = false;
  });

  const showNote =
    selectedNoteId.value && getNote(selectedNoteId.value);

  return (
    <div class="notes-app-container">
      <Sidebar
        onCreateNote={handleCreateNote}
        onSearch={handleSearch}
        searchTerm={searchTerm.value}
      >
        <NotesList
          notes={filteredNotes().map((n) => ({
            id: n.id,
            title: n.title,
            updatedAt: n.updatedAt,
          }))}
          selectedNoteId={selectedNoteId.value}
          onSelectNote={selectNote}
        />
      </Sidebar>

      <main class="main-area">
        {/* Note editing or creation */}
        {isCreating.value && (
          <NoteEditor
            note={null}
            isNew={true}
            onSave={handleSave}
            onDelete={() => {}}
            onCancel={handleCancel}
          />
        )}

        {/* Note viewing and editing */}
        {!isCreating.value &&
          showNote &&
          !isEditing.value && (
            <section class="note-view">
              <header class="note-view-header">
                <h2 class="note-view-title">{showNote.title}</h2>
                <span class="note-view-date">
                  {new Date(showNote.updatedAt).toLocaleString()}
                </span>
                <div style="flex:1;" />
                <button class="note-edit-btn" onClick$={handleEdit}>
                  Edit
                </button>
              </header>
              <div class="note-view-content">
                {showNote.content.split("\n").map((line, i) =>
                  line.trim() === "" ? <br key={i} /> : <p key={i}>{line}</p>
                )}
              </div>
              <div class="note-view-actions">
                <button
                  class="note-delete-btn"
                  onClick$={() => {
                    handleDelete();
                  }}
                >
                  Delete
                </button>
              </div>
            </section>
          )}

        {/* Note edit form */}
        {!isCreating.value &&
          showNote &&
          isEditing.value && (
            <NoteEditor
              note={showNote}
              isNew={false}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={handleCancel}
            />
          )}

        {/* Empty state */}
        {!isCreating.value && !showNote && filteredNotes().length === 0 && (
          <div class="empty-message">
            No notes found.
            <br />
            Click the "+" button to create your first note.
          </div>
        )}
        {/* Default state (no note selected) */}
        {!isCreating.value && !showNote && filteredNotes().length > 0 && (
          <div class="empty-message">Select a note from the sidebar.</div>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Personal Notes Manager",
  meta: [
    {
      name: "description",
      content: "Create, edit, search, and manage your personal notes.",
    },
  ],
};
