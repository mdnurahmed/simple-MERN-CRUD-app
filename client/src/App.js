import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import { Input, Modal, Row, Col, Button as Butt, notification } from "antd";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { DeleteTwoTone, SmileOutlined, MehOutlined } from "@ant-design/icons";

const happyIcon = <SmileOutlined style={{ color: "#108ee9" }} />;
const sadIcon = <MehOutlined style={{ color: "red" }} />;

class App extends Component {
  state = {
    data: [],
    page: 1,
    visible: false,
    titleValue: "",
    contentValue: "",
    updatingIndex: -1,
  };
  componentDidMount() {
    this.getPosts(1);
  }
  getPosts = (page) => {
    if (page <= 0) return;
    if (page > 1 && this.state.data.length == 0) return;
    this.setState({
      page: page,
    });
    let config = {
      params: {
        page: page,
      },
    };

    axios
      .get("http://localhost:5000/myposts", config)
      .then((response) => {
        let datasource = [];
        for (let i = 0; i < response.data.posts.length; i++) {
          datasource.push(response.data.posts[i]);
        }

        this.setState({
          data: datasource,
        });
        this.Notification(
          "Post Loading Successful",
          "Succesfully Loaded all the posts for page : " + this.state.page,
          happyIcon
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  delete = (index) => {
    let postId = this.state.data[index]._id;

    axios
      .delete("http://localhost:5000/myposts/post/" + postId)
      .then((response) => {
        this.Notification("Delete Succesfull", response.message, happyIcon);
        let datasource = [...this.state.data];
        datasource.splice(index, 1);
        this.setState({
          data: datasource,
        });
      })
      .catch((err) => {
        console.log(err);
        this.Notification("Delete Failed", "Something Went Wrong", sadIcon);
      });
  };

  Notification = (desc, msg, icon) => {
    notification.open({
      message: desc,
      description: msg,
      duration: 0,
      icon: icon,
      onClick: () => {},
    });
  };

  handleOk = (type) => {
    const data = {
      title: this.state.titleValue,
      content: this.state.contentValue,
    };

    if (this.state.updatingIndex >= 0) {
      axios
        .put(
          "http://localhost:5000/myposts/post/" +
            this.state.data[this.state.updatingIndex]._id,
          data
        )
        .then((response) => {
          this.Notification("Post Update Successful", "", happyIcon);
          this.getPosts(1);
        })
        .catch((err) => {
          this.Notification("Post creation failed", err.message, sadIcon);
        });
    } else {
      axios
        .post("http://localhost:5000/myposts", data)
        .then((response) => {
          this.Notification("Post creation successful", "", happyIcon);
          this.getPosts(1);
        })
        .catch((err) => {
          console.log(err);
          this.Notification("Post creation failed", err.message, sadIcon);
        });
    }
    this.setState({
      visible: !this.state.visible,
      titleValue: "",
      contentValue: "",
      updatingIndex: -1,
    });
  };
  toggleModalVisibility = () => {
    this.setState({
      visible: !this.state.visible,
      titleValue: "",
      contentValue: "",
    });
  };
  onTitleChange = (e) => {
    this.setState({
      titleValue: e.target.value,
    });
  };

  onContentChange = (e) => {
    this.setState({
      contentValue: e.target.value,
    });
  };

  update = (index) => {
    this.toggleModalVisibility();
    this.setState({
      titleValue: this.state.data[index].title,
      contentValue: this.state.data[index].content,
      updatingIndex: index,
    });
  };

  render() {
    let createButton = (
      <Row style={{ padding: "10px 0px 10px 0px" }}>
        <Col className="gutter-row" span={8} offset={8}>
          <Butt
            type="primary"
            onClick={() => this.toggleModalVisibility()}
            style={{
              fontFamily: "Candara",
            }}
          >
            Create A New Post
          </Butt>
        </Col>
      </Row>
    );

    let navigationButtons = (
      <Row style={{ padding: "10px 0px 10px 0px" }}>
        <Col className="gutter-row" span={3}>
          <Butt
            type="primary"
            onClick={() => this.getPosts(this.state.page - 1)}
            style={{
              fontFamily: "Candara",
            }}
          >
            Previous Page
          </Butt>
        </Col>
        <Col className="gutter-row" span={3} offset={18}>
          <Butt
            type="primary"
            onClick={() => this.getPosts(this.state.page + 1)}
            style={{
              fontFamily: "Candara",
            }}
          >
            Next Page
          </Butt>
        </Col>
      </Row>
    );

    let result = null;
    result = (
      <TableContainer component={Paper}>
        <Table asize="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                  Title
                </h2>
              </TableCell>
              <TableCell align="right">
                <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                  Content
                </h2>
              </TableCell>
              <TableCell align="right">
                <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                  Update
                </h2>
              </TableCell>
              <TableCell align="right">
                <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                  Delete
                </h2>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <h3>{row.title}</h3>
                </TableCell>
                {/* <TableCell align='right'>{row.short_url}</TableCell> */}
                <TableCell align="right">
                  <h3>{row.content}</h3>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.update(index)}
                  >
                    Update
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => this.delete(index)}
                  >
                    Delete <DeleteTwoTone />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );

    let modal = (
      <Modal
        visible={this.state.visible}
        title="Create a New Post"
        onOk={() => this.toggleModalVisibility()}
        onCancel={() => this.toggleModalVisibility()}
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Input
          placeholder="Title"
          value={this.state.titleValue}
          onChange={(val) => this.onTitleChange(val)}
        />
        <Input.TextArea
          rows={10}
          style={{ padding: "10px" }}
          placeholder="Content"
          onChange={(val) => this.onContentChange(val)}
          value={this.state.contentValue}
        />
      </Modal>
    );

    return (
      <div className="App">
        {modal}
        {createButton}
        {navigationButtons}
        {result}
      </div>
    );
  }
}

export default App;
