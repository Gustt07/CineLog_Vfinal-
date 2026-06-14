import axios from "axios";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
});

export interface TmdbMovieSuggestion {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  poster_path?: string | null;
}

export const hasTmdbApiKey = () => TMDB_API_KEY.trim().length > 0;

export const buildTmdbPosterUrl = (posterPath?: string | null) => {
  if (!posterPath) {
    return "";
  }

  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

export const getTmdbMovieYear = (releaseDate?: string) => {
  if (!releaseDate) {
    return "Ano indisponível";
  }

  return releaseDate.slice(0, 4);
};

export async function buscarFilmesTmdb(query: string): Promise<TmdbMovieSuggestion[]> {
  if (!hasTmdbApiKey() || query.trim().length < 2) {
    return [];
  }

  const response = await tmdbApi.get<{ results: TmdbMovieSuggestion[] }>("/search/movie", {
    params: {
      api_key: TMDB_API_KEY,
      language: "pt-BR",
      query: query.trim(),
      include_adult: false,
      page: 1,
    },
  });

  return (response.data.results ?? []).slice(0, 6);
}

export async function listarFilmesPopularesTmdb(): Promise<TmdbMovieSuggestion[]> {
  if (!hasTmdbApiKey()) {
    return [];
  }

  const response = await tmdbApi.get<{ results: TmdbMovieSuggestion[] }>("/movie/popular", {
    params: {
      api_key: TMDB_API_KEY,
      language: "pt-BR",
      page: 1,
    },
  });

  return response.data.results ?? [];
}
