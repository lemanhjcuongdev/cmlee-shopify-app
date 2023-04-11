import React from "react";
import { Button, Tag, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";

function TextFilter({ tagname, togglePopoverSaveActive, handleClearAll }) {
  const [textFieldValue, setTextFieldValue] = useState("");

  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    []
  );
  return (
    <>
      {tagname && (
        <div style={{ marginBottom: "10px" }}>
          <Tag>
            Visibility is{" "}
            {tagname.toString() === "published" ? "Visible" : "Hidden"}
          </Tag>
        </div>
      )}
      <TextField
        label="Save as"
        type="email"
        value={textFieldValue}
        onChange={handleTextFieldChange}
        placeholder="Ready to publish, work in progress"
        helpText="Filters are saved as a new tab at the top of this list."
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        <Button
          onClick={() => {
            togglePopoverSaveActive();
            handleClearAll();
          }}
        >
          Cancel
        </Button>
        <Button
          primary
          disabled={textFieldValue.trim() !== "" ? false : true}
          onClick={() => {
            togglePopoverSaveActive();
            handleClearAll();
          }}
        >
          Save filters
        </Button>
      </div>
    </>
  );
}

export default TextFilter;
