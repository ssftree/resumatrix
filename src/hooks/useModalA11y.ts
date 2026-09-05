import { RefObject, useEffect, useRef } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface UseModalA11yOptions {
  isOpen: boolean;
  onClose?: () => void;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
}

export const useModalA11y = ({
  isOpen,
  onClose,
  dialogRef,
  initialFocusRef,
}: UseModalA11yOptions) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    initialFocusRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements: HTMLElement[] = dialogRef.current
        ? (Array.from(dialogRef.current.querySelectorAll(focusableSelector)) as HTMLElement[])
          .filter((element) => element.getAttribute('aria-hidden') !== 'true')
        : [];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !dialogRef.current?.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || !dialogRef.current?.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [dialogRef, initialFocusRef, isOpen]);
};
