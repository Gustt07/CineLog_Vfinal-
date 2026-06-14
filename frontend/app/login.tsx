import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useFirebaseAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useFirebaseAuth();

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), senha);
      router.replace("/(tabs)");
    } catch (error: any) {
      let msg = "Erro ao fazer login. Verifique suas credenciais.";
      if (error?.code === "auth/user-not-found") {
        msg = "Usuário não encontrado.";
      } else if (error?.code === "auth/wrong-password") {
        msg = "Senha incorreta.";
      } else if (error?.code === "auth/invalid-email") {
        msg = "E-mail inválido.";
      } else if (error?.code === "auth/invalid-credential") {
        msg = "Credenciais inválidas. Verifique e-mail e senha.";
      }
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8">
            <View className="items-center mb-10">
              <Text className="text-4xl font-bold text-primary">CineLog</Text>
              <Text className="text-base text-muted mt-2">
                Seu diário de filmes e séries
              </Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">
                  E-mail
                </Text>
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                  placeholder="seu@email.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-1">
                  Senha
                </Text>
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                  placeholder="Sua senha"
                  placeholderTextColor="#94A3B8"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-4"
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center mt-4"
                onPress={() => router.push("/register" as any)}
                activeOpacity={0.7}
              >
                <Text className="text-primary font-medium">
                  Não tem conta? Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
