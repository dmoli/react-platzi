import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Loading from '../../shared/components/Loading';
import styles from './DetailPost.css';
import api from '../../api';

class DetailPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: props.user || null,
      comments: props.comments || null,
    };
  }

  componentDidMount() {
    this.initialFetch();
  }

  async initialFetch() {
    // if i have user and comments
    if (!!this.state.user && !!this.state.comments) return this.setState({ loading: false });
    const [
      user,
      comments,
    ] = await Promise.all([
      !this.state.user ? api.users.getSingle(this.props.userId) : Promise.resolve(null),
      !this.state.comments ? api.posts.getComment(this.props.id) : Promise.resolve(null),
    ]);

    return this.setState({
      loading: false,
      user: user || this.state.user,
      comments: comments || this.state.comments,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <article id={`post-${this.props.id}`} className={styles.post}>
        <h2 className={styles.title}>
          <Link to={`/post/${this.props.id}`}>
            {this.props.title}
          </Link>
        </h2>
        <p>
          {this.props.body}
        </p>
        {!this.state.loading && (
          <div className={styles.meta}>
            <Link to={`/user/${this.state.user.id}`} className={styles.user}>
              {this.state.user.username}
            </Link>
            <span className={styles.comments}>
              <FormattedMessage
                id="post.meta.comments"
                values={{
                  amount: this.state.comments.length,
                }}
              />
            </span>
            <Link to={`/post/${this.props.id}`}>
              <FormattedMessage id="post.meta.readMore" />
            </Link>
          </div>
        )}
      </article>
    );
  }
}

DetailPost.defaultProps = {
  user: {},
  comments: [],
};

DetailPost.propTypes = {
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.object,
    })),
};

export default DetailPost;
