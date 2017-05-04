import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Loading from '../../shared/components/Loading';
import DetailPost from '../../posts/containers/DetailPost';
import api from '../../api';
import styles from './Page.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      posts: [],
      loading: true,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.initialFetch = this.initialFetch.bind(this);
  }

  async componentDidMount() {
    this.initialFetch();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async initialFetch() {
    const posts = await api.posts.getList(this.state.page);

    this.setState({
      posts,
      page: this.state.page + 1,
      loading: false,
    });
  }

  handleScroll() {
    if (this.state.loading) return null;

    const scrolled = window.scrollY; // dinamic value
    const viewportHeight = window.innerHeight; // fixed value, only user view
    const fullHeight = document.documentElement.clientHeight; // dinamic value, complete height page
    const triggerScroll = 0; // trigger when the scroll get to bottom

    // when the scrolled + viewportHeight is major or equals to fullHeight, then trigger scroll
    if (!(scrolled + viewportHeight + triggerScroll >= fullHeight)) {
      return null;
    }

    return this.setState({ loading: true }, async () => {
      try {
        const posts = await api.posts.getList(this.state.page);
        this.setState({
          posts: this.state.posts.concat(posts),
          page: this.state.page + 1,
          loading: false,
        });
      } catch (error) {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    return (
      <section name="Home" className={styles.section}>
        <h1>
          <FormattedMessage id="title.home" />
        </h1>
        <section className={styles.list}>
          {this.state.loading && (
            <Loading />
          )}
          {
           this.state.posts
            .map(post => <DetailPost key={post.id} {...post} />)
          }
        </section>
      </section>
    );
  }
}

export default Home;
