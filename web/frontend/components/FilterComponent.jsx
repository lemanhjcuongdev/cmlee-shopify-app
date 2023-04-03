import {
  Button,
  ChoiceList,
  Filters,
  LegacyCard,
  Popover,
  ResourceItem,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { SortMinor } from "@shopify/polaris-icons";

function FilterComponent() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState("DATE_MODIFIED_DESC");
  const [visibility, setVisibility] = useState([]);
  const [queryValue, setQueryValue] = useState(undefined);
  const [popoverActive, setPopoverActive] = useState(false);
  const [sortList, setSortList] = useState(null);

  const handleVisibilityChange = useCallback(
    (value) => setVisibility(value),
    []
  );
  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleVisibilityRemove = useCallback(
    () => setVisibility(undefined),
    []
  );
  const handleQueryValueRemove = useCallback(
    () => setQueryValue(undefined),
    []
  );
  const handleClearAll = useCallback(() => {
    handleVisibilityRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleVisibilityRemove]);

  const resourceName = {
    singular: "Page",
    plural: "Pages",
  };

  const items = [
    {
      id: "1",
      url: "#",
      name: "Contact us",
      latestOrderUrl: "orders/1456",
    },
    {
      id: "2",
      url: "#",
      name: "Contact",
      latestOrderUrl: "orders/1457",
    },
  ];

  const promotedBulkActions = [
    {
      content: "Edit Pages",
      onAction: () => console.log("Todo: implement bulk edit"),
    },
  ];

  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      content: "Delete customers",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

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
            { label: "Visible", value: "Visible" },
            {
              label: "Hidden",
              value: "Hidden",
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

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <Button onClick={togglePopoverActive} icon={SortMinor}>
      Sort
    </Button>
  );

  const handleSortChange = useCallback((value) => {
    setSortList(value);
  }, []);

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{ paddingLeft: "8px" }}>
        <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
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
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        // loading
        // sortOptions={[
        //   { label: "Newest update", value: "DATE_MODIFIED_DESC" },
        //   { label: "Oldest update", value: "DATE_MODIFIED_ASC" },
        // ]}
        // onSortChange={(selected) => {
        //   setSortValue(selected);
        //   console.log(`Sort option changed to ${selected}.`);
        // }}
        filterControl={filterControl}
      />
    </LegacyCard>
  );

  function renderItem(item) {
    const { id, url, name, location, latestOrderUrl } = item;
    // const media = <Avatar customer size="medium" name={name} />;
    // const shortcutActions = latestOrderUrl
    //   ? [{ content: "View latest order", url: latestOrderUrl }]
    //   : undefined;
    return (
      <ResourceItem
        id={id}
        url={url}
        // media={media}
        accessibilityLabel={`View details for ${name}`}
        // shortcutActions={shortcutActions}
        persistActions
      >
        <Text variant="bodyMd" fontWeight="medium" as="h3">
          {name}
        </Text>
        <div>{location}</div>
      </ResourceItem>
    );
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case "visibility1":
        return `Visibility is ${value}`;
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
}

export default FilterComponent;
