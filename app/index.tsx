import { Redirect } from 'expo-router';
import { useAuth } from '../context/authContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou um componente de loading
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Se estiver autenticado, redireciona para as tabs
  return <Redirect href="/(tabs)" />;
}
