import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

interface Props {}

export const HelloModal: FC<Props> = memo(function HelloModal() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);

  return <button onClick={openModal}>Open modal</button>;
});
