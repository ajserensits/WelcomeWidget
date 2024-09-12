import React from 'react';
import axios from 'axios';

// @ts-ignore
import { TextInput, Select, SelectOption } from "@avaya/neo-react";

const WEB_SOCKET_URL = "wss:";

declare global {
  interface Window {
    WS: any;
  }
}

type Agent = {
  name: string,
  status: string,
};

type WelcomeAppState = {
  agents: Array<Agent>,
  interactionid: string,
}

type WelcomeAppProps = {
  interactionid: string,
}

const agentData = [
  {
    name: 'Andrew Agent1',
    status: 'ACTIVE_ENGAGEMENT'
  },
  {
    name: 'AAhron Agent1',
    status: 'LOGGED_OFF'
  }
];

class Welcome extends React.Component<WelcomeAppState> {
  api: any;
  props: WelcomeAppProps;
  socket: any;
  socketUrl: string;
  state: WelcomeAppState;
  constructor(props: WelcomeAppProps) {
    super(props);
    this.api = (window).WS.widgetAPI(props.interactionid);
    this.props = props;
    this.state = {
      agents: [],
      interactionid: props.interactionid,
    }
  }

  createSubscription = async () => {
    const response = await axios.get('https://middleware.app');
    this.socketUrl = response?.data?.socketUrl;
    this.setupWebSocket();
  }

  setupWebSocket = () => {
    console.log('setupWebSockett');
    if (this.socket) {
      return;
    }


    // Initialize WebSocket connection
    this.socket = new WebSocket(this.socketUrl);

    // Define WebSocket event handlers
    this.socket.onopen = () => {
        console.log('WebSocket connection opened');
        this.socket.send(JSON.stringify({
          name: 'FULL_INITIALIZE_AND_SUBSCRIBE_TO_TRANSCRIPT',
        }));
    };

    this.socket.onmessage = (event) => {
        console.log('Message from serverNew:', event.data);
        this.handleOnMessageWebSocket(event.data);
        //setMessages(prevMessages => [...prevMessages, event.data]);
    };

    this.socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
        this.socket?.close();
    };
  }

  handleOnMessageWebSocket = (data: any) => {

  }

  renderAgentData = () => {
    return (
      this.state.agents.map((agent: Agent) => {
        return (
          <div>
            <p>Name: <span>{ agent.name }</span></p>
            <p>Status: <span>{ agent.status }</span></p>
          </div>
        );
      })
    );
  }

  
render() {
      return (<div className="neo-widget__content">
      <div className="neo-widget__header">
      <div className="neo-widget__header-left">
        <span className="neo-icon-agents"></span>
        <p>React</p>
      </div>
    </div>
      <div className="neo-widget__body">
          <div className="container">
              <h3><b>React Web Component</b></h3>
              { this.renderAgentData() }
              <button onClick={(evt) => {
                this.setState({
                  agents: agentData
                });
              }}>
                Simulate Agent Data
              </button>
          </div>
        </div>
      </div>
      );
    }
  }

  export default Welcome;
