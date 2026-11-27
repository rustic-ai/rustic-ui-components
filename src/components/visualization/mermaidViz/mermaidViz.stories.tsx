import type { Meta } from '@storybook/react-webpack5'
import type { ComponentType } from 'react'
import React from 'react'

import MermaidViz from './mermaidViz'

const meta: Meta<React.ComponentProps<typeof MermaidViz>> = {
  title: 'Rustic UI/Visualization/MermaidViz',
  component: MermaidViz,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: ComponentType) => {
      return (
        <div
          style={{
            width: 'clamp(250px, 70vw, 800px)',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default meta
meta.argTypes = {
  ...meta.argTypes,
}

export const ClassDiagram = {
  args: {
    diagram: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }`,
  },
}

export const Flow = {
  args: {
    diagram: `
    flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]`,
  },
}

export const ERDiagram = {
  args: {
    title: 'Customer Order Management System ER Diagram',
    description:
      'This ER diagram illustrates the relationships in an ordering system where a customer has a delivery address, places orders, and is liable for invoices; delivery addresses receive orders, invoices cover orders, orders include order items, product categories contain products, and products are ordered in order items.',
    diagram: `
      erDiagram
    CUSTOMER }|..|{ DELIVERY-ADDRESS : has
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ INVOICE : "liable for"
    DELIVERY-ADDRESS ||--o{ ORDER : receives
    INVOICE ||--|{ ORDER : covers
    ORDER ||--|{ ORDER-ITEM : includes
    PRODUCT-CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ ORDER-ITEM : "ordered in"`,
  },
}

export const Error = {
  args: {
    diagram: '',
  },
}
