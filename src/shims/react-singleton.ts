/**
 * React Singleton Shim
 * Forces a single React instance across all dependencies
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

// Ensure React is properly initialized
if (typeof window !== 'undefined') {
  // @ts-ignore - Force global React for legacy compatibility
  window.React = React;
  // @ts-ignore
  window.ReactDOM = ReactDOM;
}

export { React, ReactDOM, ReactDOMClient };
export default React;
