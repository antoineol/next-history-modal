import { useRouter } from 'next/router';
import { useCallback, useEffect, useId, useMemo, useRef } from 'react';

// Disabled for now, since it has a couple of bugs and is not a hight priority feature.
const enableHistory = true;

// We could improve the hook by restoring the modale when going back to the pushed history entry.
// E.g. replace handleUserPressedBrowserBack with pushNoHistory + popNoHistory.

interface ManualHistoryOptions {
  /** You should provide an ID unique to the usage of the hook, so that it can re-trigger the `pushNoHistory` when refreshing the page. Defaults to a generated ID that won't be persisted on refresh. */
  id?: string;
  uncontrolled?: boolean;
}

/**
 * Note: specific to NextJS applications. It manipulates the history, bypassing the Next.js routing.
 * @param pushNoHistory Function to call when the user goes forward in the history with the browser controls. Use it to update the app yourself, e.g. open a modal.
 * @param popNoHistory Function to call when the user goes back in the history with the browser controls. Use it to update the app yourself, e.g. close a modal.
 * @param uncontrolled By default, the returned push/pop functions call respectively pushNoHistory and popNoHistory. If `uncontrolled` is true, they won't be called. Useful for cases when the event where you want to push already triggered `pushNoHistory` out of your control (e.g. if focus/blur is the trigger).
 * @returns push and pop function you must call on events that should add or remove a manual history entry, e.g. when the user opens or closes a modal.
 * @example ```ts
 * const [open, setOpen] = useState(false);
 * const openModalRaw = useCallback(() => setOpen(true), []);
 * const closeModalRaw = useCallback(() => setOpen(false), []);
 *
 * const { push: openModal, pop: closeModal } = useManualHistory(openModalRaw, closeModalRaw);
 * ```
 */
export function useManualHistory(
  pushNoHistory: VoidFunction,
  popNoHistory: VoidFunction,
  options: ManualHistoryOptions = {}
) {
  const generatedId = useId();
  const { uncontrolled, id = generatedId } = options;
  const router = useRouter();

  // router.query.NEWPARAMS = 'VALUE';
  // router.push(router);

  // Ref used to store whether we have pushed a state, to indicate that the nextjs routing has been temporarily disabled, as a check and to re-enable it when leaving this state.
  const closingSuggestionsRef = useRef(false);
  // Used as a unique reference of an instance of hook, to call the navigation code only when the events are related to the current instance of hook.
  // const id = useId();

  useEffect(() => {
    // KO: window.history.state seems overridden by next.js.
    if (window.history.state?.__semio_modale_ref === id) {
      if (window.history.state?.__semio_modale_to) {
        closingSuggestionsRef.current = true;
        router.beforePopState(() => false);
        pushNoHistory();
      }
    }
    // Should only run once, when initializing the component. After that, the "popstate" listener will take care of managing the state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
