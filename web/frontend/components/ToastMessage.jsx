import { Frame, Toast } from "@shopify/polaris";
import React from "react";

function ToastMessage({ toast, setToast }) {
  return (
    <div style={{ maxHeight: "1px", overflow: "hidden" }}>
      <Frame>
        <Toast
          content={toast.message}
          onDismiss={() => setToast({ ...toast, isOpen: false })}
        />
      </Frame>
    </div>
  );
}

export default ToastMessage;
