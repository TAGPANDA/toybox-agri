module.exports = function (href, before) {
	'use strict';

	var d = document
	var l = d.createElement('link')
	var scr = before || d.getElementsByTagName('link')[0]

	l.rel = 'stylesheet'
	l.href = href
	l.media = 'all'
	scr.parentNode.insertBefore(l, scr)

	return l
}
