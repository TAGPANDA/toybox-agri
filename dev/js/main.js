var React = require('react')

var Agri = require('./view.jsx')
var sendRequest = require('./sendRequest')
var loadcss = require('./loadcss')


// async load css
loadcss('//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css')
loadcss('//fonts.googleapis.com/css?family=Bowlby+One')
loadcss('//fonts.googleapis.com/css?family=Rokkitt')

sendRequest.items()
  .done(function(result) {
    React.render(
      React.createElement(Agri, {list: result}),
      document.getElementById('content'))
  })
