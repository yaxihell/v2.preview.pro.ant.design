/* eslint-disable react/react-in-jsx-scope */
import { Comment, Avatar } from 'antd';
import moment from 'moment';
import * as React from 'react';
import Editor from './editor';
import CommentList from './commentList';

class Index extends React.Component {
  state = {
    comments: [
      {
        author: 'zhangxiaolu',
        avatar: 'https://avatars3.githubusercontent.com/u/62560763?s=60&v=4',
        content: '希望支持更多功能',
        datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    ],
    submitting: false,
    value: '',
  };

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: <p>{this.state.value}</p>,
            datetime: moment().fromNow(),
          },
          ...this.state.comments,
        ],
      });
    }, 1000);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={
            <Avatar
              src="https://avatars2.githubusercontent.com/u/34116456?s=460&u=7b4c534584daeba7cccd2af6cac8006c1df83cb1&v=4"
              alt="zhangxiaolu"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </div>
    );
  }
}

export default Index;
