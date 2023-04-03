import { useNavigate } from "@shopify/app-bridge-react";
import { AlphaStack, Banner, Page } from "@shopify/polaris";
import { LockMinor } from "@shopify/polaris-icons";
import TabsComponent from "../components/Tabs";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Page
      title="Page"
      primaryAction={{
        content: "Add page",
        onAction: () => navigate("/AddPage"),
      }}
      fullWidth
    >
      <AlphaStack gap="5">
        <Banner
          title="Store access is restricted"
          action={{ content: "See store password" }}
          icon={LockMinor}
          status="warning"
        >
          <p>
            While your online store is in development, only visitors with the
            password can access it.
          </p>
        </Banner>
        <TabsComponent></TabsComponent>
      </AlphaStack>
    </Page>
  );
}
