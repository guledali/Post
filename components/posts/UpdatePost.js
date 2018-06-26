import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import navStyles from '../../styles/navStyles';
import PostForm from './PostForm';

class UpdatePost extends Component {
  static navigationOptions = {
      title: 'Update Post',
      ...navStyles
    };
  
  state = {
    loading: false
  }

  updatePost = ({title, body}) => {
    const {updatePost, navigation, screenProps} = this.props;
    this.setState({
      loading: true
    });
    updatePost({
      variables: {
        id: this.props.Post.id,
        title,
        body,
        userId: screenProps.user.id
      }
    })
    .then(()=> {
      navigation.goBack();
    })
    .catch(error => {
      this.setState({loading: false});
      console.log(error)
    });
  };
  render() {
    return (
      <View>
        {
          this.state.loading ? (
            <ActivityIndicator size="large"/>
          ) : (
            <PostForm onSubmit={this.updatePost} post={this.props.Post} />
          )
        }
      </View>
    );
  }
}

const updatePost = gql`
  mutation updatePost($id: ID!, $title: String!, $body: String!, $userId: ID!) {
    updatePost(id: $id, title: $title, body: $body, userId: $userId) {
      id
    }
  }
`;

const postQuery = gql`
  query Post($id: ID!) {
    Post(id: $id) {
      id
      title
      body
    }
  }
`;

export default compose(
  graphql(updatePost, {
    name: 'updatePost',
    options: {
      refetchQueries: ["Post"]
    }
  }),
  graphql(postQuery, {
    props: ({data}) => ({...data}),
    options: ({navigation}) => ({
      variables: {
        id: navigation.state.params.id
      }
    }) 
  })
)(UpdatePost);


