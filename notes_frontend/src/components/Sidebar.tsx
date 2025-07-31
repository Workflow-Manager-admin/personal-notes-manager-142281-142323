import { component$, Slot, useSignal } from "@builder.io/qwik";

/**
 * Sidebar for navigation.
 * Contains a button for creating notes and a search input.
 */
// PUBLIC_INTERFACE
export const Sidebar = component$<{
  onCreateNote: () => void;
  onSearch: (q: string) => void;
  searchTerm: string;
}>((props) => {
  const searchRef = useSignal<HTMLInputElement>();
  return (
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Notes</h2>
        <button
          class="create-note-btn"
          onClick$={() => { props.onCreateNote(); }}
          aria-label="Create new note"
        >
          +
        </button>
      </div>
      <div class="sidebar-search">
        <input
          type="text"
          ref={searchRef}
          placeholder="Search notes..."
          value={props.searchTerm}
          onInput$={(e) =>
            props.onSearch((e.target as HTMLInputElement).value)
          }
          aria-label="Search notes"
        />
      </div>
      <div class="sidebar-children">
        <Slot />
      </div>
    </aside>
  );
});
