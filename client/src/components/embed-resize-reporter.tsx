/**
 * EmbedResizeReporter
 * Quand embed=1, observe les changements de hauteur du document
 * et envoie bmi360:resize au parent (WordPress) via postMessage.
 */
import { useEffect } from 'react';
import { useEmbed } from '@/contexts/embed-context';

export function EmbedResizeReporter() {
  const isEmbed = useEmbed();

  useEffect(() => {
    if (!isEmbed) return;

    let lastHeight = 0;

    const sendHeight = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      if (height !== lastHeight) {
        lastHeight = height;
        window.parent.postMessage({ type: 'bmi360:resize', height }, '*');
      }
    };

    // Initial measurement
    sendHeight();

    // Observe body size changes
    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.body);

    // Also listen for any DOM mutations (animations, dynamic content)
    const mo = new MutationObserver(sendHeight);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [isEmbed]);

  return null;
}
