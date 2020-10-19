import React from "react";
import "./Note/Note.css";

export default class NotefulError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="Note">
          <h2>Could not display content.</h2>
          <p className="Note__title">Please refresh page or contact us.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
