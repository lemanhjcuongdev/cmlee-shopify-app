import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  ButtonGroup,
  ChoiceList,
  Divider,
  Form,
  Layout,
  LegacyCard,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useRef, useState } from "react";

import ContentEditor from "../components/ContentEditor/ContentEditor";
import SearchEngine from "../components/SearchEngine";
import ModalComponent from "../components/ModalComponent";
import VisibilityDatePicker from "../components/VisibilityDatePicker";
import VisibilityTimePicker from "../components/VisibilityTimePicker";
import ToastMessage from "../components/ToastMessage";

function AddPage() {
  const fetch = useAuthenticatedFetch();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("default");
  const editorRef = useRef(null);

  const [visibleStatus, setVisibleStatus] = useState(["Visible"]);
  const [isSetDate, setIsSetDate] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    contentAction: "",
  });
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
  });

  const options = [
    { label: "Default", value: "default" },
    { label: "contact", value: "contact" },
  ];
  const handleThemeChange = useCallback((value) => setTheme(value), []);

  const handleTitleChange = useCallback((value) => {
    setTitle(value);
    setIsError(false);
  }, []);
  const handleContentChange = useCallback((e) => {
    setContent(e.target.innerHTML);
  }, []);

  const handleChange = useCallback((value) => {
    setVisibleStatus(value);
    if (value.toString() === "Visible") {
      setIsSetDate(false);
    }
  }, []);

  const handleCreatePage = () => {
    if (title.trim() === "") {
      setIsError(true);
    } else {
      setLoading(true);
      const newPage = {
        title: title,
        body_html: editorRef.current.innerHTML,
        published: visibleStatus?.toString() !== "Visible" ? null : true,
      };

      console.log(newPage);
      fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: newPage,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setLoading(false);
          setToast({
            ...toast,
            isOpen: true,
            message: "Page was created",
          });

          navigate(`/${data.id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Page
      backAction={{
        onAction: () => {
          if (title.trim() !== "" || content.trim() !== "") {
            setConfirmModal({
              ...confirmModal,
              isOpen: true,
              title: "You have unsaved changes",
              subTitle:
                "If you leave this page, all unsaved changes will be lost.",
              contentAction: "Leave page",
              onConfirm: () => navigate("/"),
            });
          } else {
            navigate("/");
          }
        },
      }}
      title="Add page"
    >
      {isError && (
        <div style={{ marginBottom: "16px" }}>
          <Banner title="There is 1 error:" status="critical">
            <li>Title can't be blank</li>
          </Banner>
        </div>
      )}

      <Form onSubmit={handleCreatePage}>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextField
                value={title}
                onChange={handleTitleChange}
                label="Title"
                type="text"
                placeholder="e.g. Contact us, Sizing chart, FAQs"
                error={isError ? "Title can't be blank" : null}
              />
              <ContentEditor
                content={content}
                handleContentChange={handleContentChange}
                editorRef={editorRef}
              />
            </LegacyCard>
            <SearchEngine title={title} content={content} />
          </Layout.Section>

          <Layout.Section secondary>
            <LegacyCard title="Visibility" sectioned>
              <ChoiceList
                choices={[
                  {
                    label:
                      visibleStatus?.toString() === `Visible`
                        ? `Visible (as of ${new Date().toLocaleDateString()}, ${new Date()
                            .toLocaleTimeString()
                            .slice(0, 5)} ${new Date()
                            .toLocaleTimeString()
                            .slice(-2)} GMT+7)`
                        : `Visible`,
                    value: "Visible",
                  },
                  { label: "Hidden", value: "Hidden" },
                ]}
                selected={visibleStatus}
                onChange={handleChange}
              />
              {isSetDate ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    margin: "16px 0px",
                  }}
                >
                  <VisibilityDatePicker />
                  <VisibilityTimePicker />
                </div>
              ) : null}
              <div style={{ marginTop: "16px" }}>
                <Button
                  plain
                  onClick={() => {
                    setIsSetDate(!isSetDate);
                    setVisibleStatus(["Hidden"]);
                  }}
                >
                  {isSetDate ? "Clear date..." : "Set visibility date"}
                </Button>
              </div>
            </LegacyCard>

            <LegacyCard title="Online store" sectioned>
              <Select
                label="Theme template"
                options={options}
                onChange={handleThemeChange}
                value={theme}
              />
              <div style={{ marginTop: "16px" }}>
                <Text>
                  Assign a template from your current theme to define how the
                  page is displayed.
                </Text>
              </div>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Form>

      <div style={{ margin: "20px 0px" }}>
        <Divider borderStyle="divider" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "26px",
        }}
      >
        <ButtonGroup>
          <Button
            onClick={() => {
              if (title.trim() !== "" || content.trim() !== "") {
                setConfirmModal({
                  ...confirmModal,
                  isOpen: true,
                  title: "You have unsaved changes",
                  subTitle:
                    "If you leave this page, all unsaved changes will be lost.",
                  contentAction: "Leave page",
                  onConfirm: () => navigate("/"),
                });
              } else {
                navigate("/");
              }
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            onClick={handleCreatePage}
            disabled={
              title.trim() !== "" || content.trim() !== "" ? false : true
            }
            loading={loading}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
      {confirmModal.isOpen && (
        <ModalComponent
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
        />
      )}
      {toast.isOpen && <ToastMessage toast={toast} setToast={setToast} />}
    </Page>
  );
}

export default AddPage;
