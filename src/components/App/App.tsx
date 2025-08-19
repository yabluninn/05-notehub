import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setPage(1); // сбрасываем на первую страницу при новом поиске
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isPending && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}

      {notes.length > 0 && <NoteList notes={notes} />}
      {notes.length === 0 && !isPending && <p>No notes found.</p>}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onSuccess={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
