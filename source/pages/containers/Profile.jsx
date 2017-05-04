import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Loading from '../../shared/components/Loading';
import DetailPost from '../../posts/containers/DetailPost';
import api from '../../api';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      posts: [],
      loading: true,
    };
    this.initialFetch = this.initialFetch.bind(this);
  }

  async componentDidMount() {
    this.initialFetch();
  }

  async initialFetch() {
    const [
      user,
      posts,
    ] = await Promise.all([
      await api.users.getSingle(this.props.match.params.id),
      await api.users.getPosts(this.props.match.params.id),
    ]);

    this.setState({
      user,
      posts,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <section name="about">
        <h2>
          DIEGO
          <FormattedMessage
            id="title.profile"
            values={{
              name: this.state.user.name,
            }}
          />
        </h2>
        <fieldset>
          <FormattedMessage
            id="profile.field.basic"
            tagName="legend"
          />
          <input type="email" value={this.state.user.email} disabled />
        </fieldset>

        {this.state.loading && (
          <span>Loading posts...</span>
        )}
        {this.state.posts
          .map(post => (
            <DetailPost
              key={post.id}
              user={this.state.user}
              {...post}
            />
          ))
        }
      </section>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default Profile;
