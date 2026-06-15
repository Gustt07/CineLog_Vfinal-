import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { inserirFilme, alterarFilme, consultarFilme } from "@/lib/api";
import {
  buscarFilmesTmdb,
  buildTmdbPosterUrl,
  getTmdbMovieYear,
  hasTmdbApiKey,
  type TmdbMovieSuggestion,
} from "@/lib/tmdb";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

const universalAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === "web") {
    window.alert(`${title}: ${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
  }
};

export default function FilmeFormScreen() {
  const { id, titulo: tituloParam, capaUrl: capaUrlParam, comentario: comentarioParam } = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    capaUrl?: string;
    comentario?: string;
  }>();
  const isEditing = !!id;

  const [titulo, setTitulo] = useState("");
  const [nota, setNota] = useState(3);
  const [dataAssistida, setDataAssistida] = useState("");
  const [finalizado, setFinalizado] = useState(false);
  const [comentario, setComentario] = useState("");
  const [capaUrl, setCapaUrl] = useState("");
  const [favorito, setFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [buscaTmdb, setBuscaTmdb] = useState("");
  const [tmdbSuggestions, setTmdbSuggestions] = useState<TmdbMovieSuggestion[]>([]);
  const [loadingTmdb, setLoadingTmdb] = useState(false);
  const [tmdbError, setTmdbError] = useState("");

  const tmdbEnabled = hasTmdbApiKey();

  useEffect(() => {
    if (isEditing && id) {
      loadFilme(parseInt(id));
    } else {
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, "0");
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const ano = hoje.getFullYear();
      setDataAssistida(`${dia}/${mes}/${ano}`);

      if (tituloParam) {
        setTitulo(tituloParam);
        setBuscaTmdb(tituloParam);
      }
      if (capaUrlParam) {
        setCapaUrl(capaUrlParam);
      }
      if (comentarioParam) {
        setComentario(comentarioParam);
      }
    }
  }, [id, tituloParam, capaUrlParam, comentarioParam]);

  useEffect(() => {
    const termo = buscaTmdb.trim();

    if (!tmdbEnabled || termo.length < 2) {
      setTmdbSuggestions([]);
      setLoadingTmdb(false);
      setTmdbError("");
      return;
    }

    let active = true;
    setLoadingTmdb(true);
    setTmdbError("");

    const timer = setTimeout(async () => {
      try {
        const results = await buscarFilmesTmdb(termo);
        if (active) {
          setTmdbSuggestions(results);
        }
      } catch (error) {
        if (active) {
          setTmdbSuggestions([]);
          setTmdbError("Não foi possível buscar filmes no TMDB agora.");
        }
      } finally {
        if (active) {
          setLoadingTmdb(false);
        }
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [buscaTmdb, tmdbEnabled]);

  const loadFilme = async (filmeId: number) => {
    try {
      const filme = await consultarFilme(filmeId);
      setTitulo(filme.titulo || "");
      setNota(filme.nota || 3);
      setDataAssistida(filme.dataAssistida || "");
      setFinalizado(filme.finalizado || false);
      setComentario(filme.comentario || "");
      setCapaUrl(filme.capaUrl || "");
      setFavorito(filme.favorito || false);
    } catch (error) {
      universalAlert("Erro", "Não foi possível carregar os dados.");
      router.back();
    } finally {
      setLoadingData(false);
    }
  };

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const url = window.prompt("Cole a URL da imagem:");
      if (url) setCapaUrl(url);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      universalAlert("Permissão necessária", "Precisamos de permissão para acessar sua galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setCapaUrl(result.assets[0].uri);
    }
  };

  const handleSelectTmdbMovie = (movie: TmdbMovieSuggestion) => {
    setTitulo(movie.title);
    setComentario(movie.overview || "");
    setCapaUrl(buildTmdbPosterUrl(movie.poster_path));
    setBuscaTmdb(`${movie.title} (${getTmdbMovieYear(movie.release_date)})`);
    setTmdbSuggestions([]);
    setTmdbError("");
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      universalAlert("Erro", "Informe o título.");
      return;
    }

    setLoading(true);
    try {
      const filmeData: any = {
        titulo: titulo.trim(),
        nota,
        dataAssistida,
        finalizado,
        comentario: comentario.trim(),
        capaUrl: capaUrl || "",
        favorito,
      };

      if (isEditing && id) {
        filmeData.id = parseInt(id);
        await alterarFilme(parseInt(id), filmeData);
        universalAlert("Sucesso", "Filme atualizado.", () => router.replace("/"));
      } else {
        await inserirFilme(filmeData);
        universalAlert("Sucesso", "Filme adicionado.", () => router.replace("/"));
      }
    } catch (error: any) {
      console.error(error);
      universalAlert("Erro ao salvar", "Verifique se o backend está rodando em http://127.0.0.1:8080.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color="#2563EB" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground" style={{ marginLeft: 12 }}>
              {isEditing ? "Editar filme" : "Novo filme"}
            </Text>
          </View>

          <Text className="text-sm font-medium text-foreground mb-1">Buscar no TMDB</Text>
          <View style={{ position: "relative", marginBottom: tmdbSuggestions.length > 0 ? 8 : 16 }}>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              value={buscaTmdb}
              onChangeText={setBuscaTmdb}
              placeholder="Digite o nome do filme"
              placeholderTextColor="#94A3B8"
              editable={tmdbEnabled}
            />
            {loadingTmdb ? (
              <ActivityIndicator
                size="small"
                color="#2563EB"
                style={{ position: "absolute", right: 14, top: 14 }}
              />
            ) : null}
          </View>
          {tmdbError ? (
            <Text style={{ color: "#EF4444", fontSize: 12, marginBottom: 8 }}>{tmdbError}</Text>
          ) : null}
          {tmdbSuggestions.length > 0 ? (
            <View className="bg-surface border border-border rounded-xl mb-4" style={{ overflow: "hidden" }}>
              {tmdbSuggestions.map((movie, index) => (
                <TouchableOpacity
                  key={movie.id}
                  onPress={() => handleSelectTmdbMovie(movie)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderBottomWidth: index === tmdbSuggestions.length - 1 ? 0 : 1,
                    borderBottomColor: "#334155",
                  }}
                >
                  <MaterialIcons name="search" size={18} color="#94A3B8" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text className="text-foreground font-semibold" numberOfLines={1}>
                      {movie.title}
                    </Text>
                    <Text className="text-muted text-xs">{getTmdbMovieYear(movie.release_date)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              {capaUrl ? (
                <Image source={{ uri: capaUrl }} style={{ width: 140, height: 210, borderRadius: 12 }} resizeMode="cover" />
              ) : (
                <View style={{ width: 140, height: 210, borderRadius: 12, backgroundColor: "#334155", alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name="add-a-photo" size={40} color="#94A3B8" />
                  <Text style={{ color: "#94A3B8", marginTop: 8, fontSize: 12 }}>Adicionar capa</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-medium text-foreground mb-1">URL da capa</Text>
          <TextInput
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4"
            value={capaUrl}
            onChangeText={setCapaUrl}
            placeholder="https://..."
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text className="text-sm font-medium text-foreground mb-1">Título</Text>
          <TextInput className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4" value={titulo} onChangeText={setTitulo} />

          <Text className="text-sm font-medium text-foreground mb-1">Nota</Text>
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setNota(i)} activeOpacity={0.7}>
                <MaterialIcons name={i <= nota ? "star" : "star-border"} size={40} color={i <= nota ? "#F59E0B" : "#94A3B8"} />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm font-medium text-foreground mb-1">Data assistida (DD/MM/AAAA)</Text>
          <TextInput className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4" value={dataAssistida} onChangeText={setDataAssistida} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text className="text-sm font-medium text-foreground">Finalizado?</Text>
            <Switch value={finalizado} onValueChange={setFinalizado} trackColor={{ false: "#334155", true: "#22C55E" }} thumbColor="#fff" />
          </View>

          <Text className="text-sm font-medium text-foreground mb-1">Comentário</Text>
          <TextInput className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4" value={comentario} onChangeText={setComentario} multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: "top" }} />

          <TouchableOpacity style={{ backgroundColor: "#2563EB", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 8 }} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{isEditing ? "Salvar alterações" : "Adicionar filme"}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
