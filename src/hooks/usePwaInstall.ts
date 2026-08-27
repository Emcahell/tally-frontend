import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function getIsStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error – standalone is non-standard but available on iOS Safari
    window.navigator.standalone === true
  );
}

/**
 * Detecta si la app está instalada / instalable y provee una función
 * para disparar el prompt de instalación nativo del navegador.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => getIsStandalone());

  useEffect(() => {
    // Check if user previously dismissed / installed
    if (localStorage.getItem('pwa-dismissed') === 'true' || localStorage.getItem('pwa-installed') === 'true') {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 3. Listen for successful install (appinstalled)
    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      localStorage.setItem('pwa-installed', 'true');
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
      setIsInstalled(true);
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setIsInstallable(false);
    localStorage.setItem('pwa-dismissed', 'true');
  }, []);

  return { isInstallable, isInstalled, install, dismiss };
}
