import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import { useParams } from "react-router-dom";
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
  Badge,
} from "@shopify/polaris";
import { ViewMajor, DuplicateMinor } from "@shopify/polaris-icons";
import { useCallback, useRef, useState } from "react";

import { useAppQuery } from "../hooks";

import ContentEditor from "../components/ContentEditor/ContentEditor";
import SearchEngine from "../components/SearchEngine";
import ModalComponent from "../components/ModalComponent";
import VisibilityDatePicker from "../components/VisibilityDatePicker";
import VisibilityTimePicker from "../components/VisibilityTimePicker";
import ToastMessage from "../components/ToastMessage";

function AddPage() {
  const fetch = useAuthenticatedFetch();

  const { id } = useParams();
  const navigate = useNavigate();

  const [initData, setInitData] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("default");
  const [visibleStatus, setVisibleStatus] = useState(["Visible"]);
  const [initVisible, setInitVisible] = useState([]);
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

  const editorRef = useRef();

  //GET PAGE DATA
  const { refetch, data } = useAppQuery({
    url: `/api/pages?id=${id}`,
    reactQueryOptions: {
      onSuccess: (page) => {
        console.log(page);
        setInitData(page);
        setTitle(page.title);
        setContent(page.body_html);
        setVisibleStatus(page.published_at ? ["Visible"] : ["Hidden"]);
        setInitVisible(page.published_at ? ["Visible"] : ["Hidden"]);
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
      },
    },
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

  const handleVisibleChange = useCallback((value) => {
    setVisibleStatus(value);
    if (value.toString() === "Visible") {
      setIsSetDate(false);
    }
  }, []);

  const handleUpdatePage = () => {
    setLoading(true);
    const updatingPage = {
      title: title,
      body_html: editorRef.current.innerHTML,
      published: visibleStatus?.toString() !== "Visible" ? null : true,
    };

    console.log(updatingPage);
    fetch(`/api/pages?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatingPage),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        refetch();
        setToast({
          ...toast,
          isOpen: true,
          message: "Page was saved",
        });

        // navigate(`/${data.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeletePage = async () => {
    const res = await fetch(`/api/pages?id=${id}`, {
      method: "DELETE",
    });
    setLoading(true);
    if (res.status === 200) {
      setConfirmModal({
        ...confirmModal,
        isOpen: false,
      });
      setToast({
        ...toast,
        isOpen: true,
        message: "Deleted 1 page",
      });
      navigate("/");
    } else console.log("Can't delete!");
  };

  return (
    <Page
      backAction={{
        onAction: () => {
          if (
            title.trim() !== initData.title ||
            editorRef.current.innerHTML !== initData.body_html
          ) {
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
      title={data && data.title}
      titleMetadata={data && data.published_at ? null : <Badge>Hidden</Badge>}
      secondaryActions={[
        {
          content: "Duplicate",
          icon: DuplicateMinor,
        },
        {
          content: "Preview page",
          icon: ViewMajor,
          onAction: () =>
            navigate(
              `https://lemanhcuong.myshopify.com/pages/${initData.handle}`
            ),
        },
      ]}
      pagination={[
        {
          hasPrevious: true,
          hasNext: true,
        },
      ]}
    >
      {isError && (
        <div style={{ marginBottom: "16px" }}>
          <Banner title="There is 1 error:" status="critical">
            <li>Title can't be blank</li>
          </Banner>
        </div>
      )}

      <Form onSubmit={handleUpdatePage}>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextField
                value={title}
                onChange={handleTitleChange}
                label="Title"
                type="text"
                placeholder="e.g. Contact us, Sizing chart, FAQs"
                error={isError ? "Store name is required" : null}
              />

              <ContentEditor
                content={content}
                handleContentChange={handleContentChange}
                editorRef={editorRef}
              />
              {/* content editor */}
            </LegacyCard>

            <SearchEngine title={title} content={content} />
            {/* search engine */}
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
                onChange={handleVisibleChange}
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
              setConfirmModal({
                ...confirmModal,
                isOpen: true,
                title: `Delete `,
                subTitle: `Delete "${title}"? This
                  can't be undone.`,
                contentAction: "Delete",
                onConfirm: () => handleDeletePage(),
              });
            }}
            outline
            destructive
          >
            Delete page
          </Button>
          <Button
            primary
            onClick={handleUpdatePage}
            disabled={
              title.trim() !== initData?.title ||
              visibleStatus.toString() !== initVisible.toString()
                ? false
                : true
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
