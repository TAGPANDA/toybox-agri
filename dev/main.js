var React = require('react')

var Agri = require('./view.jsx')
var sendRequest = require('./sendRequest')

sendRequest.items()
  .done(function(result) {
    React.render(
      React.createElement(Agri, {list: result}),
      document.getElementById('content'))
  })
