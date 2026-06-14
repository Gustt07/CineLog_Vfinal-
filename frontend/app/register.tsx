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

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useFirebaseAuth();

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), senha);
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error: any) {
      let msg = "Erro ao criar conta.";
      if (error?.code === "auth/email-already-in-use") {
        msg = "Este e-mail já está em uso.";
      } else if (error?.code === "auth/weak-password") {
        msg = "A senha é muito fraca. Use pelo menos 6 caracteres.";
      } else if (error?.code === "auth/invalid-email") {
        msg = "E-mail inválido.";
      } else {
        msg = error?.message || error?.code || "Erro desconhecido";
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
              <Text className="text-3xl font-bold text-primary">Criar Conta</Text>
              <Text className="text-base text-muted mt-2">
                Cadastre-se no CineLog
              </Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-1">
                  Nome
                </Text>
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                  placeholder="Seu nome"
                  placeholderTextColor="#94A3B8"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>

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
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#94A3B8"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-1">
                  Confirmar Senha
                </Text>
                <TextInput
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                  placeholder="Repita a senha"
                  placeholderTextColor="#94A3B8"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-4"
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Cadastrar
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center mt-4"
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Text className="text-primary font-medium">
                  Já tem conta? Faça login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
