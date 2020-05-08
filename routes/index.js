//index.js
/*
<li>webhook</li>
<li>home</li>
<li>pricing</li>
<li>checkout</li>
<li>about</li>
<li>admin</li>
<li>login</li>
<li>dashboard</li>
*/
var express = require('express');
var router = express.Router();
var passport = require("passport");

const hook = require('./hook');
const checkout = require('./checkout');
const admin = require('./admin');

router.post('/hook/:hookId/abTest', hook.test);

router.post('/hook/:hookId/quiz', hook.quiz);

router.get('/cart', checkout.cart);

router.post('/cart/add', checkout.add);

router.post('/cart/update', checkout.update);

router.get('/checkout', checkout.checkout);

router.get('/admin', admin);

