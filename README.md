Bookshelf Authorization [![Build Status](https://travis-ci.org/valet-io/bookshelf-authorization.png?branch=master)](https://travis-ci.org/valet-io/bookshelf-authorization) [![NPM version](https://badge.fury.io/js/bookshelf-authorization.png)](http://badge.fury.io/js/bookshelf-authorization)
=======================

Bookshelf Authorization is an authorization library made for [Bookshelf](https://github.com/tgriesser/bookshelf) with an easy-to-read rule syntax and powerful promise-based authorization test. 

## What is Authorization?

**Authorization** is the process of determining whether a particular entity should be allowed to access a piece of data. **Authentication** is the process of verifying an accessor's identity (e.g. matching a username and password to a user model).

## Getting Started
First load the plugin: 

```js
var Bookshelf = require('bookshelf');
var bookshelfAuthorization = require('bookshelf-authorization');
var bookshelf = Bookshelf.initialize({
  // config
});

bookshelf.plugin(bookshelfAuthorization);
```

The plugin also support the use of a custom base model. It will check the `options` (2nd) argument passed to the plugin for a `base` property. The `base` option is expected to have an `Model` property that holds the base model.

```js
var base = {
  Model: Bookshelf.Model.extend()
};
bookshelf.plugin(bookshelfAuthorization, {
  base: base
});
```
`base` will now have an updated `Model` in addtion to `User`.

## Models and Users
Bookshelf Authorization appends an `authorize` method to models for creating authorization rules. A `User` inherits from `Model` and also add the `can` method for determining permissions. You'll use `Model` for all of your data and `User` for anything that needs to be assigned permissions (users, administrators, apps, etc.)

You'll need to use `Model.extend` otherwise the special `authorize` and `can` properties won't be assigned. That means no `class MyModel extends Model` in CoffeeScript.

## Model.authorize
Calling `Model.authorize` starts an authorization rule chain. Rules chains have two methods:

#### `a(User)`
Accepts a user constructor to scope the rule to a particular user type. Also aliased as `an`.
#### `to(method)`
Accepts a method name (e.g. `read` or `write`) or array of method names to scope the rule. `to` can also be chained with the pre-defined `read` and `write` methods. The following are equivalent:

```js
Patient.authorize.a(Doctor).to('write').always();
Patient.authorize.a(Doctor).to.write.always();
```

Rule chains can be closed with three methods:

#### `always()`
When the rule is matched, it will allow access
#### `never()`
When the rule is matched, it will prevent access
#### `when(fn)`
When the rule is matched, the supplied `fn` will be called with a `this` value of `model` and an argument of `user`. It is wrapped in a promise, so throwing or returning a rejected promise will cause the rule to deny access. If the `fn` returns truthy, the rule will allow access. If it returns falsy (`undefined`, `NaN`, `null`, `''`, `false`) or an empty array (`[]`), the rule will deny access.

Example: 

```js
Patient.authorize.a(Doctor).to.write.when(function (doctor) {
  return this.doctor_id === doctor.id;
});
```

`this` is the patient being accessed and `doctor` is the user acessing the data.