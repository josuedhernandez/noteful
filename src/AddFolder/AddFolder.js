import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import "./AddFolder.css";
import ValidationError from "../ValidationError";

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      touched: false,
    };
  }

  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  static contextType = ApiContext;

  updateFolderName(folderName) {
    this.setState({ name: folderName, touched: true });
  }

  validateFolderName() {
    const name = this.state.name.trim();

    if (name.length === 0) {
      return "Folder Name is required";
    } else if (name.length < 3) {
      return "Folder Name must be at least 3 characters";
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const folder = {
      name: e.target["folder-name"].value,
    };
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(folder),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/folders/${folder.id}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const nameError = this.validateFolderName();

    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">Name</label>
            <input
              type="text"
              id="folder-name-input"
              name="folder-name"
              onChange={(e) => this.updateFolderName(e.target.value)}
            />
            {this.state.touched && <ValidationError message={nameError} />}
          </div>
          <div className="buttons">
            <button type="submit" disabled={this.validateFolderName()}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
