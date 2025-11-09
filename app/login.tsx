import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/authContext";
import { useAlert } from "../hooks/useAlert";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { showAlert } = useAlert();
  const { login, register } = useAuth();
  const insets = useSafeAreaInsets();

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleRegister = async () => {
    if (!name.trim()) return showAlert("Erro", "Digite seu nome");
    if (!email.trim() || !validateEmail(email))
      return showAlert("Erro", "Digite um email válido");
    if (!password.trim() || password.length < 6)
      return showAlert("Erro", "A senha deve ter pelo menos 6 caracteres");
    if (password !== confirmPassword)
      return showAlert("Erro", "As senhas não coincidem");

    try {
      await register(email, password, name);
      showAlert("Sucesso", "Conta criada!");
      setTimeout(() => router.replace("/(tabs)/index"), 600);
    } catch (error: any) {
      showAlert("Erro", error.response?.data?.message || "Erro ao criar conta");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !validateEmail(email))
      return showAlert("Erro", "Digite um email válido");
    if (!password.trim())
      return showAlert("Erro", "Digite sua senha");

    try {
      await login(email, password);
      showAlert("Sucesso", "Bem-vindo!");
      setTimeout(() => router.replace("/(tabs)/index"), 600);
    } catch (error: any) {
      showAlert("Erro", error.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={["#b5b5b5", "#408A40FF"]} style={styles.gradient}>
          <View style={styles.header}>
            <Text style={styles.title}>Flood Zone</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.activeToggle]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                  Entrar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                onPress={() => setIsLogin(false)}
              >
                <Text
                  style={[styles.toggleText, !isLogin && styles.activeToggleText]}
                >
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#667eea" />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#667eea" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={isLogin ? handleLogin : handleRegister}
            >
              <LinearGradient
                colors={["#667eea", "#4BA272FF"]}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitText}>
                  {isLogin ? "Entrar" : "Cadastrar"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  gradient: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 36, fontWeight: "bold", color: "#fff", marginTop: 16 },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 10 },
  activeToggle: { backgroundColor: "#fff" },
  toggleText: { fontSize: 16, color: "#666", fontWeight: "500" },
  activeToggleText: { color: "#667eea", fontWeight: "700" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#333" },
  submitButton: { borderRadius: 12, overflow: "hidden", marginTop: 8 },
  submitGradient: { paddingVertical: 16, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
