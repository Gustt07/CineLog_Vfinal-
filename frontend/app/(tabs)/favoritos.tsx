import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { listarFilmes, type Filme } from "@/lib/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function FavoritosScreen() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavoritos = async () => {
    try {
      const data = await listarFilmes();
      setFilmes(data.filter((f) => f.favorito));
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoritos();
    }, [])
  );

  const formatDate = (dateStr: string) => {
    return dateStr || "—";
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
          <Text className="text-lg font-bold text-foreground">{item.titulo}</Text>
          {renderStars(item.nota)}
          <Text className="text-sm text-muted mt-1">
            Assistido: {formatDate(item.dataAssistida)}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
              backgroundColor: item.finalizado ? "#22C55E" : "#F59E0B",
              alignSelf: "flex-start",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>
              {item.finalizado ? "Finalizado" : "Assistindo"}
            </Text>
          </View>
          {item.comentario ? (
            <Text className="text-sm text-muted mt-1" numberOfLines={2}>
              {item.comentario}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      <View className="px-4 pb-3">
        <Text className="text-2xl font-bold text-foreground">Favoritos</Text>
        <Text className="text-sm text-muted">
          {filmes.length} filme{filmes.length !== 1 ? "s" : ""} favorito{filmes.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={filmes}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFavoritos(); }} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name="favorite-border" size={64} color="#94A3B8" />
              <Text className="text-muted text-base mt-4">Nenhum favorito ainda</Text>
              <Text className="text-muted text-sm mt-1">Toque no coração para favoritar</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
