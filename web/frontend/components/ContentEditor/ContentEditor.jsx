import {
  faA,
  faAlignLeft,
  faBold,
  faIndent,
  faItalic,
  faListOl,
  faListUl,
  faOutdent,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionList,
  Button,
  ButtonGroup,
  LegacyCard,
  Popover,
  Tabs,
  Text,
  Tooltip,
  TextField,
  ColorPicker,
  hsbToHex,
} from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";
import { TypeMinor, TextMajor } from "@shopify/polaris-icons";

function ContentEditor({ editorRef, content, handleContentChange }) {
  const [activeHeading, setActiveHeading] = useState(false);
  const [activeAlign, setActiveAlign] = useState(false);
  const [activePickColor, setActivePickColor] = useState(false);
  const [tabColor, setTabColor] = useState(0);
  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });
  const [bgColor, setBgColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });

  //fill existing content in text editor
  useEffect(() => {
    editorRef.current.innerHTML = content;
  }, []);

  const toggleHeading = useCallback(
    () => setActiveHeading((activeHeading) => !activeHeading),
    []
  );
  const activatorHeading = (
    <Tooltip content="Formatting" dismissOnMouseOut>
      <Button icon={TypeMinor} onClick={toggleHeading} disclosure />
    </Tooltip>
  );
  const handleChangeHeadingType = (command) => {
    editorRef.current.focus();
  };

  const handleTextDecoration = (command) => {
    const newText = document.createElement("p");
    // newText.innerHTML = window.getSelection().anchorNode.textContent;
    newText.innerHTML = editorRef.current.innerHTML;

    switch (command) {
      case "bold":
        {
          newText.style.fontWeight = "bold";
        }
        break;
      case "italic":
        {
          newText.style.fontStyle = "italic";
        }
        break;
      case "underline":
        {
          newText.style.textDecoration = "underline";
        }
        break;
    }

    editorRef.current.innerHTML = "";
    editorRef.current.appendChild(newText);
    console.log(editorRef.current);
    console.log(newText);
    editorRef.current.focus();
  };

  const toggleAlign = useCallback(
    () => setActiveAlign((activeAlign) => !activeAlign),
    []
  );

  const activatorAlign = (
    <Tooltip content="Alignment" dismissOnMouseOut>
      <Button
        icon={<FontAwesomeIcon icon={faAlignLeft} />}
        onClick={toggleAlign}
        disclosure
      />
    </Tooltip>
  );

  const togglePickColor = () => {
    setActivePickColor(!activePickColor);
  };

  const activatorPickColor = (
    <Tooltip content="Color" dismissOnMouseOut>
      <Button icon={TextMajor} onClick={togglePickColor} disclosure />
    </Tooltip>
  );

  const tabColors = [
    {
      id: "color",
      content: "Text",
      accessibilityLabel: "Text",
      panelID: "Text",
    },
    {
      id: "bgcolor",
      content: "Background",
      accessibilityLabel: "Background",
      panelID: "Background",
    },
  ];

  const handleChangeTab = useCallback((selectTabColorIndex) => {
    setTabColor(selectTabColorIndex);
  }, []);

  return (
    <div style={{ marginTop: "18px" }}>
      <div style={{ marginBottom: "4px" }}>
        <Text>Content</Text>
      </div>
      <LegacyCard>
        <LegacyCard>
          <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
            <ButtonGroup segmented>
              <div>
                <Popover
                  active={activeHeading}
                  activator={activatorHeading}
                  onClose={toggleHeading}
                >
                  <ActionList
                    actionRole="menuitem"
                    items={[
                      {
                        content: "Paragraph",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 1",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 2",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 3",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 4",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 5",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 6",
                        onAction: () => {
                          setActiveHeading(false);
                        },
                      },
                    ]}
                  />
                </Popover>
              </div>
              <Tooltip content="Bold" dismissOnMouseOut>
                <Button
                  icon={<FontAwesomeIcon icon={faBold} />}
                  onClick={() => handleTextDecoration("bold")}
                />
              </Tooltip>
              <Tooltip content="Italic" dismissOnMouseOut>
                <Button
                  icon={<FontAwesomeIcon icon={faItalic} />}
                  onClick={() => handleTextDecoration("italic")}
                />
              </Tooltip>
              <Tooltip content="Underline" dismissOnMouseOut>
                <Button
                  icon={<FontAwesomeIcon icon={faUnderline} />}
                  onClick={() => handleTextDecoration("underline")}
                />
              </Tooltip>
            </ButtonGroup>
            <ButtonGroup segmented>
              <Tooltip content="Bulleted List" dismissOnMouseOut>
                <Button icon={<FontAwesomeIcon icon={faListUl} />} />
              </Tooltip>
              <Tooltip content="Numbered List" dismissOnMouseOut>
                <Button icon={<FontAwesomeIcon icon={faListOl} />} />
              </Tooltip>
              <Tooltip content="Outdent" dismissOnMouseOut>
                <Button icon={<FontAwesomeIcon icon={faOutdent} />} />
              </Tooltip>
              <Tooltip content="Indent" dismissOnMouseOut>
                <Button icon={<FontAwesomeIcon icon={faIndent} />} />
              </Tooltip>
            </ButtonGroup>
            <ButtonGroup segmented>
              <div>
                <Popover
                  active={activeAlign}
                  activator={activatorAlign}
                  onClose={toggleAlign}
                >
                  <ActionList
                    actionRole="menuitem"
                    items={[
                      {
                        content: "Left align",
                      },
                      {
                        content: "Center align",
                      },
                      {
                        content: "Right align",
                      },
                    ]}
                  />
                </Popover>
              </div>
              <div>
                <Popover
                  active={activePickColor}
                  activator={activatorPickColor}
                  onClose={togglePickColor}
                >
                  <div
                    style={{
                      width: "220px",
                    }}
                  >
                    <Tabs
                      tabs={tabColors}
                      selected={tabColor}
                      onSelect={handleChangeTab}
                      fitted
                    ></Tabs>
                  </div>
                  <div style={{ padding: "10px" }}>
                    <ColorPicker
                      onChange={(value) => {
                        if (tabColor === 0) {
                          setColor(value);
                        } else {
                          setBgColor(value);
                        }
                      }}
                      color={tabColor === 0 ? color : bgColor}
                    />
                  </div>
                  <div style={{ width: "80%", padding: "0px 10px 20px 10px" }}>
                    <TextField
                      value={
                        tabColor === 0 ? hsbToHex(color) : hsbToHex(bgColor)
                      }
                      prefix={
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            background: `${
                              tabColor === 0
                                ? hsbToHex(color)
                                : hsbToHex(bgColor)
                            }`,
                            borderRadius: "10px",
                          }}
                        ></div>
                      }
                    />
                  </div>
                </Popover>
              </div>
            </ButtonGroup>
          </div>
          <LegacyCard.Subsection>
            <div
              ref={editorRef}
              contentEditable
              className="editor-container"
              spellCheck="false"
              onSelect={(e) => {
                handleContentChange(e);
              }}
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
