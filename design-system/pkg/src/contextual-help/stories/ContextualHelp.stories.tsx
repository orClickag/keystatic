import { StoryObj } from '@orclickag/keystatic-ui-storybook';
import { Content, Footer } from '@orclickag/keystatic-ui/slots';
import { TextLink } from '@orclickag/keystatic-ui/link';
import { Heading, Text } from '@orclickag/keystatic-ui/typography';

import { ContextualHelp } from '../index';

type ContextualHelpStory = StoryObj<typeof ContextualHelp>;

export default {
  title: 'Components/ContextualHelp',
  component: ContextualHelp as any,
  argTypes: {
    onOpenChange: {
      action: 'openChange',
      table: { disable: true },
    },
    placement: {
      control: 'select',
      defaultValue: 'bottom',
      options: [
        'bottom',
        'bottom left',
        'bottom right',
        'bottom start',
        'bottom end',
        'top',
        'top left',
        'top right',
        'top start',
        'top end',
        'left',
        'left top',
        'left bottom',
        'start',
        'start top',
        'start bottom',
        'right',
        'right top',
        'right bottom',
        'end',
        'end top',
        'end bottom',
      ],
    },
    variant: {
      control: 'select',
      defaultValue: 'help',
      options: ['help', 'info'],
    },
    offset: {
      control: 'number',
      min: -500,
      max: 500,
    },
    crossOffset: {
      control: 'number',
      min: -500,
      max: 500,
    },
    containerPadding: {
      control: 'number',
      min: -500,
      max: 500,
    },
    shouldFlip: {
      control: 'boolean',
    },
    children: {
      table: { disable: true },
    },
  },
};

const helpText = () => (
  <Text>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet
    tristique risus. In sit amet suscipit lorem.
  </Text>
);

export const Default: ContextualHelpStory = {
  args: {
    children: (
      <>
        <Heading>Help title</Heading>
        <Content>{helpText()}</Content>
      </>
    ),
  },
  name: 'default',
};

export const WithLink: ContextualHelpStory = {
  args: {
    children: (
      <>
        <Heading>Help title</Heading>
        <Content>{helpText()}</Content>
        <Footer>
          <TextLink prominence="high">Learn more</TextLink>
        </Footer>
      </>
    ),
  },
  name: 'with link',
};
