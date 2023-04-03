import { LegacyCard, Tabs } from "@shopify/polaris";
import { useState, useCallback } from "react";
import FilterComponent from "./FilterComponent";

function TabsComponent() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "all-pages-1",
      content: "All",
      accessibilityLabel: "All Pages",
      panelID: "all-pages-content-1",
    },
  ];

  return (
    <LegacyCard>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <FilterComponent />
      </Tabs>
    </LegacyCard>
  );
}

export default TabsComponent;
