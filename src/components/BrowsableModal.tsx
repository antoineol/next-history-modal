import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import Modal from 'react-modal';

import { useManualHistory } from '../manual-history/useManualHistory';
import classes from '../styles/BrowsableModal.module.css';

Modal.setAppElement('#__next');

const modalId = 'home-modal-open';

interface Props {}

export const BrowsableModal: FC<Props> = memo(function BrowsableModal() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModalRaw = useCallback(() => setIsOpen(true), []);
  const closeModalRaw = useCallback(() => setIsOpen(false), []);

  const { push: openModal, pop: closeModal } = useManualHistory(openModalRaw, closeModalRaw, modalId);

  return (
    <>
      <button onClick={openModal} className={classes.btn}>
        Click here to open a modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        htmlOpenClassName={classes.htmlOpenClassName}
        bodyOpenClassName={classes.bodyOpenClassName}
        // For animated closing effect
        closeTimeoutMS={150}
        className={classes.modalContent}
        overlayClassName={classes.modalOverlay}
        // Accessibility
        contentLabel={'Browsable modal'}
      >
        <header>
          <h2>Browsable modal</h2>
          <button onClick={closeModal} className={classes.closeIcon}>
            X
          </button>
        </header>
        <p>
          You can use the browser native navigation to close this modal, as you typically expect mobile applications to
          work.
        </p>
        <p>Getting back to this history entry restores the modal. Even if you come from an external URL.</p>
        <p>Want to try it?</p>
        <ul>
          <li>
            Open <a href="https://www.google.fr/">an external link</a> and press `back` to get back to this page with
            the modal open.
          </li>
          <li>Press back again to close the modal, then press `next` to get back to the modal.</li>
        </ul>
      </Modal>
    </>
  );
});
