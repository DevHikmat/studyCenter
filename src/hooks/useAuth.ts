import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useAuth = () => {
  return useSelector((state: RootState) => state.auth.isAuthenticated);
};
