import { useEffect, useRef } from 'react';

const CONTROL_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD']);

export function useGameControls() {
  const pressed = useRef(new Set<string>());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!CONTROL_KEYS.has(event.code)) return;
      event.preventDefault();
      pressed.current.add(event.code);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      pressed.current.delete(event.code);
    };
    const clear = () => pressed.current.clear();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clear);
    };
  }, []);

  return pressed;
}
