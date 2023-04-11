import {
  AlphaStack,
  Button,
  Divider,
  Layout,
  LegacyCard,
  SkeletonBodyText,
  SkeletonPage,
} from "@shopify/polaris";

function EditPageSkeleton() {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <SkeletonBodyText />
          </LegacyCard>
          <LegacyCard sectioned>
            <SkeletonBodyText />
          </LegacyCard>
          <LegacyCard sectioned>
            <SkeletonBodyText />
          </LegacyCard>
        </Layout.Section>
        <Layout.Section secondary>
          <LegacyCard sectioned>
            <AlphaStack gap="4">
              <SkeletonBodyText lines={2} />
              <Divider />
              <SkeletonBodyText lines={2} />
            </AlphaStack>
          </LegacyCard>
          <LegacyCard sectioned>
            <AlphaStack gap="4">
              <SkeletonBodyText lines={2} />
              <Divider />
              <SkeletonBodyText lines={2} />
            </AlphaStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "26px 0",
        }}
      >
        <Button disabled>Save</Button>
      </div>
    </SkeletonPage>
  );
}

export default EditPageSkeleton;
