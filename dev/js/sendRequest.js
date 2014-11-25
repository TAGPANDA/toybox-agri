var $ = require('jquery')

module.exports = {
  items: function() {
    return $.ajax({
      url: '/api/agri/all',
      dataType: 'json'
    })
  },
  createItem: function(query) {
    return $.ajax({
      url: '/api/agri/create/',
      data: $.param(query),
      dataType: 'json'
    })
  },
  removeItem: function(id) {
    return $.ajax({
      url: '/api/agri/delete/' + id,
      dataType: 'json'
    })
  }
};
