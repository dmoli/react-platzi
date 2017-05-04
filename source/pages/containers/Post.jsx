import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import DetailPost from '../../posts/containers/DetailPost';
import Loading from '../../shared/components/Loading';
import Comment from '../../comments/components/Comment';
import api from '../../api';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {},
      post: {},
      comments: [],
    };
    this.initialFetch = this.initialFetch.bind(this);
  }

  componentDidMount() {
    this.initialFetch();
  }

  async initialFetch() {
    const [
      post,
      comments,
    ] = await Promise.all([
      api.posts.getSingle(this.props.match.params.id),
      api.posts.getComment(this.props.match.params.id),
    ]);

    const user = await api.users.getSingle(post.userId);

    this.setState({
      loading: false,
      post,
      comments,
      user,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <section name="about">
        <DetailPost
          {...this.state.post}
          user={this.state.user}
          comments={this.state.comments}
        />
        <section>
          {this.state.comments
            .map(comment => (
              <Comment key={comment.id} {...comment} />
            ))
          }
        </section>
      </section>
    );
  }
}

Post.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default Post;
