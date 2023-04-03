import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Note: specific to NextJS applications. It manipulates the history, bypassing the Next.js routing.
 * @param pushNoHistory Function to call when the user goes forward in the history with the browser controls. Use it to update the app yourself, e.g. open a modal.
 * @param popNoHistory Function to call when the user goes back in the history with the browser controls. Use it to update the app yourself, e.g. close a modal.
 * @param queryKey A unique ID for the usage of the hook, ideally a constant value, different for each usage, so that it persists across refreshes. It is used to detect which query parameter should be used with the history.
 * @returns push and pop function you must call on events that should add or remove a manual history entry, e.g. when the user opens or closes a modal.
 * @example ```ts
 * const [open, setOpen] = useState(false);
 * const openModalRaw = useCallback(() => setOpen(true), []);
 * const closeModalRaw = useCallback(() => setOpen(false), []);
 *
 * const { push: openModal, pop: closeModal } = useManualHistory(openModalRaw, closeModalRaw, { id: 'myModal' });
 * ```
 */
export function useManualHistory(pushNoHistory: VoidFunction, popNoHistory: VoidFunction, queryKey: string) {
  const router = useRouter();

  const hasOpenModalQueryParam = queryKey in router.query;

  // Keep track of the open state to deduplicate.
  const isOpenRef = useRef(false);

  const initializedModalRef = useRef(false);
  useEffect(() => {
    if (!initializedModalRef.current && router.isReady) {
      initializedModalRef.current = true;
      const shouldShowModal = hasOpenModalQueryParam;
      if (shouldShowModal && !isOpenRef.current) {
        isOpenRef.current = true;
        pushNoHistory();
      }
    }
  }, [hasOpenModalQueryParam, pushNoHistory, queryKey, router.isReady, router.query]);

  useEffect(() => {
    const checkOpenModal: RouteChangeStart = (url /* , { shallow } */) => {
      const modalParam = readNextJSURLQueryParam(url, queryKey);

      const shouldShowModal = modalParam !== null;
      if (shouldShowModal && !isOpenRef.current) {
        isOpenRef.current = true;
        pushNoHistory();
      }
    };

    const checkCloseModal: RouteChangeStart = (url /* , { shallow } */) => {
      const modalParam = readNextJSURLQueryParam(url, queryKey);
      const shouldHideModal = modalParam === null;
      if (shouldHideModal && isOpenRef.current) {
        isOpenRef.current = false;
        popNoHistory();
      }
    };

    router.events.on('routeChangeStart', checkCloseModal);
    router.events.on('routeChangeComplete', checkOpenModal);

    return () => {
      router.events.off('routeChangeStart', checkCloseModal);
      router.events.off('routeChangeComplete', checkOpenModal);
    };
  }, [hasOpenModalQueryParam, popNoHistory, pushNoHistory, queryKey, router.events, router.query]);

  const push = useCallback(() => {
    router.push({ pathname: router.pathname, query: { ...router.query, [queryKey]: '' } }, undefined, {
      shallow: true,
    });
    if (!isOpenRef.current) {
      // The original push handler
      isOpenRef.current = true;
      pushNoHistory();
    }
  }, [pushNoHistory, queryKey, router]);

  const pop = useCallback(() => {
    if (hasOpenModalQueryParam) {
      router.back();
    }
    if (isOpenRef.current) {
      // The original pop handler
      isOpenRef.current = false;
      popNoHistory();
    }
  }, [hasOpenModalQueryParam, popNoHistory, router]);

  return useMemo(() => ({ push, pop }), [pop, push]);
}

type RouteChangeStart = (url: string, { shallow }: { shallow: boolean }) => void;

function readNextJSURLQueryParam(url: string, key: string) {
  const i = url.indexOf('?');
  if (i === -1) return null;
  url = url.substring(i); // Extract the "search" fragment
  return new URLSearchParams(url).get(key);
}
