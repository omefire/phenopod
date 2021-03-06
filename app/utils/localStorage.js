// @flow
import type {State} from '../types/index'

export const loadState = (): State => {
  try {
    /* eslint-disable no-undef */
    let userFeed = localStorage.getItem('user-feed')
    let subscriptions = localStorage.getItem('subscriptions')
    let notifyNewFeed = localStorage.getItem('notify-new-feed')
    /* eslint-enable no-undef */
    return {
      nowPlaying: undefined,
      podcast: undefined,
      subscriptions: subscriptions ? JSON.parse(subscriptions) : [],
      addingNewSubscription: false,
      userFeed: userFeed ? JSON.parse(userFeed) : [],
      feedNotification: notifyNewFeed ? JSON.parse(notifyNewFeed) : false
    }
  } catch (err) {
    return {
      nowPlaying: undefined,
      podcast: undefined,
      subscriptions: [],
      addingNewSubscription: false,
      userFeed: [],
      feedNotification: false
    }
  }
}

export const saveState = (state: State) => {
  try {
    let userFeed = JSON.stringify(state.userFeed)
    let subscriptions = JSON.stringify(state.subscriptions)
    let feedNotification = JSON.stringify(state.feedNotification)
    /* eslint-disable no-undef */
    localStorage.setItem('user-feed', userFeed)
    localStorage.setItem('subscriptions', subscriptions)
    localStorage.setItem('notify-new-feed', feedNotification)
    /* eslint-enable no-undef */
  } catch (err) {
    console.log(err)
  }
}
