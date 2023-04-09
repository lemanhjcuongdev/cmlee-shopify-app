import {
  faA,
  faBold,
  faItalic,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, LegacyCard, Text } from "@shopify/polaris";
import { useEffect } from "react";

function ContentEditor({ editorRef, content, handleContentChange }) {
  //fill existing content in text editor
  useEffect(() => {
    editorRef.current.innerHTML = content;
  }, [content]);

  return (
    <div style={{ marginTop: "18px" }}>
      <div style={{ marginBottom: "4px" }}>
        <Text>Content</Text>
      </div>
      <LegacyCard>
        <LegacyCard>
          <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
            <ButtonGroup segmented>
              <Button icon={<FontAwesomeIcon icon={faA} />} />
              <Button icon={<FontAwesomeIcon icon={faBold} />} />
              <Button icon={<FontAwesomeIcon icon={faItalic} />} />
              <Button icon={<FontAwesomeIcon icon={faUnderline} />} />
            </ButtonGroup>
          </div>
          <LegacyCard.Subsection>
            <div
              ref={editorRef}
              contentEditable
              className="editor-container"
              spellCheck="false"
              onSelect={handleContentChange}
              style={{
                borderTop: "1px solid #ccc",
                padding: "10px",
                lineHeight: "1.6",
                outline: "none",
                minHeight: "200px",
              }}
            ></div>
          </LegacyCard.Subsection>
        </LegacyCard>
      </LegacyCard>
    </div>
  );
}

export default ContentEditor;
