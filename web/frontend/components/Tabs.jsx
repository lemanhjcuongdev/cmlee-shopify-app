import {
  Button,
  ChoiceList,
  Filters,
  LegacyCard,
  Popover,
  ResourceItem,
  ResourceList,
  Spinner,
  Tabs,
  Text,
} from "@shopify/polaris";
import {
  SortMinor,
  StarFilledMinor,
  StarOutlineMinor,
} from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import EmptyStateComponent from "./EmptyState";
import PageItem from "./PageItem";
import sortPages from "../utils/sortPages";
import ModalComponent from "./ModalComponent";
import ToastMessage from "./ToastMessage";
import TextFilter from "./TextFilter";

function TabsComponent() {
  const fetch = useAuthenticatedFetch();
  const [isLoading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [isEmptyData, setIsEmptyData] = useState(true);
  const [pageData, setPageData] = useState(undefined);
  const [selectedPages, setSelectedPages] = useState([]);
  const [isFocused, setFocused] = useState(false);
  const [visibility, setVisibility] = useState(null);
  const [popoverSortActive, setPopoverSortActive] = useState(false);
  const [popoverSaveActive, setPopoverSaveActive] = useState(false);
  const [sortList, setSortList] = useState(["newest"]);
  const [tabList, setTabList] = useState([
    {
      id: "all-pages-1",
      content: "All",
      accessibilityLabel: "All Pages",
      panelID: "all-pages-content-1",
    },
  ]);
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

  //fetch API
  const { refetch } = useAppQuery({
    url: `/api/pages?published_status=${visibility}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        setLoading(false);

        if (data.length === 0) {
          setIsEmptyData(true);
        } else {
          setIsEmptyData(false);
        }

        //filter by page title
        let remainingData;
        if (queryValue !== "") {
          remainingData = data.filter((page) =>
            page.title.toLowerCase().includes(queryValue.toLowerCase())
          );
        } else remainingData = [...data];

        sortPages(remainingData, sortList.toString());

        setPageData(remainingData);
      },
      onError: (err) => {
        console.log(err);
      },
    },
  });

  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      if (selectedTabIndex === 0 && selectedTabIndex != selected) {
        refetch();
        setQueryValue("");
        const newTabs = [...tabList];
        newTabs.splice(1, 1);
        setTabList(newTabs);
        setSelected(selectedTabIndex);
        handleVisibilityRemove();
        setFocused(false);
      }
    },
    [selected]
  );

  const handleVisibilityChange = useCallback((value) => {
    setLoading(true);
    setVisibility(value);
    const newTab = {
      id: "all-pages-2",
      content: "Custom search",
      accessibilityLabel: "Custom search",
      panelID: "all-pages-2",
    };
    const newTabs = [...tabList, newTab];
    setTabList(newTabs);
    setSelected(1);
  }, []);

  const handleQueryValueChange = useCallback(
    (value) => {
      setLoading(true);
      refetch();
      setQueryValue(value);
      if (tabList.length === 1) {
        const searchTab = {
          id: "all-pages-2",
          content: "Custom Search",
          accessibilityLabel: "Custom Search",
          panelID: "all-pages-content-2",
        };
        const newTabList = [...tabList, searchTab];
        setTabList(newTabList);
        setSelected(1);
        setFocused(true);
      }
      if (value.trim() === "") {
        const newTabList = [...tabList];
        newTabList.splice(1, 1);
        setTabList(newTabList);
        setSelected(0);
        setFocused(true);
      }
    },
    [queryValue]
  );

  const handleVisibilityRemove = useCallback(() => {
    setLoading(true);
    setVisibility(null);
    const newTabs = [...tabList];
    if (newTabs.length !== 1) {
      newTabs.splice(1, 1);
      setTabList(newTabs);
      setSelected(0);
    }
  }, [tabList]);

  const handleQueryValueRemove = useCallback(() => {
    refetch();
    setLoading(true);
    setQueryValue("");
    const newTabs = [...tabList];
    if (newTabs.length !== 1) {
      newTabs.splice(1, 1);
      setTabList(newTabs);
      setSelected(0);
    }
  }, [tabList]);

  const handleClearAll = useCallback(() => {
    handleVisibilityRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleVisibilityRemove]);

  const resourceName = {
    singular: "Page",
    plural: "Pages",
  };

  const promotedBulkActions = [
    {
      content: "Make selected pages visible",
      onAction: () => {
        handleHidePages(true);
      },
    },
    {
      content: "Hide selected pages",
      onAction: () => {
        handleHidePages(false);
      },
    },
    {
      content: <Text color="critical">Delete pages</Text>,
      onAction: () => {
        const pageCount = selectedPages.length;

        setConfirmModal({
          ...confirmModal,
          isOpen: true,
          title: `Delete ${pageCount} ${pageCount === 1 ? "page" : "pages"}`,
          subTitle:
            "Deleted pages cannot be recovered. Do you still want to continue?",
          contentAction: "Delete page",
          onConfirm: () => handleDeletePages(),
        });
      },
    },
  ];

  const handleDeletePages = async () => {
    const res = await fetch(`/api/pages?id=${selectedPages.toString()}`, {
      method: "DELETE",
    });
    setLoading(true);
    if (res.status === 200) {
      refetch();
      setConfirmModal({
        ...confirmModal,
        isOpen: false,
      });
      setSelectedPages([]);
    } else console.log("Can't delete!");
  };

  const handleHidePages = async (published) => {
    setLoading(true);
    const res = await fetch(`/api/pages?id=${selectedPages.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ published: published }),
    });

    if (res.status === 200) {
      refetch();
      setToast({
        isOpen: true,
        message: ` ${published ? "Visible" : "Hidden"} ${
          selectedPages.length
        } ${selectedPages.length === 1 ? "page" : "pages"}`,
      });
      setSelectedPages([]);
    } else console.log("Can't hide/show pages!");
  };

  //filter button
  const filters = [
    {
      key: "visibility1",
      label: "Visibility",
      filter: (
        <ChoiceList
          title="Visibility"
          onChange={handleVisibilityChange}
          autoComplete="off"
          titleHidden
          selected={visibility || []}
          choices={[
            { label: "Visible", value: "published" },
            {
              label: "Hidden",
              value: "unpublished",
            },
          ]}
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters =
    visibility && !isEmpty(visibility)
      ? [
          {
            key: "visibility1",
            label: disambiguateLabel("visibility1", visibility),
            onRemove: handleVisibilityRemove,
          },
        ]
      : [];

  //toggle open or close popover
  const togglePopoverSortActive = useCallback(
    () => setPopoverSortActive((popoverSortActive) => !popoverSortActive),
    []
  );
  const togglePopoverSaveActive = useCallback(
    () => setPopoverSaveActive((popoverSaveActive) => !popoverSaveActive),
    []
  );

  //functional buttons
  const sortBtn = (
    <Button onClick={togglePopoverSortActive} icon={SortMinor}>
      Sort
    </Button>
  );
  const saveBtn = (
    <Button
      disabled={visibility || queryValue !== "" ? false : true}
      icon={visibility ? StarOutlineMinor : StarFilledMinor}
      onClick={togglePopoverSaveActive}
    >
      {visibility || queryValue !== "" ? "Save Filter" : "Saved"}
    </Button>
  );

  const handleSortChange = useCallback((value) => {
    setLoading(true);
    setSortList(value);
    refetch();
  }, []);

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
      focused={isFocused}
    >
      <div style={{ paddingLeft: "8px", gap: "8px", display: "flex" }}>
        <Popover
          active={popoverSaveActive}
          activator={saveBtn}
          onClose={togglePopoverSaveActive}
        >
          <Popover.Pane>
            <div style={{ padding: "16px", width: "380px", height: "auto" }}>
              <TextFilter
                tagname={visibility}
                togglePopoverSaveActive={togglePopoverSaveActive}
              />
            </div>
          </Popover.Pane>
        </Popover>
        <Popover
          active={popoverSortActive}
          activator={sortBtn}
          autofocusTarget="first-node"
          onClose={togglePopoverSortActive}
        >
          <Popover.Pane>
            <div style={{ padding: "16px" }}>
              <ChoiceList
                title="Sort by"
                choices={[
                  { label: "Newest update", value: "newest" },
                  { label: "Oldest update", value: "oldest" },
                  { label: "Title A-Z", value: "az" },
                  { label: "Title Z-A", value: "za" },
                ]}
                selected={sortList || []}
                onChange={handleSortChange}
                hideClearButton
              />
            </div>
          </Popover.Pane>
        </Popover>
      </div>
    </Filters>
  );

  return (
    <LegacyCard>
      {pageData === undefined ? (
        <div
          style={{
            width: "100%",
            margin: "30px auto",
            textAlign: "center",
          }}
        >
          <Spinner size="large" />
        </div>
      ) : isEmptyData && !visibility ? (
        <EmptyStateComponent />
      ) : (
        <Tabs tabs={tabList} selected={selected} onSelect={handleTabChange}>
          <LegacyCard>
            <ResourceList
              resourceName={resourceName}
              items={pageData}
              renderItem={renderItem}
              selectedItems={selectedPages}
              onSelectionChange={setSelectedPages}
              bulkActions={promotedBulkActions}
              loading={isLoading}
              filterControl={filterControl}
            />
          </LegacyCard>
        </Tabs>
      )}
      {confirmModal.isOpen && (
        <ModalComponent
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
        />
      )}
      {toast.isOpen && <ToastMessage toast={toast} setToast={setToast} />}
    </LegacyCard>
  );
}

function renderItem(item) {
  const { id, title, created_at, body_html, published_at, handle } = item;
  const shortcutActions = handle
    ? [
        {
          content: "View Page",
          url: `https://lemanhcuong.myshopify.com/pages/${handle}`,
        },
      ]
    : null;
  return (
    <ResourceItem
      id={id}
      url={`/${id}`}
      accessibilityLabel={`View details for ${title}`}
      shortcutActions={shortcutActions}
    >
      <PageItem
        id={id}
        shortcutActions={shortcutActions}
        title={title}
        body_html={body_html}
        created_at={created_at}
        published_at={published_at}
        // visibility={visibility}
      />
    </ResourceItem>
  );
}

function disambiguateLabel(key, value) {
  switch (key) {
    case "visibility1":
      return `Visibility is ${
        value.toString() === "published" ? "Visible" : "Hidden"
      }`;
    default:
      return value;
  }
}

function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}

export default TabsComponent;
