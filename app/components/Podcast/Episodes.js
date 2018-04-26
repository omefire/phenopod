// @flow
import type {Podcast, Episode} from '../../types/podcast';
import type {Dispatch, Action} from '../../types/index';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import fetchEpisodes from '../../api/rssFeed';
import {selectEpisode} from '../../actions/index';

type Props = {|
  podcast: Podcast,
  playEpisode: (Podcast, Episode) => Action
|};

type State = {|
  loading: boolean,
  error: boolean,
  episodes: Array<Episode>,
  count: number,
  descId: ?number
|};

class Episodes extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      episodes: [],
      count: 10,
      descId: undefined
    };
  }

  handleEpisodesFetch(podcast: Podcast) {
    let reqOpts = {
      url: podcast.feedUrl,
      method: 'GET'
    };
    fetchEpisodes(reqOpts)
      .then(({episodes}) => this.setState({
        loading: false,
        episodes
      }))
      .catch(() => this.setState({
        loading: false,
        error: true
      }));
  }

  handleDescToggle(id: number) {
    return (e: SyntheticEvent<HTMLElement>) => {
      let { descId } = this.state;
      this.setState({descId: descId !== id ? id : undefined});
    };
  }

  handleEpisodePlay(podcast: Podcast) {
    return (episode: Episode) => {
      return (e: SyntheticEvent<HTMLElement>) => {
        let { playEpisode } = this.props;
        playEpisode(podcast, episode);
      };
    };
  }

  handleLoadMore(e: SyntheticEvent<HTMLElement>) {
    let { count } = this.state;
    this.setState({ count: count + 10 });
  }

  componentWillReceiveProps(nextProps: Props) {
    let { podcast } = nextProps;
    this.setState({ loading: true, error: false, episodes: [] });
    this.handleEpisodesFetch.call(this, podcast);
  }

  componentDidMount() {
    let { podcast } = this.props;
    this.handleEpisodesFetch.call(this, podcast);
  }

  render() {
    let { podcast } = this.props;
    let { episodes, count, loading, error, descId } = this.state;
    let onPlay = this.handleEpisodePlay(podcast).bind(this);
    let onLoadMore = this.handleLoadMore.bind(this);
    let onDescToggle = this.handleDescToggle.bind(this);
    return (
      <div className='episodes'>
        { loading
        ? <div className='loader'></div>
        : error
          ? <div className='error'>Error Fetching Podcasts.</div>
          : <div>
              {episodes.slice(0, count).map(renderEpisode(onPlay, onDescToggle, descId))}
              { count < episodes.length
              ? <div className='load-more' onClick={onLoadMore}>
                  load more episodes.
                </div>
              : undefined
              }
            </div>
        }
      </div>
    );
  }
}

const renderEpisode = (onPlay, onDescToggle, descId) => (episode: Episode, i: number) => (
  <div className={'episode ' + (i % 2 ? 'dark' : 'light')} key={i}>
    <img className='play-icon' src='/img/play-circle.png' onClick={onPlay(episode)}/>
    <div className='title'>{episode.title}</div>
    <div className='meta'>
      <span className='date'>{episode.date}</span>
      <span className='dot'> • </span>
      <span className='desc-toggle' onClick={onDescToggle(i)}>
        { descId === i ? 'Hide description' : 'Show description' }
      </span>
    </div>
    <div className={`description ${descId === i ? 'show' : ''}`}
      dangerouslySetInnerHTML={{__html: episode.description}}
    />
  </div>
);

const mapDispatchtoProps = (dispatch: Dispatch) => ({
  playEpisode: (p: Podcast, e: Episode) => dispatch(selectEpisode(p, e))
});

export default connect(null, mapDispatchtoProps)(Episodes);
