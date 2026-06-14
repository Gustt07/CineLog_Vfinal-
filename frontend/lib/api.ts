import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Pega o IP do computador que está rodando o Expo automaticamente
const getBaseUrl = () => {
  // Se estiver na Web, usa localhost
  if (Platform.OS === "web") {
    return "http://localhost:8080/fcontroller";
  }

  // Se estiver no celular (Expo Go), tenta pegar o IP do host
  const debuggerHost = Constants.expoConfig?.hostUri;
  const ip = debuggerHost?.split(":")[0];

  if (ip) {
    return `http://${ip}:8080/fcontroller`;
  }

  // Fallback para emulador Android
  return "http://10.0.2.2:8080/fcontroller";
};

const API_BASE_URL = getBaseUrl();
console.log("Conectando na API:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export interface Filme {
  id?: number;
  titulo: string;
  nota: number;
  dataAssistida: string;
  finalizado: boolean;
  comentario: string;
  capaUrl: string;
  favorito: boolean;
}

export async function listarFilmes(): Promise<Filme[]> {
  try {
    const response = await api.get<Filme[]>("/filmes");
    return response.data || [];
  } catch (error) {
    console.error("Erro API Listar:", error);
    return [];
  }
}

export async function consultarFilme(id: number): Promise<Filme> {
  const response = await api.get<Filme>(`/filmes/${id}`);
  return response.data;
}

export async function inserirFilme(filme: Omit<Filme, "id">): Promise<Filme> {
  const response = await api.post<Filme>("/filmes", filme);
  return response.data;
}

export async function alterarFilme(id: number, filme: Filme): Promise<Filme> {
  const response = await api.put<Filme>(`/filmes/${id}`, filme);
  return response.data;
}

export async function excluirFilme(id: number): Promise<void> {
  await api.delete(`/filmes/${id}`);
}

export default api;
