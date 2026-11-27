import './participantsContainer.css'
import '../../index.css'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import pluralize from 'pluralize'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { capitalizeFirstLetter } from '../helper'
import Icon from '../icon/icon'
import { type Participant, ParticipantRole, ParticipantType } from '../types'

export interface ParticipantsContainerProps {
  participants: Participant[]
  /** Boolean that dictates the open/closed state of the participants modal. */
  isParticipantListOpen: boolean
  /** Callback function to close the participants modal. */
  onClose: () => void
}

function ParticipantList(props: {
  participantType: string
  participantTypeIcon: ReactNode
  participants: Participant[]
}) {
  const [areAllParticipantsDisplayed, setAreAllParticipantsDisplayed] =
    useState(false)

  const numberOfParticipants = props.participants.length
  const numOfInitialDisplayedParticipants = 3

  const displayedParticipants = areAllParticipantsDisplayed
    ? props.participants
    : props.participants.slice(0, numOfInitialDisplayedParticipants)

  const formattedSubheader = `${pluralize(
    props.participantType,
    numberOfParticipants
  )} (${numberOfParticipants})`

  const buttonLabel = areAllParticipantsDisplayed
    ? 'Show Less'
    : `Show All ${numberOfParticipants}`

  if (numberOfParticipants === 0) {
    return (
      <Typography
        variant="caption"
        className="rustic-participant-list-no-participants-message"
      >
        There are currently no participants.
      </Typography>
    )
  } else {
    return (
      <List
        data-cy="participant-list"
        className="rustic-participant-list"
        subheader={
          <ListSubheader
            disableSticky
            className="rustic-participant-list-subheader"
          >
            <Box className="rustic-participant-list-subheader-title">
              {props.participantTypeIcon}
              <Typography variant="subtitle2" color="text.secondary">
                {formattedSubheader}
              </Typography>
            </Box>
            {numberOfParticipants > numOfInitialDisplayedParticipants && (
              <Button
                data-cy="toggle-participant-list-button"
                onClick={() =>
                  setAreAllParticipantsDisplayed(!areAllParticipantsDisplayed)
                }
                color="primary"
                size="small"
                startIcon={<Icon name="keyboard_arrow_down" />}
              >
                {buttonLabel}
              </Button>
            )}
          </ListSubheader>
        }
      >
        {displayedParticipants.map((participant: Participant) => {
          return (
            <ListItem
              key={participant.id}
              className="rustic-participant-list-item"
              data-cy="participant-list-item"
            >
              <Box className="rustic-participant-profile">
                <Avatar
                  src={participant.icon}
                  className="rustic-participant-avatar"
                />
                <Typography variant="subtitle2">
                  {participant.displayName}
                </Typography>
              </Box>

              <Typography
                variant={
                  participant.participantRole === ParticipantRole.Owner
                    ? 'subtitle2'
                    : 'caption'
                }
                data-cy="participant-role"
              >
                {capitalizeFirstLetter(
                  participant.participantRole || ParticipantRole.Member
                )}
              </Typography>
            </ListItem>
          )
        })}
      </List>
    )
  }
}

/** The `ParticipantsContainer` component is responsible for displaying a list of participants within a dialog window. It organizes participants into separate lists based on their type (human or agent) and provides options to toggle between showing a subset of participants and displaying the full list. This component enhances the user experience by presenting participant information in a structured format and allowing users to view additional details as needed.
 *
 * Note: The component does not include the button displayed to toggle between the two views. This button is typically implemented in the parent component that uses the `ParticipantsContainer` component. */
function ParticipantsContainer(props: ParticipantsContainerProps) {
  function sortParticipantsByRole(participants: Participant[]): Participant[] {
    const participantsCopy = [...participants]
    return participantsCopy.sort((a, b) =>
      b.participantRole === ParticipantRole.Owner ? 1 : -1
    )
  }

  function getSortedParticipantsByType(
    participants: Participant[],
    type: string
  ): Participant[] {
    const participantsByType = participants.filter(
      (participant) => participant.participantType === type
    )
    const sortedParticipants = sortParticipantsByRole(participantsByType)

    return sortedParticipants
  }

  const sortedHumanParticipants = getSortedParticipantsByType(
    props.participants,
    ParticipantType.Human
  )
  const sortedAgentParticipants = getSortedParticipantsByType(
    props.participants,
    ParticipantType.Agent
  )

  const formattedTitle = `${pluralize(
    'Participant',
    props.participants.length
  )} (${props.participants.length})`

  return (
    <Dialog
      open={props.isParticipantListOpen}
      onClose={props.onClose}
      className="rustic-participants-container"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        component="h6"
        className="rustic-participants-container-title"
        data-cy="participants-dialog-title"
      >
        {formattedTitle}
      </DialogTitle>

      <ParticipantList
        participantType="Human"
        participantTypeIcon={<Icon name="account_circle" />}
        participants={sortedHumanParticipants}
      />

      {sortedAgentParticipants.length > 0 && (
        <>
          <Divider className="rustic-participants-container-divider" />

          <ParticipantList
            participantType="Agent"
            participantTypeIcon={<Icon name="smart_toy" />}
            participants={sortedAgentParticipants}
          />
        </>
      )}
    </Dialog>
  )
}

export default ParticipantsContainer
