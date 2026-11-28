/* eslint-disable no-magic-numbers */
import { formatDurationTime } from './helper'

// A media element reports NaN (unknown) or Infinity (live stream) for its
// duration until it knows it, and the time display must not show NaN:NaN.
describe('formatDurationTime', () => {
  it('formats an unknown duration as 0:00', () => {
    expect(formatDurationTime(NaN)).to.equal('0:00')
    expect(formatDurationTime(Infinity)).to.equal('0:00')
  })

  it('formats known durations', () => {
    expect(formatDurationTime(65)).to.equal('1:05')
    expect(formatDurationTime(3725)).to.equal('1:02:05')
  })
})
