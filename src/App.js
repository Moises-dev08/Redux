import React from "react";
import Bugs from "./components/Bugs";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import BugsList from "./components/BugsList";
import {
  Container,
  Col,
  Row,
  Button,
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardImg,
  Form,
  Navbar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiCallBegan } from "./store/api";

const store = configureStore();

function App() {
  return (
    <div clasName="App">
      <Provider store={store}>
        <BugsList />
      </Provider>
      <Container fluid>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Bugs</Navbar.Brand>
        </Navbar>
        <Form>
          <Row>
            <Col md>
              <Form.Group controlId="forEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Example@email.com"
                ></Form.Control>
                <Form.Text className="text-muted"> Welcome </Form.Text>
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group controlId="forPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Button className="secondary" type="submit">
            Login
          </Button>
        </Form>
        <Card className="mb-3" style={{ color: "#000" }}>
          <Card.Body>
            <Card.Title>Card example </Card.Title>
            <CardImg src="https://picsum.photos/200/100"></CardImg>
            <Card.Text> Hello you </Card.Text>
            <Button>Hello Moi</Button>
          </Card.Body>
        </Card>
        <Breadcrumb>
          <BreadcrumbItem> 1 </BreadcrumbItem>
          <BreadcrumbItem> 2 </BreadcrumbItem>
          <BreadcrumbItem active="true"> 3 </BreadcrumbItem>
        </Breadcrumb>
        <Alert variant="success"> Alert</Alert>
        <Button>Hello there</Button>
      </Container>
    </div>
  );
}

export default App;
