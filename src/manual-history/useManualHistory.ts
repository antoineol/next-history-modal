import { useRouter } from 'next/router';
import { useCallback, useEffect, useId, useMemo, useRef } from 'react';

// Disabled for now, since it has a couple of bugs and is not a hight priority feature.
const enableHistory = false;

// We could improve the hook by restoring the modale when going back to the pushed history entry.
// E.g. replace handleUserPressedBrowserBack with pushNoHistory + popNoHistory.

/**
 * Note: specific to NextJS applications. It manipulates the history, bypassing the Next.js routing.
 * @param pushNoHistory Function to call when the user goes forward in the history with the browser controls. Use it to update the app yourself, e.g. open a modal.
 * @param popNoHistory Function to call when the user goes back in the history with the browser controls. Use it to update the app yourself, e.g. close a modal.
 * @param uncontrolled By default, the returned push/pop functions call respectively pushNoHistory and popNoHistory. If `uncontrolled` is true, they won't be called. Useful for cases when the event where you want to push already triggered `pushNoHistory` out of your control (e.g. if focus/blur is the trigger).
 * @returns push and pop function you must call on events that should add or remove a manual history entry, e.g. when the user opens or closes a modal.
 * @example ```ts
 * const [open, setOpen] = useState(false);
 * const closeModalRaw = useCallback(() => setOpen(false), []);
 *
 * const { push, pop } = useManualHistory(closeModalRaw);
 *
 * const openModal = useCallback(() => {
 *   setOpen(true);
 *   push();
 * }, [push]);
 *
 * const closeModal = useCallback(() => {
 *   closeModalRaw();
 *   pop();
 * }, [closeModalRaw, pop]);
 * ```
 */
export function useManualHistory(pushNoHistory: VoidFunction, popNoHistory: VoidFunction, uncontrolled?: boolean) {
  const router = useRouter();

  // Ref used to store whether we have pushed a state, to indicate that the nextjs routing has been temporarily disabled, as a check and to re-enable it when leaving this state.
  const closingSuggestionsRef = useRef(false);
  // Used as a unique reference of an instance of hook, to call the navigation code only when the events are related to the current instance of hook.
  const id = useId();

  useEffect(() => {
    if (enableHistory) {
      function handlePopstate(e: PopStateEvent) {
        if (window.history.state?.__semio_modale_ref === id) {
          if (closingSuggestionsRef.current && e.state?.__semio_modale_from) {
            popNoHistory();
            router.beforePopState(() => true);
            closingSuggestionsRef.current = false;
          }
          if (e.state?.__semio_modale_to) {
            closingSuggestionsRef.current = true;
            router.beforePopState(() => false);
            pushNoHistory();
          }
        }
      }

      window.addEventListener('popstate', handlePopstate);

      return () => {
        window.removeEventListener('popstate', handlePopstate);
      };
    }
    return; // to avoid an eslint warning
  }, [id, popNoHistory, pushNoHistory, router]);

  const push = useCallback(() => {
    if (enableHistory) {
      closingSuggestionsRef.current = true;
      router.beforePopState(() => false);
      window.history.replaceState(
        {
          ...window.history.state,
          __semio_modale_from: true,
          __semio_modale_ref: id,
        },
        ''
      );
      window.history.pushState(
        {
          ...window.history.state,
          __semio_modale_to: true,
          __semio_modale_ref: id,
        },
        ''
      );
    }
    if (!uncontrolled) {
      // The original push handler
      pushNoHistory();
    }
  }, [id, pushNoHistory, router, uncontrolled]);

  const pop = useCallback(() => {
    if (enableHistory) {
      if (window.history.state?.__semio_modale_ref === id && window.history.state?.__semio_modale_to) {
        window.history.back();
      }
    }
    if (!uncontrolled) {
      // The original pop handler
      popNoHistory();
    }
  }, [id, popNoHistory, uncontrolled]);

  return useMemo(() => ({ push, pop }), [pop, push]);
}
