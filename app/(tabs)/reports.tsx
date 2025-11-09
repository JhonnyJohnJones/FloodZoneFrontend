import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useReports } from "../../context/reportContext";

export default function ReportsScreen() {
  const { reports, loading, refresh } = useReports();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>{item.incidentType}</Text>
            <Text>{item.description || item.locationText}</Text>
            <Text style={styles.time}>{item.time || item.createdAt}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? "Carregando..." : "Nenhum reporte ainda"}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 },
  type: { fontWeight: "bold", color: "#007AFF" },
  time: { fontSize: 12, color: "#555" },
  empty: { textAlign: "center", color: "#777", marginTop: 50 },
});
