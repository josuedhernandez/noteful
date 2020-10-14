import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleButton from '../CircleButton/CircleButton';
import NotefulContext from '../NotefulContext';
import { countNotesForFolder } from '../notes-helpers';
import './NoteListNav.css';


export default class NoteListNav extends React.Component {
  static contextType = NotefulContext;

  render () {
    // Not sure I fully understand this notation?
    // Is this folders is created but if it doesn exist
    // it will assign an empty list?
    // When will this apply to be empty? when notes is undefined?
    const { folders: foldersxyz=[], notes=[] } = this.context;

    return (
    <div className='NoteListNav'>
      <ul className='NoteListNav__list'>
        {foldersxyz.map(folder =>
          <li key={folder.id}>
            <NavLink
              className='NoteListNav__folder-link'
              to={`/folder/${folder.id}`}
            >
              <span className='NoteListNav__num-notes'>
                {countNotesForFolder(notes, folder.id)}
              </span>
              {folder.name}
            </NavLink>
          </li>
        )}
      </ul>
      <div className='NoteListNav__button-wrapper'>
        <CircleButton
          tag={Link}
          to='/add-folder'
          type='button'
          className='NoteListNav__add-folder-button'
        >
          <FontAwesomeIcon icon='plus' />
          <br />
          Folder
        </CircleButton>
      </div>
    </div>
  )}
}