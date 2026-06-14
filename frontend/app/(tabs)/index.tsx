import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { listarFilmes, excluirFilme, alterarFilme, type Filme } from "@/lib/api";
import { useFirebaseAuth } from "@/lib/auth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const parseWatchedDate = (dateStr?: string) => {
  if (!dateStr) {
    return null;
  }

  const [day, month, year] = dateStr.split("/");
  if (day && month && year) {
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function HomeScreen() {
  const { user, logout, loading: authLoading } = useFirebaseAuth();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const dashboardStats = useMemo(() => {
    const total = filmes.length;
    const media =
      total > 0 ? filmes.reduce((sum, filme) => sum + Number(filme.nota || 0), 0) / total : 0;
    const notaDistribuicao = [1, 2, 3, 4, 5].map((nota) => ({
      nota,
      total: filmes.filter((filme) => Number(filme.nota) === nota).length,
    }));
    const maiorQuantidade = Math.max(1, ...notaDistribuicao.map((item) => item.total));
    const hoje = new Date();
    const mesAtual = filmes.filter((filme) => {
      const data = parseWatchedDate(filme.dataAssistida);
      return (
        data?.getMonth() === hoje.getMonth() &&
        data?.getFullYear() === hoje.getFullYear()
      );
    }).length;
    const finalizados = filmes.filter((filme) => filme.finalizado).length;

    return { total, media, notaDistribuicao, maiorQuantidade, mesAtual, finalizados };
  }, [filmes]);

  const filmesFiltrados = useMemo(() => {
    const termo = deferredSearchTerm.trim().toLowerCase();

    if (!termo) {
      return filmes;
    }

    return filmes.filter((filme) => {
      const searchable = [
        filme.titulo,
        filme.comentario,
        filme.dataAssistida,
        filme.finalizado ? "finalizado" : "assistindo",
        `${filme.nota} estrelas`,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(termo);
    });
  }, [filmes, deferredSearchTerm]);

  const fetchFilmes = async () => {
    try {
      const data = await listarFilmes();
      setFilmes(data);
    } catch (error) {
      console.log("Erro ao carregar filmes:", error);
      setFilmes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFilmes();
    }, [])
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login" as any);
    }
  }, [user, authLoading]);

  const handleDelete = (id: number) => {
    Alert.alert("Excluir filme", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluirFilme(id);
            setFilmes((prev) => prev.filter((f) => f.id !== id));
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  };

  const handleFavorito = async (filme: Filme) => {
    try {
      const updated = { ...filme, favorito: !filme.favorito };
      await alterarFilme(filme.id!, updated);
      setFilmes((prev) => prev.map((f) => (f.id === filme.id ? updated : f)));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar favorito.");
    }
  };

  const fazerLogout = async () => {
    try {
      await logout();
      router.replace("/login" as any);
    } catch (error) {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.alert("Erro: Não foi possível sair da conta.");
      } else {
        Alert.alert("Erro", "Não foi possível sair da conta.");
      }
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const confirmou = window.confirm("Deseja sair da sua conta?");
      if (confirmou) {
        fazerLogout();
      }
      return;
    }

    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: fazerLogout,
      },
    ]);
  };

  const formatDate = (dateStr: string) => {
    return dateStr || "-";
  };

  const renderStars = (nota: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= nota ? "star" : "star-border"}
          size={18}
          color={i <= nota ? "#F59E0B" : "#94A3B8"}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  const dashboardHeader = useMemo(() => (
    <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
        <View className="bg-surface border border-border rounded-2xl p-4" style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <MaterialIcons name="movie" size={18} color="#2563EB" />
            <Text className="text-muted text-xs font-semibold" style={{ marginLeft: 6 }}>
              Total
            </Text>
          </View>
          <Text className="text-foreground text-2xl font-bold">{dashboardStats.total}</Text>
        </View>
        <View className="bg-surface border border-border rounded-2xl p-4" style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <MaterialIcons name="star" size={18} color="#F59E0B" />
            <Text className="text-muted text-xs font-semibold" style={{ marginLeft: 6 }}>
              Média
            </Text>
          </View>
          <Text className="text-foreground text-2xl font-bold">
            {dashboardStats.media.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
        <View className="bg-surface border border-border rounded-2xl p-4" style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <MaterialIcons name="calendar-month" size={18} color="#22C55E" />
            <Text className="text-muted text-xs font-semibold" style={{ marginLeft: 6 }}>
              Mês atual
            </Text>
          </View>
          <Text className="text-foreground text-2xl font-bold">{dashboardStats.mesAtual}</Text>
        </View>
        <View className="bg-surface border border-border rounded-2xl p-4" style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <MaterialIcons name="task-alt" size={18} color="#14B8A6" />
            <Text className="text-muted text-xs font-semibold" style={{ marginLeft: 6 }}>
              Finalizados
            </Text>
          </View>
          <Text className="text-foreground text-2xl font-bold">
            {dashboardStats.finalizados}
          </Text>
        </View>
      </View>

      <View className="bg-surface border border-border rounded-2xl p-4">
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MaterialIcons name="bar-chart" size={20} color="#2563EB" />
          <Text className="text-foreground font-bold text-base" style={{ marginLeft: 8 }}>
            Distribuição de notas
          </Text>
        </View>

        {dashboardStats.notaDistribuicao.map((item) => {
          const widthPercent = `${Math.max(4, (item.total / dashboardStats.maiorQuantidade) * 100)}%` as const;

          return (
            <View key={item.nota} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View style={{ width: 58, flexDirection: "row", alignItems: "center" }}>
                <Text className="text-muted text-sm font-semibold">{item.nota}</Text>
                <MaterialIcons name="star" size={14} color="#F59E0B" style={{ marginLeft: 3 }} />
              </View>
              <View style={{ flex: 1, height: 12, borderRadius: 6, backgroundColor: "#334155", overflow: "hidden" }}>
                <View
                  style={{
                    width: widthPercent,
                    height: "100%",
                    borderRadius: 6,
                    backgroundColor: item.total > 0 ? "#2563EB" : "#475569",
                  }}
                />
              </View>
              <Text className="text-muted text-sm font-semibold" style={{ width: 30, textAlign: "right" }}>
                {item.total}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: 12 }}>
        <View
          className="bg-surface border border-border rounded-xl px-3"
          style={{ flexDirection: "row", alignItems: "center", minHeight: 48 }}
        >
          <MaterialIcons name="search" size={22} color="#94A3B8" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar filmes"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            className="text-foreground"
            style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}
          />
          {searchTerm.trim() ? (
            <TouchableOpacity onPress={() => setSearchTerm("")} activeOpacity={0.7}>
              <MaterialIcons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  ), [dashboardStats, searchTerm]);

  const renderItem = ({ item }: { item: Filme }) => (
    <View className="bg-surface border border-border rounded-2xl p-4 mb-3 mx-4">
      <View style={{ flexDirection: "row" }}>
        {item.capaUrl ? (
          <Image
            source={{ uri: item.capaUrl }}
            style={{ width: 60, height: 90, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: 60, height: 90, borderRadius: 8, backgroundColor: "#334155", alignItems: "center", justifyContent: "center" }}>
            <MaterialIcons name="movie" size={28} color="#94A3B8" />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text className="text-lg font-bold text-foreground" style={{ flex: 1 }}>{item.titulo}</Text>
            <TouchableOpacity onPress={() => handleFavorito(item)} activeOpacity={0.7}>
              <MaterialIcons
                name={item.favorito ? "favorite" : "favorite-border"}
                size={24}
                color={item.favorito ? "#EF4444" : "#94A3B8"}
              />
            </TouchableOpacity>
          </View>
          {renderStars(item.nota)}
          <Text className="text-sm text-muted mt-1">
            Assistido: {formatDate(item.dataAssistida)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: item.finalizado ? "#22C55E" : "#F59E0B",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>
                {item.finalizado ? "Finalizado" : "Assistindo"}
              </Text>
            </View>
          </View>
          {item.comentario ? (
            <Text className="text-sm text-muted mt-1" numberOfLines={2}>
              {item.comentario}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10, gap: 8 }}>
        <TouchableOpacity
          style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#2563EB", borderRadius: 8 }}
          onPress={() => router.push({ pathname: "/filme-form" as any, params: { id: item.id?.toString() } })}
          activeOpacity={0.7}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#EF4444", borderRadius: 8 }}
          onPress={() => item.id && handleDelete(item.id)}
          activeOpacity={0.7}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (authLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-row justify-between items-center px-4 pb-3">
        <View>
          <Text className="text-2xl font-bold text-foreground">Meu diário</Text>
          <Text className="text-sm text-muted">
            {searchTerm.trim()
              ? `${filmesFiltrados.length} de ${filmes.length} filme${filmes.length !== 1 ? "s" : ""}`
              : `${filmes.length} filme${filmes.length !== 1 ? "s" : ""}`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <MaterialIcons name="logout" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={filmesFiltrados}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={renderItem}
          ListHeaderComponent={dashboardHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFilmes(); }} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name={searchTerm.trim() ? "search-off" : "movie"} size={64} color="#94A3B8" />
              <Text className="text-muted text-base mt-4">
                {searchTerm.trim() ? "Nenhum filme encontrado" : "Nenhum filme cadastrado"}
              </Text>
              <Text className="text-muted text-sm mt-1">
                {searchTerm.trim() ? "Tente outro termo de busca" : "Toque no + para adicionar"}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#2563EB",
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
        onPress={() => router.push("/filme-form" as any)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}
