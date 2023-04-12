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
    hue: 0,
    brightness: 0,
    saturation: 0,
  });
  const [bgColor, setBgColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0,
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
    const selection = window.getSelection();

    const newElement = document.createElement(command);
    newElement.innerHTML = selection.toString();

    newElement.style.fontSize = "initial";
    newElement.style.fontWeight = "initial";

    const range = selection.getRangeAt(0);
    console.log(range.commonAncestorContainer.parentNode.nodeName);
    if (range.commonAncestorContainer.parentNode.nodeName === "DIV") {
      range.deleteContents();
      range.insertNode(newElement);
    } else {
      range.commonAncestorContainer.parentNode.replaceWith(
        //replace parent node with new element
        newElement
      );
    }

    editorRef.current.focus();
  };

  const handleTextDecoration = (command) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection?.getRangeAt(0);
      if (range.commonAncestorContainer.nodeType === 3) {
        //if node type is text
        switch (command) {
          case "bold":
            {
              if (range.commonAncestorContainer.parentNode.nodeName === "B") {
                //if node name is b tag -> remove bold text
                range.commonAncestorContainer.parentNode.replaceWith(
                  //replace parent node with selected string
                  selection.toString()
                );
              } else {
                const boldElement = document.createElement("b");
                range.surroundContents(boldElement); //placing new node at start of range
              }
            }

            break;
          case "italic":
            {
              if (range.commonAncestorContainer.parentNode.nodeName === "I") {
                range.commonAncestorContainer.parentNode.replaceWith(
                  selection.toString()
                );
              } else {
                const italicElement = document.createElement("i");
                range.surroundContents(italicElement);
              }
            }

            break;
          case "underline":
            {
              if (range.commonAncestorContainer.parentNode.nodeName === "U") {
                range.commonAncestorContainer.parentNode.replaceWith(
                  selection.toString()
                );
              } else {
                const underlineElement = document.createElement("u");
                range.surroundContents(underlineElement);
              }
            }

            break;
        }
      }
    }

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
                          handleChangeHeadingType("p");
                        },
                      },
                      {
                        content: "Heading 1",
                        onAction: () => {
                          setActiveHeading(false);
                          handleChangeHeadingType("h1");
                        },
                      },
                      {
                        content: "Heading 2",
                        onAction: () => {
                          setActiveHeading(false);
                          handleChangeHeadingType("h2");
                        },
                      },
                      {
                        content: "Heading 3",
                        onAction: () => {
                          setActiveHeading(false);
                          handleChangeHeadingType("h3");
                        },
                      },
                      {
                        content: "Heading 4",
                        onAction: () => {
                          setActiveHeading(false);
                          handleChangeHeadingType("h4");
                        },
                      },
                      {
                        content: "Heading 5",
                        onAction: () => {
                          setActiveHeading(false);
                          handleChangeHeadingType("h5");
                        },
                      },
                      {
                        content: "Heading 6",
                        onAction: () => {
                          setActiveHeading(false);
                          handleChangeHeadingType("h6");
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
