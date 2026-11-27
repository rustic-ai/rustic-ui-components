/* eslint-disable no-magic-numbers */
import Button from '@mui/material/Button'
import type { Meta } from '@storybook/react-webpack5'
import type { ComponentType } from 'react'
import React, { useState } from 'react'

import { participantDetail } from '../sharedDescription'
import { ParticipantRole, ParticipantType } from '../types'
import ParticipantsContainer, {
  type ParticipantsContainerProps,
} from './participantsContainer'

const meta: Meta<React.ComponentProps<typeof ParticipantsContainer>> = {
  title: 'Rustic UI/Participants Container/Participants Container',
  component: ParticipantsContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: ComponentType<{ args?: Record<string, unknown> }>) => {
      const [isModalOpen, setIsModalOpen] = useState(false)

      const openModal = () => setIsModalOpen(true)
      const closeModal = () => setIsModalOpen(false)

      return (
        <>
          <Story
            args={{
              isParticipantListOpen: isModalOpen,
              onClose: closeModal,
            }}
          />

          <Button variant="outlined" onClick={openModal}>
            Open Participants Container
          </Button>
        </>
      )
    },
  ],
}
export default meta

meta.argTypes = {
  participants: {
    table: {
      type: {
        summary: 'Array of Participant.',
        detail: participantDetail,
      },
    },
  },
}

function createRandomParticipants(numberOfParticipants: number) {
  const participants = []
  for (let i = 0; i < numberOfParticipants; i++) {
    participants.push({
      id: `${i}`,
      displayName: `someUser${i}`,
      icon: `https://api.dicebear.com/9.x/avataaars/svg?seed=someUser${i}`,
      participantRole: i === 1 ? ParticipantRole.Owner : ParticipantRole.Member,
      participantType:
        i % 2 === 0 ? ParticipantType.Agent : ParticipantType.Human,
    })
  }

  return participants
}

export const Default = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={createRandomParticipants(4)}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}

export const OneParticipant = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={[
        {
          id: '1',
          displayName: 'Lonely User',
          participantRole: ParticipantRole.Owner,
          participantType: ParticipantType.Human,
        },
      ]}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}

export const ManyParticipants = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={createRandomParticipants(104)}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}

export const NoParticipants = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={[]}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}
