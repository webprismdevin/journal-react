import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';


function JournalEditor() {
    const [editorState, setEditorState] = useState(
      EditorState.createEmpty()
    );
   
    const editor = React.useRef(null);
   
    function focusEditor() {
      editor.current.focus();
    }

    const handleKeyCommand  = (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
  
      if (newState) {
        this.onChange(newState);
        return 'handled';
      }
  
      return 'not-handled';
    }
   
    useEffect(() => {
      focusEditor()
    }, []);
   
    return (
      <div onClick={focusEditor}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
        />
      </div>
    );
  }

export default JournalEditor;