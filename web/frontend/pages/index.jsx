import { useNavigate } from "@shopify/app-bridge-react";
import { AlphaStack, Banner, Button, Link, Page, Text } from "@shopify/polaris";
import { LockMinor } from "@shopify/polaris-icons";
import TabsComponent from "../components/Tabs";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Page
      title="Page"
      primaryAction={{
        content: "Add page",
        onAction: () => navigate("/new"),
      }}
      fullWidth
    >
      <AlphaStack gap="5">
        <Banner
          title="Store access is restricted"
          action={{
            content: "See store password",
            url: "https://admin.shopify.com/store/lemanhcuong/online_store/preferences?tutorial=unlock",
          }}
          icon={LockMinor}
          status="warning"
        >
          <p>
            While your online store is in development, only visitors with the
            password can access it.
          </p>
        </Banner>
        <TabsComponent />
      </AlphaStack>
      <div
        style={{
          margin: "26px 0",
        }}
      >
        <Text alignment="center">
          Learn more about{" "}
          <Link url="https://help.shopify.com/en/manual/sell-online/online-store/pages?st_source=admin&st_campaign=pages_footer&utm_source=admin&utm_campaign=pages_footer">
            <Button plain> pages </Button>
          </Link>
        </Text>
      </div>
    </Page>
  );
}
