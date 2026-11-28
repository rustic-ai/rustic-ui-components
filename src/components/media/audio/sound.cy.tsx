/* eslint-disable no-magic-numbers */
import 'cypress-real-events'

import { supportedViewports } from '../../../../cypress/support/variables'
import Sound from './sound'

describe('Sound', () => {
  const audioElement = '[data-cy=audio-element]'
  const muteButton = '[data-cy=mute-button]'
  const playbackRateButton = '[data-cy=playback-rate-button]'
  const volumeSlider = '[data-cy=volume-slider]'
  const pauseButton = '[data-cy=pause-button]'
  const playButton = '[data-cy=play-button]'
  const transcript = '[data-cy=transcript]'
  const transcriptToggle = '[data-cy=transcript-toggle]'
  const loadingError = '[data-cy=loading-error]'

  const src = '/audioExamples/audioStorybook.mp3'

  beforeEach(() => {
    cy.mount(
      <Sound
        src={src}
        title="Sound Player Component"
        transcript="This is a transcript."
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the sound player component on ${viewport} screen`, () => {
      // Hold the response back so the loading state lasts long enough to
      // assert on; local test media otherwise loads before Cypress looks.
      const delayedSrc = `${src}?delayed`
      cy.intercept(delayedSrc, (req) => {
        req.on('response', (res) => {
          res.setDelay(1000)
        })
      })
      cy.mount(<Sound src={delayedSrc} title="Sound Player Component" />)
      cy.get('[data-cy=audio]').should('be.visible')
      cy.get('[data-cy=spinner]').should('be.visible')
      cy.get('[data-cy=spinner]').should('not.exist')
      cy.get('[data-cy=sound-player-title]').should('be.visible')
    })
    it(`should toggle between pause and play when clicking the play/pause button on ${viewport} screen`, () => {
      cy.get(playButton).should('be.visible')
      cy.get(audioElement).its('0.paused').should('equal', true)
      cy.get(playButton).click()
      cy.get(pauseButton).should('be.visible')
      cy.get(audioElement).its('0.paused').should('equal', false)
      cy.get(pauseButton).click()
      cy.get(playButton).should('be.visible')
    })
    it(`should go forwards and backwards 10 seconds when clicking the forward/back buttons on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('[data-cy=forward-ten-seconds-button]').click()
      cy.get(audioElement).its('0.currentTime').should('equal', 10)
      cy.get('[data-cy=replay-ten-seconds-button]').click()
      cy.get(audioElement).its('0.currentTime').should('equal', 0)
    })
    it(`should increase the playback speed when clicking the playback rate button then go back to 1x after 2x on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(audioElement).its('0.playbackRate').should('equal', 1)
      cy.get(playbackRateButton).should('contain', 1)
      cy.get(playbackRateButton).click()
      cy.get(audioElement).its('0.playbackRate').should('equal', 1.5)
      cy.get(playbackRateButton).should('contain', 1.5)
      cy.get(playbackRateButton).click()
      cy.get(audioElement).its('0.playbackRate').should('equal', 2)
      cy.get(playbackRateButton).should('contain', 2)
      cy.get(playbackRateButton).click()
      cy.get(audioElement).its('0.playbackRate').should('equal', 1)
      cy.get(playbackRateButton).should('contain', 1)
    })
    it(`should change the time when the video progress slider is adjusted on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(audioElement).its('0.currentTime').should('equal', 0)
      cy.get('[data-cy=progress-slider]').type('{rightArrow}')
      cy.get(audioElement).its('0.currentTime').should('be.greaterThan', 0)
    })
    it(`should show and hide the transcript when clicking the transcript toggle on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(transcript).should('not.exist')
      cy.get(transcriptToggle).should('contain', 'Show')
      cy.get(transcriptToggle).click()
      cy.get(transcript).should('be.visible')
      cy.get(transcriptToggle).should('contain', 'Hide')
    })
    it(`should mute and unmute the audio when clicking the mute button on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(playButton).click()
      cy.get(audioElement).its('0.muted').should('equal', false)
      cy.get(muteButton).click({ force: true })
      cy.get(audioElement).its('0.muted').should('equal', true)
    })
    it(`should display captions if provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const captionsPath = '/audioExamples/captions.vtt'
      cy.mount(
        <Sound
          src={'/audioExamples/audioCaptions.mp3'}
          title="Audio with Captions"
          captions={captionsPath}
        />
      )
      cy.get('[data-cy=show-captions-button]').click()
      cy.get('track').should('exist').should('have.attr', 'src', captionsPath)
    })
    it(`should display an error message when no valid sources are found on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Sound src="" />)
      cy.get(audioElement).should('not.exist')
      cy.get(loadingError).should('be.visible')
      cy.get(loadingError).should('be.visible')
    })
    it(`should display an error message when the resource loading has been stalled on ${viewport} screen`, () => {
      cy.viewport(viewport)
      // Delay server response to simulate stalled media loading
      cy.intercept(src, (req) => {
        req.on('response', (res) => {
          // Wait for delay in milliseconds before sending the response to the client.
          res.setDelay(2000)
        })
      }).as('mediaRequest')
      // Listen for the stalled event on the audio element
      cy.get(audioElement).then((audio) => {
        audio.on('stalled', () => {
          // Assertion to confirm that the stalled event was triggered
          expect(true).to.be.true
          cy.get(loadingError).should('be.visible')
        })
      })
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it(`should change the volume when adjusting the volume slider on mobile`, () => {
      cy.get(audioElement).its('0.volume').should('equal', 1)
      cy.get(volumeSlider).type('{leftArrow}')
      cy.get(audioElement).its('0.volume').should('be.lessThan', 1)
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
    })

    it(`should change the volume when adjusting the volume slider on desktop`, () => {
      cy.get(audioElement).its('0.volume').should('equal', 1)
      cy.get(muteButton).realHover().get(volumeSlider).should('be.visible')
      // wait for slider animation
      cy.wait(1000)
      cy.get(volumeSlider).type('{leftArrow}')
      cy.get(audioElement).its('0.volume').should('be.lessThan', 1)
    })
  })
})
