import { useReports } from "@/context/reportContext";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function MakeReport() {
  const { addReport, loading } = useReports();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!location.trim() || !description.trim()) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }

    try {
      await addReport({
        endereco: location,
        latitude: -23.55,
        longitude: -46.63,
      });

      Alert.alert("Sucesso", "Reporte criado!");

      setLocation("");
      setDescription("");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Erro ao criar reporte");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Ocorrência</Text>

      <Text style={styles.label}>Tipo:</Text>

      <Text style={styles.label}>Localização:</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Enviar Reporte"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
