import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";
import notesAppStyles from "./notes-app.css?inline";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

/* PUBLIC_INTERFACE
 * The app layout applies the styles and provides the main app structure.
 */
export default component$(() => {
  useStyles$(styles);
  useStyles$(notesAppStyles);
  return (
    <main>
      <Slot />
    </main>
  );
});
