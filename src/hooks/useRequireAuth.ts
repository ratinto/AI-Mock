import { useEffect, useMemo, useState } from 'react';
import { useServices } from '../app/ServicesProvider';

export function useRequireAuth() {
  const [tick, setTick] = useState(0);
  const { auth } = useServices();

  useEffect(() => {
    const onStorage = () => setTick((t) => t + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const user = useMemo(() => {
    void tick;
    return auth.getCurrentUser();
  }, [auth, tick]);

  return { user, isAuthed: Boolean(user) } as const;
}

