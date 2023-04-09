import { LegacyCard, Text, TextField } from "@shopify/polaris";
import { useEffect, useState } from "react";

function SearchEngine({ title, content }) {
  const [editWithSeo, setEditWithSeo] = useState(false);
  const [titleSEO, setTitleSEO] = useState(title);
  const [titleDefault, setTitleDefault] = useState(title);
  const [description, setDescription] = useState(content);
  const [descriptionDefault, setDescriptionDefault] = useState(content);
  const [url, setUrl] = useState(titleSEO);

  useEffect(() => {
    setTitleSEO(title);
    setDescription(content);
  }, [title, content]);

  const handleTitleSEOChange = (value) => {
    setTitleSEO(value);
  };

  const handleDescriptionSEOChange = (value) => {
    setDescription(value);
  };

  return (
    <LegacyCard
      title="Search engine listing preview"
      actions={[
        {
          content: editWithSeo ? "" : "Edit website with SEO",
          onAction: () => setEditWithSeo(true),
        },
      ]}
    >
      <LegacyCard.Section>
        {title.trim() !== "" && content.trim() !== "" ? (
          <div>
            <p
              style={{
                fontSize: "18px",
                color: "#1a0dab",
              }}
            >
              {titleSEO}
            </p>
            <Text
              color="success"
              as="h6"
            >{`https://lemanhcuong.myshopify.com/pages/${url}`}</Text>
            <p style={{ fontSize: "13px" }}>{description}</p>
          </div>
        ) : (
          `Add ${
            titleSEO.trim() === "" ||
            title.trim() === "" ||
            description.trim() === "" ||
            content.trim() === ""
              ? "a"
              : ""
          } ${title.trim() === "" || titleSEO.trim() === "" ? "title" : ""} ${
            titleSEO.trim() === "" &&
            title.trim() === "" &&
            description.trim() === "" &&
            content.trim() === ""
              ? "and"
              : ""
          } ${
            content.trim() === "" || description.trim() === ""
              ? "description"
              : ""
          } to see how this Page might appear in a search engine listing`
        )}
      </LegacyCard.Section>
      {editWithSeo && (
        <LegacyCard.Section>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="Text Title"
              type="text"
              value={titleSEO}
              onChange={handleTitleSEOChange}
              helpText={`${titleSEO.length} of 70 characters used`}
              maxLength={70}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="Description"
              type="text"
              value={description}
              multiline={4}
              onChange={handleDescriptionSEOChange}
              helpText={`${description.length} of 320 characters used`}
              maxLength={320}
            />
          </div>
        </LegacyCard.Section>
      )}
    </LegacyCard>
  );
}

export default SearchEngine;
