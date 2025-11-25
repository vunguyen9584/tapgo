import { useState, useEffect } from 'react';
import { onUserChange, type User } from '../lib/firebase';

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onUserChange((currentUser) => {
      setUser(currentUser);
    });
    
    return unsubscribe;
  }, []);

  return user;
}
