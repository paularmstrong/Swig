var swig = require('../lib/swig'),
  loaders = require('../lib/loaders'),
  expect = require('expect.js'),
  fs = require('fs'),
  _ = require('lodash'),
  Swig = swig.Swig;


describe('loaders', function () {
  it('is working with extends', function () {
    var templates, s, html;

    templates = {
      'layout.html': '<html>{% block content %}{% endblock %}</html>',
      'page.html': '{% extends "layout.html" %}{% block content %}Hello {{ name }}!{% endblock %}'
    };

    s = new Swig({ loader: new loaders.MemoryLoader(templates) });

    html = s.renderFile('page.html', {name: 'world'});

    expect(html).to.equal('<html>Hello world!</html>');
  });

  it('is working with include', function () {
    var templates, s, html;

    templates = {
      'page.html': '<html>{% include "content.html" %}</html>',
      'content.html': 'Hello {{ name }}!'
    };

    s = new Swig({ loader: new loaders.MemoryLoader(templates) });

    html = s.renderFile('page.html', {name: 'world'});

    expect(html).to.equal('<html>Hello world!</html>');
  });
});


