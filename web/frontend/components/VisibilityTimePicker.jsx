import { AlphaStack, Box, Button, OptionList, Popover } from "@shopify/polaris";
import { useState } from "react";
import { ClockMinor } from "@shopify/polaris-icons";

import { timeline } from "../constants/timeline";

function VisibilityTimePicker() {
  const [selected, setSelected] = useState(timeline[0]);
  const [popoverActive, setPopoverActive] = useState(false);

  return (
    <AlphaStack gap="4">
      <Box padding={{ xs: 1 }}>
        <Popover
          autofocusTarget="none"
          preferredAlignment="left"
          fullWidth
          preferInputActivator={false}
          preferredPosition="below"
          preventCloseOnChildOverlayClick
          active={popoverActive}
          activator={
            <Button
              fullWidth
              textAlign="start"
              onClick={() => setPopoverActive(!popoverActive)}
              icon={ClockMinor}
            >
              {selected.title}
            </Button>
          }
        >
          <OptionList
            options={timeline.map((timeStamp) => ({
              value: timeStamp.value,
              label: timeStamp.title,
            }))}
            selected={selected.value}
            onChange={(value) => {
              setSelected(
                timeline.find((item) => item.value === value.toString())
              );
              setPopoverActive(false);
            }}
          />
        </Popover>
      </Box>
    </AlphaStack>
  );
}

export default VisibilityTimePicker;
