var testCase = require('nodeunit').testCase,
    swig = require('../../index');

exports.set = testCase({
    setUp: function (callback) {
        swig.init({
            allowErrors: true
        });
        callback();
    },

    basic: function (test) {
        test.strictEqual(swig.compile('{% set foo = "bar" %} {{ foo }}')({}), ' bar', 'basic');
        test.strictEqual(swig.compile('{% set foo = bar|lower %} {{ foo }}')({ bar: 'BAR' }), ' bar', 'from var');
        test.strictEqual(swig.compile('{% set foo = ["hi", "bye"] %} {{ foo[0] }}')({}), ' hi', 'array');
        test.strictEqual(swig.compile('{% set foo = { bar: "bar" } %} {{ foo.bar }}')({}), ' bar', 'object');
        test.strictEqual(swig.compile('{% set foo = 99 %} {{ foo }}')({}), ' 99', 'number');
        test.strictEqual(swig.compile('{% set foo = true %}{% if foo == true %}hi{% endif %}')({}), 'hi');
        test.done();
    },

    'sets for current context': function (test) {
        var tpl = swig.compile('{% set foo = true %}{% if foo %}{% set foo = false %}{% endif %}{{ foo }}', { filename: 'hihi' });
        test.strictEqual(tpl({}), 'false', 'if block');
        test.done();
    },

    'sets across blocks': function (test) {
        test.strictEqual(swig.compile('{% set foo = "foo" %}{% block a %}{{ foo }}{% set foo = "bar" %}{% endblock %}{{ foo }}{% block b %}{{ foo }}{% endblock %}')(), 'foobarbar');
        test.done();
    },

    'sets across extends': function (test) {
        swig.compile('{% block a %}{{ foo }}{% endblock %}', { filename: 'a' });
        test.strictEqual(swig.compile('{% extends "a" %}{% set foo = "bar" %}')(), 'bar');
        test.done();
    }
});
