import { useEffect, useMemo, useState } from 'react';
import { UserStore } from '../utils/userStore';

export function useRequireAuth() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onStorage = () => setTick((t) => t + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const user = useMemo(() => {
    void tick;
    return UserStore.getCurrentUser();
  }, [tick]);

  return { user, isAuthed: Boolean(user) } as const;
}

