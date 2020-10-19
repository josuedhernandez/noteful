import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import "./AddNote.css";
import ValidationError from "../ValidationError";

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: "",
        touched: false,
      },
      content: {
        value: "",
        touched: false,
      },
    };
  }

  static defaultProps = {
    history: {
      push: () => {},
    },
  };
  static contextType = ApiContext;

  updateNoteName(noteName) {
    this.setState({ name: { value: noteName, touched: true } });
  }

  validateNoteName() {
    const name = this.state.name.value.trim();

    if (name.length === 0) {
      return "Note Name is required";
    } else if (name.length < 3) {
      return "Note Name must be at least 3 characters";
    }
  }

  updateNoteContent(noteContent) {
    this.setState({ content: { value: noteContent, touched: true } });
  }

  validateNoteContent() {
    const name = this.state.content.value.trim();

    if (name.length === 0) {
      return "Note Content is required";
    } else if (name.length < 3) {
      return "Note Content must be at least 3 characters";
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      name: e.target["note-name"].value,
      content: e.target["note-content"].value,
      folderId: e.target["note-folder-id"].value,
      modified: new Date(),
    };
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/folder/${note.folderId}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    const noteNameError = this.validateNoteName();
    const noteContentError = this.validateNoteContent();

    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="note-name-input">Name</label>
            <input
              type="text"
              id="note-name-input"
              name="note-name"
              onChange={(e) => this.updateNoteName(e.target.value)}
            />
            {this.state.name.touched && (
              <ValidationError message={noteNameError} />
            )}
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              name="note-content"
              onChange={(e) => this.updateNoteContent(e.target.value)}
            />
            {this.state.content.touched && (
              <ValidationError message={noteContentError} />
            )}
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select id="note-folder-select" name="note-folder-id">
              <option value={null}>...</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button
              type="submit"
              disabled={this.validateNoteName() || this.validateNoteContent()}
            >
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
