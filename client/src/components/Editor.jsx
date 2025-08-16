import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const WYSIWYG = ({ content, formik, readonly, field = 'description', forceUpdate = false }) => {
  const [editorState, setEditorState] = useState(() => {
    if (content && content.value) {
      // Assuming `content.value` could be HTML, convert it to Draft.js compatible format
      const blocksFromHtml = htmlToDraft(content.value);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const debouncedOnChange = debounce((editor) => {
    const currentContent = editor.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(currentContent));
    // Update formik state with HTML content
    formik(field, htmlContent);
  }, 300);

  const onEditorStateChange = (editor) => {
    setEditorState(editor);
    debouncedOnChange(editor);
  };

  return (
    <Editor
      spellCheck
      readOnly={readonly}
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
    />
  );
};

export default WYSIWYG;
