import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import {
  buildTmdbPosterUrl,
  hasTmdbApiKey,
  listarFilmesPopularesTmdb,
  type TmdbMovieSuggestion,
} from "@/lib/tmdb";

export default function ExplorarScreen() {
  const { width } = useWindowDimensions();
  const [filmes, setFilmes] = useState<TmdbMovieSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const cardGap = 12;
  const horizontalPadding = 16;
  const cardWidth = (width - horizontalPadding * 2 - cardGap * (numColumns - 1)) / numColumns;

  const carregarPopulares = useCallback(async () => {
    if (!hasTmdbApiKey()) {
      setFilmes([]);
      setError("Configure EXPO_PUBLIC_TMDB_API_KEY no arquivo .env para explorar filmes.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError("");
      const data = await listarFilmesPopularesTmdb();
      setFilmes(data);
    } catch (err) {
      setError("Nao foi possivel carregar os filmes em alta.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarPopulares();
  }, [carregarPopulares]);

  const handleSelectMovie = (movie: TmdbMovieSuggestion) => {
    router.push({
      pathname: "/filme-form" as any,
      params: {
        titulo: movie.title,
        capaUrl: buildTmdbPosterUrl(movie.poster_path),
        comentario: movie.overview || "",
      },
    });
  };

  const renderMovie = ({ item, index }: { item: TmdbMovieSuggestion; index: number }) => {
    const posterUrl = buildTmdbPosterUrl(item.poster_path);
    const isLastColumn = (index + 1) % numColumns === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelectMovie(item)}
        style={{
          width: cardWidth,
          marginRight: isLastColumn ? 0 : cardGap,
          marginBottom: 16,
        }}
      >
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            resizeMode="cover"
            style={{
              width: "100%",
              aspectRatio: 2 / 3,
              borderRadius: 12,
              backgroundColor: "#334155",
            }}
          />
        ) : (
          <View
            style={{
              width: "100%",
              aspectRatio: 2 / 3,
              borderRadius: 12,
              backgroundColor: "#334155",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="movie" size={36} color="#94A3B8" />
          </View>
        )}
        <Text className="text-foreground font-semibold mt-2" numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <View className="px-4 pb-4">
        <Text className="text-2xl font-bold text-foreground">Explorar</Text>
        <Text className="text-sm text-muted">Filmes em alta no TMDB</Text>
      </View>

      <FlatList
        key={numColumns}
        data={filmes}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              carregarPopulares();
            }}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <MaterialIcons name="travel-explore" size={64} color="#94A3B8" />
            <Text className="text-muted text-base mt-4 text-center">
              {error || "Nenhum filme encontrado"}
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
