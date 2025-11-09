import { useReports } from "@/context/reportContext";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, FlatList } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { AZURE_MAPS_KEY } from "@env";
import { MaterialIcons } from "@expo/vector-icons";

// Mesmo formato de resultado do index.tsx
interface SearchResult {
  position: {
    lat: number;
    lon: number;
  };
  address: {
    freeformAddress: string;
  };
  poi?: {
    name: string;
  };
}

export default function MakeReport() {
  const { addReport, loading } = useReports();

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(true);

  // ---- Localização inicial (usuário) ----
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão negada", "Não foi possível acessar sua localização.");
          setGettingLocation(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = pos.coords;

        setCoords({ latitude, longitude });

        // Busca o endereço com base nas coordenadas (Azure Maps)
        try {
          const response = await fetch(
            `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&query=${latitude},${longitude}&subscription-key=${AZURE_MAPS_KEY}`
          );
          const data = await response.json();
          const address = data?.addresses?.[0]?.address?.freeformAddress;
          if (address) setSearchQuery(address);
        } catch (err) {
          console.warn("Erro ao buscar endereço:", err);
        }
      } catch {
        Alert.alert("Erro", "Falha ao obter localização.");
      } finally {
        setGettingLocation(false);
      }
    })();
  }, []);

  // ---- Autocomplete Azure Maps ----
  useEffect(() => {
    if (searchQuery.length < 3) {
      setShowResults(false);
      setSearchResults([]);
      return;
    }

    const fetchAutocomplete = async () => {
      setAutocompleteLoading(true);
      try {
        const url = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${AZURE_MAPS_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&typeahead=true&limit=5`;
        const res = await axios.get(url);
        setSearchResults(res.data.results);
        setShowResults(true);
      } catch {
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setAutocompleteLoading(false);
      }
    };

    const timeout = setTimeout(fetchAutocomplete, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // ---- Quando usuário seleciona um resultado ----
  const selectSearchResult = (result: SearchResult) => {
    setSearchQuery(result.address.freeformAddress);
    setCoords({
      latitude: result.position.lat,
      longitude: result.position.lon,
    });
    setShowResults(false);
  };

  // ---- Submissão do reporte ----
  const handleSubmit = async () => {
    if (!searchQuery.trim()) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }

    try {
      // Se o usuário digitou um endereço manual e não selecionou autocomplete
      let finalCoords = coords;

      if (searchQuery && (!coords || showResults)) {
        const url = `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=${AZURE_MAPS_KEY}&query=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=1`;
        const res = await axios.get(url);
        if (res.data.results?.length) {
          const pos = res.data.results[0].position;
          finalCoords = { latitude: pos.lat, longitude: pos.lon };
        }
      }

      if (!finalCoords) {
        return Alert.alert("Erro", "Não foi possível determinar a localização.");
      }

      await addReport({
        endereco: searchQuery,
        latitude: finalCoords.latitude,
        longitude: finalCoords.longitude,
      });

      Alert.alert("Sucesso", "Reporte criado!");
      setSearchQuery("");
      setShowResults(false);
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Erro ao criar reporte");
    }
  };

  if (gettingLocation) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Obtendo localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Reporte</Text>

      <Text style={styles.label}>Localização:</Text>
      <View style={styles.searchBar}>
        <MaterialIcons name="place" size={22} color="#9CA3AF" />
        <TextInput
          style={styles.input}
          placeholder="Digite o endereço ou lugar"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {autocompleteLoading && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

      {showResults && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => selectSearchResult(item)}
              >
                <MaterialIcons name="location-on" size={20} color="#007AFF" />
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultName}>{item.poi?.name || "Local"}</Text>
                  <Text style={styles.resultAddress}>
                    {item.address.freeformAddress}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Enviar Reporte"}</Text>
      </TouchableOpacity>

      {coords && (
        <Text style={{ marginTop: 10, textAlign: "center", color: "#555" }}>
          📍 {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: { flex: 1, fontSize: 15, marginLeft: 8, color: "#1F2937", paddingVertical: 10 },
  resultsContainer: { backgroundColor: "#fff", borderRadius: 8, maxHeight: 180, borderWidth: 1, borderColor: "#E5E7EB" },
  resultItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  resultTextContainer: { flex: 1, marginLeft: 12 },
  resultName: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  resultAddress: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  textArea: { height: 100, textAlignVertical: "top" },
  button: { backgroundColor: "#007AFF", borderRadius: 8, padding: 15, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
