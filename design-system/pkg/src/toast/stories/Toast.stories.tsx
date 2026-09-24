import { useLandmark } from 'react-aria/useLandmark';
import React, { useRef, useState } from 'react';

import { ActionButton } from '@orclickag/keystatic-ui/button';
import { Dialog, DialogTrigger } from '@orclickag/keystatic-ui/dialog';
import { Icon } from '@orclickag/keystatic-ui/icon';
import { checkCircle2Icon } from '@orclickag/keystatic-ui/icon/icons/checkCircle2Icon';
import { infoIcon } from '@orclickag/keystatic-ui/icon/icons/infoIcon';
import { alertTriangleIcon } from '@orclickag/keystatic-ui/icon/icons/alertTriangleIcon';
import { Box, Flex } from '@orclickag/keystatic-ui/layout';
import { Content } from '@orclickag/keystatic-ui/slots';
import { ArgTypes, Meta, action } from '@orclickag/keystatic-ui-storybook';
import { Heading, Text } from '@orclickag/keystatic-ui/typography';

import { Toaster, ToastOptions, toastQueue } from '..';

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [
    story => (
      <>
        <Toaster
        // position="top"
        // placement="start"
        />
        <MainLandmark>{story()}</MainLandmark>
      </>
    ),
  ],
  args: {
    shouldCloseOnAction: false,
    timeout: null,
  },
  argTypes: {
    timeout: {
      control: 'radio',
      options: [null, 5000],
    },
  },
};
export default meta;

export const Default = (args: ArgTypes) => <Example {...args} />;

export const Actions = (args: ArgTypes) => (
  <Example {...args} actionLabel="Action" onAction={action('onAction')} />
);

export const WithinDialog = (args: ArgTypes) => (
  <DialogTrigger isDismissable>
    <ActionButton>Open dialog</ActionButton>
    <Dialog>
      <Heading>Toasty</Heading>
      <Content>
        <Example {...args} />
      </Content>
    </Dialog>
  </DialogTrigger>
);

WithinDialog.story = {
  name: 'Within dialog',
};

export const ProgrammaticClosing = (args: ArgTypes) => (
  <ToastToggle {...args} />
);

ProgrammaticClosing.story = {
  name: 'Programmatic closing',
};

function Example(options: ToastOptions) {
  return (
    <Flex gap="regular">
      <ActionButton
        onPress={() =>
          toastQueue.neutral('3 items archived', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Text>Neutral</Text>
      </ActionButton>
      <ActionButton
        onPress={() =>
          toastQueue.info('A new version is available', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Icon src={infoIcon} color="accent" />
        <Text>Info</Text>
      </ActionButton>
      <ActionButton
        onPress={() =>
          toastQueue.positive('File uploaded', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Icon src={checkCircle2Icon} color="positive" />
        <Text>Positive</Text>
      </ActionButton>
      <ActionButton
        onPress={() =>
          toastQueue.critical('Unable to delete entry', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Icon src={alertTriangleIcon} color="critical" />
        <Text>Critical</Text>
      </ActionButton>
    </Flex>
  );
}

function ToastToggle(options: ToastOptions) {
  let [close, setClose] = useState<(() => void) | null>(null);

  return (
    <ActionButton
      onPress={() => {
        if (!close) {
          let close = toastQueue.critical('Unable to delete entry', {
            ...options,
            onClose: () => setClose(null),
          });
          setClose(() => close);
        } else {
          close();
        }
      }}
    >
      {close ? 'Hide' : 'Show'} toast
    </ActionButton>
  );
}

function MainLandmark(props: any) {
  let ref = useRef<HTMLElement>(null);
  let { landmarkProps } = useLandmark({ ...props, role: 'main' }, ref);
  return (
    <Box
      elementType="main"
      aria-label="Main landmark"
      ref={ref}
      padding="large"
      backgroundColor="surface"
      {...props}
      {...landmarkProps}
    >
      {props.children}
    </Box>
  );
}
