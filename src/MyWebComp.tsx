import {createElement} from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import Welcome from './Welcome';

class MyWebComp extends HTMLElement {
  connectedCallback () {
    render(createElement(Welcome, {interactionid: this.getAttribute('interactionid')}), this)
  }

  disconnectedCallback () {
      const welcome = this.querySelector('.neo-widget__content');
      if (welcome) {
        unmountComponentAtNode(welcome);
      }
  }
  }

  customElements.define('my-web-comp', MyWebComp);
