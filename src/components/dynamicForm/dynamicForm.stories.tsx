import { optionalWsDescription } from '../sharedDescription'
import UniformsForm from './uniformsForm'

export default {
  title: 'Rustic UI/Dynamic Form/UniformsForm',
  component: UniformsForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    ws: optionalWsDescription,
  },
}

export const TextFields = {
  args: {
    title: 'Provide a delivery address',
    schema: {
      title: 'Address',
      type: 'object',
      properties: {
        city: { type: 'string' },
        state: { type: 'string' },
        street: { type: 'string' },
        zip: { type: 'string', pattern: '[0-9]{5}' },
      },
      required: ['street', 'zip', 'state'],
    },
    ws: {
      send: (msg: any) => {
        alert('Form submitted: ' + JSON.stringify(msg))
      },
    },
  },
}

export const Radio = {
  args: {
    title: 'Choose the days',
    schema: {
      title: 'Meeting Days',
      type: 'object',
      properties: {
        monday: { type: 'boolean' },
        tuesday: { type: 'boolean' },
        wednesday: { type: 'boolean' },
        thursday: { type: 'boolean' },
        friday: { type: 'boolean' },
        saturday: { type: 'boolean' },
        sunday: { type: 'boolean' },
      },
    },
    ws: {
      send: (msg: any) => {
        alert('Form submitted: ' + JSON.stringify(msg))
      },
    },
  },
}

export const ButtonGroup = {
  args: {
    title: 'What do you think?',
    description: 'Choose one of the options below.',
    schema: {
      type: 'object',
      properties: {
        opinion: {
          type: 'string',
          title: 'Your Opinion',
          uniforms: {
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'maybe', label: 'Maybe' },
              { value: 'no', label: 'No' },
            ],
            description: 'Please select one option',
          },
        },
      },
    },
    ws: {
      send: (msg: any) => {
        alert('Form submitted: ' + JSON.stringify(msg))
      },
    },
  },
}

export const ReadOnlyRadio = {
  args: {
    title: 'Choose the days',
    schema: {
      title: 'Meeting Days',
      type: 'object',
      properties: {
        monday: { type: 'boolean' },
        tuesday: { type: 'boolean' },
        wednesday: { type: 'boolean' },
        thursday: { type: 'boolean' },
        friday: { type: 'boolean' },
        saturday: { type: 'boolean' },
        sunday: { type: 'boolean' },
      },
    },
    data: {
      thursday: true,
    },
  },
}
