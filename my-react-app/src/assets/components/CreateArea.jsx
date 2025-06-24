import React, { useState } from "react";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleNote(event) {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  function submitNote(event) {
    event.preventDefault();
    // Only add if at least one field has non-whitespace content
    if (note.title.trim() !== "" || note.content.trim() !== "") {
      props.onAdd({
        title: note.title.trim(),
        content: note.content.trim(),
      });
      setNote({
        title: "",
        content: "",
      });
    }
    // Otherwise do nothing
  }

  return (
    <div>
      <form onSubmit={submitNote}>
        <input
          name="title"
          value={note.title}
          onChange={handleNote}
          placeholder="Title"
        />
        <textarea
          name="content"
          value={note.content}
          onChange={handleNote}
          placeholder="Take a note..."
          rows="3"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
