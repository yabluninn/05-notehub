import axios from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search && search.trim() !== "") {
    params.search = search.trim();
  }

  const response = await axios.get<FetchNotesResponse>(API_URL, {
    params,
    headers,
  });

  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response = await axios.post<Note>(API_URL, note, { headers });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${API_URL}/${id}`, { headers });
  return response.data;
};
