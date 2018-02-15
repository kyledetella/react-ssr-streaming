import express from 'express'
import React from 'react'
import { renderToNodeStream } from 'react-dom/server';
import Frontend from './client';

const {PORT = 3054} = process.env

const app = express()

// TODO: This is a hack since there is no build pipeline for client side js code
const clientScript = [
'const React = window.React',
'const Frontend = (props) => {',
'  return (',
'    <span>',
'    <div>{props.name}</div>',
'    <button onClick={() => console.log(`Clicked: ${props.name}`)}>Click Me</button>',
'    </span>',
'  )',
'}',
'window.Frontend = Frontend'
].join('\n')

const scriptTags = `
  <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/babel-standalone@6.24.2/babel.min.js" charset="utf-8"></script>
  <script type="text/babel">${clientScript}</script>
  <script type="text/babel">ReactDOM.hydrate(<Frontend name="De" />, document.getElementById('root'))</script>
`

app.get('/', (req, res) => {
  // Send the start of your HTML to the browser
  res.write('<html><head><title>Page</title></head><body><div id="root">');

  // Render your frontend to a stream and pipe it to the res
  const stream = renderToNodeStream(<Frontend name="Kyle" />);
  stream.pipe(res, { end: false });

  // When React finishes rendering send the rest of your HTML to the browser
  stream.on('end', () => {
    res.end(`</div>${scriptTags}</body></html>`);
  });
})

app.listen(PORT, () => console.log(`App running @${PORT}`))
