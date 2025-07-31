import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export interface NoteEditorProps {
  note: { id: string; title: string; content: string } | null;
  isNew: boolean;
  onSave: (title: string, content: string) => void;
  onDelete: () => void;
  onCancel: () => void;
}

/**
 * PUBLIC_INTERFACE
 * NoteEditor allows editing a note or creating a new one.
 */
export const NoteEditor = component$<NoteEditorProps>((props) => {
  // Store note data in local signals, but never reference props in task closures
  const titleSig = useSignal(props.note?.title ?? "");
  const contentSig = useSignal(props.note?.content ?? "");

  useVisibleTask$(({ track }) => {
    // We are SAFE to reference props.note here (serializable),
    // but NOT any function prop like props.onSave, props.onDelete, props.onCancel
    track(() => props.note?.id);
    titleSig.value = props.note?.title ?? "";
    contentSig.value = props.note?.content ?? "";
  });

  return (
    <form
      class="note-editor"
      preventdefault:submit
      // DO NOT reference props.x here! Inline.
      onSubmit$={() => {
        props.onSave(titleSig.value, contentSig.value);
      }}
    >
      <input
        class="note-title-input"
        aria-label="Note title"
        type="text"
        value={titleSig.value}
        onInput$={(e) => (titleSig.value = (e.target as HTMLInputElement).value)}
        placeholder="Note title"
        maxLength={120}
        required
      />
      <textarea
        class="note-content-input"
        aria-label="Note content"
        value={contentSig.value}
        onInput$={(e) => (contentSig.value = (e.target as HTMLTextAreaElement).value)}
        placeholder="Write your note here..."
        rows={12}
        required
      ></textarea>
      <div class="editor-actions">
        <button class="save-btn" type="submit">
          {props.isNew ? "Create" : "Save"}
        </button>
        {!props.isNew && (
          <button
            class="delete-btn"
            type="button"
            onClick$={() => { props.onDelete(); }}
            style="margin-left: auto;"
          >
            Delete
          </button>
        )}
        <button
          class="cancel-btn"
          type="button"
          onClick$={() => { props.onCancel(); }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
});
