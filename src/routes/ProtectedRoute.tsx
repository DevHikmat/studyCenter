import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const {isAuthenticated, isLoading} = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    // Bu yerda loading indikator qo‘shsa ham bo‘ladi
    return <div>Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
