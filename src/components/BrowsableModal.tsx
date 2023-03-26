import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import Modal from 'react-modal';

import classes from '../styles/BrowsableModal.module.css';

Modal.setAppElement('#__next');

interface Props {}

export const BrowsableModal: FC<Props> = memo(function BrowsableModal() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button onClick={openModal} className={classes.btn}>
        Click here to open a modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
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
          <li>Open the link below and press `back` to get back to this page with the modal open.</li>
          <li>Press back again to close the modal, then press `next` to get back to the modal.</li>
        </ul>
      </Modal>
    </>
  );
});
