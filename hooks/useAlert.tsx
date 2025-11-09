import { Alert } from "react-native";

/**
 * Hook simples para exibir alertas nativos no app.
 * Exemplo:
 * const { showAlert } = useAlert();
 * showAlert("Erro", "Ocorreu um problema!");
 */
export function useAlert() {
  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  return { showAlert };
}
