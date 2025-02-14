'use client';

import { useEffect, useState } from 'react';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import Feedback from '../components/Feedback';
import styles from '../styles/home.module.css';

interface Book {
  id: number;
  title: string;
  author: string;
  image?: string;
  summary?: string;
  orderStatus?: string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error(`Failed to fetch books. Status: ${res.status}`);
      const data: Book[] = await res.json();
      setBooks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Error fetching books:', err.message);
      } else {
        setError('An unknown error occurred');
        console.error('Unexpected error:', err);
      }
    }
  };

  // Add a new book
  const addBook = (newBook: Omit<Book, 'id'>) => {
    const bookWithId = { ...newBook, id: books.length + 1 };
    setBooks([...books, bookWithId]);
  };

  // Delete a book
  const deleteBook = (id: number) => setBooks(books.filter((book) => book.id !== id));

  // Edit a book
  const editBook = (id: number, updatedBook: Partial<Book>) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, ...updatedBook } : book)));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Books Management</h1>

      {/* Form Section */}
      <section className={styles.section}>
        <h2>Add or Edit a Book</h2>
        <BookForm
          onSubmit={editingBook ? (book) => editBook(editingBook.id, book) : addBook}
          initialData={editingBook || undefined}
        />
      </section>

      {/* Book List Section */}
      <section className={`${styles.section} ${styles.scrollAnimation}`}>
        <h2>Your Books</h2>
        <BookList books={books} onDelete={deleteBook} onEdit={setEditingBook} />
      </section>

      {/* Feedback Section */}
      <section className={`${styles.section} ${styles.scrollAnimation}`}>
        <h2>Feedback</h2>
        <Feedback />
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
