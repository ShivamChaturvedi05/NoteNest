import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

import "../styles.css";

axios.defaults.withCredentials = true; // send session cookie

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Fetch notes failed:", err));
  }, []);

  const addNote = (note) => {
    axios
      .post("http://localhost:5000/notes", note)
      .then((res) => setNotes((prev) => [res.data, ...prev]))
      .catch((err) => console.error("Add note failed:", err));
  };

  const deleteNote = (id) => {
    axios
      .delete(`http://localhost:5000/notes/${id}`)
      .then(() => setNotes((prev) => prev.filter((n) => n.id !== id)))
      .catch((err) => console.error("Delete note failed:", err));
  };

  return (
    <div className="app">
      <Header />
      <div className="main-layout">
        <aside className="sidebar">
          <h2>Notes</h2>
          <CreateArea onAdd={addNote} />
        </aside>
        <section className="notes-area">
          <div className="notes-grid">
            {notes.map((note) => (
              <Note
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                onDelete={deleteNote}
              />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
