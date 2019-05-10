import React from "react";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import "./App.css";
class App extends React.Component {
  componentDidMount() {
    this.props.data.subscribeToMore({
      document: subscription,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { message } = subscriptionData.data;
        return Object.assign({}, prev, {
          messages: [...prev.messages, message]
        });
      }
    });
  }

  render() {
    const { data } = this.props;
    if (data.loading) {
      return <div>...loading</div>;
    }
    const { messages } = data;
    return (
      <div className="App">
        <header className="App-header">
          <div className="chat-container">
            <div className="messages">
              {messages.map((message, index) => (
                <p key={`message-${index}`}>{message.content}</p>
              ))}
            </div>
          </div>
        </header>
      </div>
    );
  }
}

const userQuery = gql`
  query {
    messages {
      name
      content
    }
  }
`;

const subscription = gql`
  subscription {
    message {
      content
      type
      name
    }
  }
`;

export default compose(
  graphql(userQuery, {
    options: props => ({
      variables: {}
    })
  })
  // graphql(subscription)
)(App);
