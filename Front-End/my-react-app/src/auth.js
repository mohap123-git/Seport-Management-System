const AUTH_STORAGE_KEY = 'seaport-is-authenticated';
const AUTH_EVENT = 'seaport-auth-changed';

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readAuthState = () => {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};

export const setAuthState = (isAuthenticated) => {
  if (!canUseStorage()) {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const subscribeAuthState = (listener) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event) => {
    if (event.key === AUTH_STORAGE_KEY || event.key === null) {
      listener();
    }
  };

  const handleCustomEvent = () => listener();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(AUTH_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(AUTH_EVENT, handleCustomEvent);
  };
};
