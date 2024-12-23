interface Window {
  $: typeof jQuery;
  jQuery: typeof jQuery;
  d: {
    clock: (options: { progress: number; segments: number; bad: boolean }) => any;
  };
} 