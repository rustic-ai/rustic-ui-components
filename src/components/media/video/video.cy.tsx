/* eslint-disable no-magic-numbers */
import 'cypress-real-events'

import { supportedViewports } from '../../../../cypress/support/variables'
import Video from './video'

describe('Video', () => {
  const videoElement = '[data-cy=video-element]'
  const volumeSlider = '[data-cy=volume-slider]'
  const muteButton = '[data-cy=mute-button]'
  const progressSlider = '[data-cy=progress-slider]'
  const pauseButton = '[data-cy=pause-button]'
  const playButton = '[data-cy=play-button]'
  const miniPlayerButton = '[data-cy=mini-player-button]'
  const miniPlayerExitButton = '[data-cy=exit-mini-player-button]'
  const fullScreenEnterButton = '[data-cy=fullscreen-button]'
  const fullScreenExitButton = '[data-cy=exit-fullscreen-button]'
  const transcript = '[data-cy=transcript]'
  const transcriptToggle = '[data-cy=transcript-toggle]'
  const loadingError = '[data-cy=loading-error]'
  const controlError = '[data-cy=control-error]'
  const loadingSpinner = '[data-cy=spinner]'

  const src = '/videoExamples/videoCypress.mp4'
  const title = 'Video Component'
  const captions = '/audioExamples/captions.vtt'
  const transcriptContent =
    'This is a sample transcript for testing the video component.'

  context('Mobile and Desktop', () => {
    beforeEach(() => {
      cy.mount(
        <Video
          src={src}
          title={title}
          captions={captions}
          transcript={transcriptContent}
        />
      )
    })

    supportedViewports.forEach((viewport) => {
      it(`should initially show the loading spinner on ${viewport} screen`, () => {
        cy.viewport(viewport)
        // Hold the response back so the loading state lasts long enough to
        // assert on; local test media otherwise loads before Cypress looks.
        const delayedSrc = `${src}?delayed`
        cy.intercept(delayedSrc, (req) => {
          req.on('response', (res) => {
            res.setDelay(1000)
          })
        })
        cy.mount(<Video src={delayedSrc} title={title} />)
        cy.get(loadingSpinner).should('be.visible')
        cy.get(loadingSpinner).should('not.exist')
      })
      it(`should show and hide the transcript when clicking the transcript toggle on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(transcript).should('not.exist')
        cy.get(transcriptToggle).should('contain', 'Show')
        cy.get(transcriptToggle).click()
        cy.get(transcript).should('be.visible')
        cy.get(transcriptToggle).should('contain', 'Hide')
      })
      it(`should toggle between pause and play when clicking the play/pause button on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(playButton).should('exist')
        cy.get(videoElement).its('0.paused').should('equal', true)
        cy.get(playButton).click()
        cy.get(pauseButton).should('exist')
        cy.get(videoElement).its('0.paused').should('equal', false)
        cy.get(pauseButton).click()
        cy.get(playButton).should('exist')
      })
      it(`should toggle between fullscreen and normal mode when clicking the fullscreen button on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(loadingSpinner).should('not.exist')
        cy.get(fullScreenEnterButton).should('exist')
        cy.get(fullScreenEnterButton).should('be.visible')

        cy.get(fullScreenEnterButton).realClick()
        cy.wait(1000)
        cy.document().its('fullscreenElement').should('exist')

        cy.get(fullScreenExitButton).realClick()
        cy.wait(1000)
        cy.document().its('fullscreenElement').should('not.exist')
      })
      it(`should display an error message when no valid sources are found on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.mount(<Video src="" />)
        cy.get(videoElement).should('not.exist')
        cy.get(loadingError).should('be.visible')
        cy.get(loadingError).should('be.visible')
      })
      it(`should display an error message when the resource loading has been stalled on ${viewport} screen`, () => {
        cy.viewport(viewport)
        // Delay server response to simulate stalled media loading
        cy.intercept(src, (req) => {
          req.on('response', (res) => {
            const delay = 5000
            // Wait for delay in milliseconds before sending the response to the client.
            res.setDelay(delay)
          })
        })
        // Listen for the stalled event on the video element
        cy.get(videoElement).then((video) => {
          video.on('stalled', () => {
            cy.get(loadingError).should('be.visible')
          })
        })
      })
      it(`should display an error message if pressing play fails on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.window().then((window) => {
          cy.stub(window.HTMLMediaElement.prototype, 'play').rejects(
            new DOMException('some error')
          )
        })

        cy.get(playButton).click()
        cy.get(playButton).should('exist')
        cy.get(pauseButton).should('not.exist')
        cy.get(controlError).should('exist')
      })
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
      cy.mount(
        <Video
          src={src}
          title={title}
          captions={captions}
          transcript={transcriptContent}
        />
      )
    })

    it('should show all the controls on fullscreen mode', () => {
      cy.get(fullScreenEnterButton).should('exist')
      cy.get(fullScreenEnterButton).realClick()
      cy.wait(1000)
      cy.get(playButton).should('exist')
      cy.get(transcriptToggle).should('exist')
      cy.get(fullScreenExitButton).should('exist')
      cy.get(miniPlayerButton).should('exist')
      cy.get(progressSlider).should('exist')
    })

    it('should display an error message if entering fullscreen fails', () => {
      cy.get(loadingSpinner).should('not.exist')
      cy.window()
        .then((window) => {
          cy.stub(window.HTMLElement.prototype, 'requestFullscreen').rejects(
            new TypeError('some error')
          )
        })
        .then(() => {
          cy.get(fullScreenEnterButton).realClick()
          cy.get(fullScreenExitButton).should('not.exist')
          cy.get(fullScreenEnterButton).should('exist')
          cy.get(controlError).should('exist')
        })
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
      cy.mount(
        <Video
          src={src}
          title={title}
          captions={captions}
          transcript={transcriptContent}
        />
      )
      cy.get(loadingSpinner).should('not.exist')
    })
    it(`should go forwards and backwards 10 seconds when clicking the forward/back buttons`, () => {
      const tenSeconds = 10

      cy.get('[data-cy=forward-ten-seconds-button]').click()
      cy.get(videoElement).its('0.currentTime').should('equal', tenSeconds)
      cy.get('[data-cy=replay-ten-seconds-button]').click()
      cy.get(videoElement).its('0.currentTime').should('equal', 0)
    })
    it(`should mute and unmute the audio when clicking the mute button`, () => {
      cy.get(playButton).click()
      cy.get(videoElement).its('0.muted').should('equal', false)
      cy.get(muteButton).click({ force: true })
      cy.get(videoElement).its('0.muted').should('equal', true)
    })
    it(`should change the volume when adjusting the volume slider on desktop`, () => {
      cy.get(videoElement).its('0.volume').should('equal', 1)
      cy.get(muteButton).focus().get(volumeSlider).should('be.visible')

      const sliderAnimationWait = 1000
      cy.wait(sliderAnimationWait)
      // MUI 9's Slider focuses its thumb input a frame after mousedown, so
      // cy.type() on the root sees the track; focus the input and press a key.
      cy.get(volumeSlider).find('input[type=range]').focus()
      cy.realPress('ArrowLeft')
      cy.get(videoElement).its('0.volume').should('be.lessThan', 1)
    })
    it(`should change the time when the video progress slider is adjusted`, () => {
      cy.get(videoElement).its('0.currentTime').should('equal', 0)
      cy.get(progressSlider).type('{rightArrow}')
      cy.get(videoElement).its('0.currentTime').should('be.greaterThan', 0)
    })
    it('should show the correct view when going to fullscreen mode then changing the viewport size', () => {
      cy.get(fullScreenEnterButton).should('exist')
      cy.get(fullScreenEnterButton).realClick()
      cy.get(fullScreenExitButton, { timeout: 2000 }).should('exist')
      cy.document().its('fullscreenElement').should('exist')

      cy.viewport('iphone-6')
      cy.get(fullScreenExitButton).click()
      cy.get(fullScreenEnterButton, { timeout: 2000 }).should('exist')
      cy.document().its('fullscreenElement').should('not.exist')
    })
    it('should toggle between mini player and normal mode when clicking the mini player button', () => {
      cy.get(miniPlayerButton).should('exist')
      cy.get(miniPlayerButton).realClick()
      cy.wait(1000)
      cy.get(miniPlayerExitButton, { timeout: 2000 }).should('exist')
      cy.document().its('pictureInPictureElement').should('exist')

      cy.get(miniPlayerExitButton).click()
      cy.wait(1000)
      cy.get(miniPlayerButton, { timeout: 2000 }).should('exist')
      cy.document().its('pictureInPictureElement').should('not.exist')
    })
    it('should display an error message if entering fullscreen fails', () => {
      cy.get(loadingSpinner).should('not.exist')
      cy.window()
        .then((window) => {
          cy.stub(window.HTMLElement.prototype, 'requestFullscreen').rejects(
            new TypeError('some error')
          )
        })
        .then(() => {
          cy.get(fullScreenEnterButton).realClick()
          cy.get(fullScreenExitButton).should('not.exist')
          cy.get(fullScreenEnterButton).should('exist')
          cy.get(controlError).should('exist')
        })
    })
  })
})
