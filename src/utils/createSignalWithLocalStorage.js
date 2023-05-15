import { onMount, createSignal } from "solid-js";

export const createSignalWithLocalStorage = (key, initialValue) => {
  const [value, setValue] = createSignal(initialValue);

  onMount(() => {
    setValue(localStorage.getItem(key));
  });

  return [
    value,
    (val) => {
      localStorage.setItem(key, val);
      setValue(val);
    },
  ];
};
