/*
---Checkout---
cart-get, add-post, update-post, checkout-get, checkout-post

*/
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'pi',
	password: 'password',
	database: 'templates'
});

connection.connect();

function sql(sql)
{
return new Promise(function(resolve, reject) 
{
	connection.query(sql, function(error, results, fields) 
		{
		if (error) 
			{
			reject(error);
			}
		else
			{
			resolve(results);
			}
		});
	});
}

//let pages = await sql("SELECT * FROM " + table + " WHERE title = '" + req.params.campaignTitle + "';");	

module.exports.cart = async (req, res) => {
	var items = req.session.items.filter(function(item) 
		{
		return item.qty > 0;
		});
	res.render('cart', {"items" : items});
	};

function compare(item)
{
return (compareTo) => 
	{
	return item == compareTo.id;	
	}
}

module.exports.add = async (req, res) => {
if (typeof req.body != "undefined" && req.body.id && req.body.qty)
	{
	let id = connection.escape(req.body.id);
	let qty = connection.escape(req.body.qty);
	let existInTable = await sql("SELECT * FROM products WHERE ID='" + id + "';"); 
	if (existInTable.length == 1 && req.session.items.filter(compare(id)).length == 0 && !isNaN(qty))
		{
		//add number to session
		req.session.items.push({"id" : id,"qty" : qty});
		}
	}
};

function changeQty(selector, toQty)
{
return (item) =>
	{
	if (item.id == selector)
		{
		return {"id" : id, "qty" : toQty};	
		}
	else
		{
		return item;	
		}
	}
}

function removeItem(id)
{
return (item) => 
	{
	return item.id != id;	
	}	
}

module.exports.update = async (req, res) => {
if (typeof req.body != "undefined" && req.body.id && req.body.qty)
	{
	let id = connection.escape(req.body.id);
	let qty = connection.escape(req.body.qty);
	let existInTable = await sql("SELECT * FROM products WHERE ID='" + id + "';");
	if (existInTable.length == 1 && req.session.items.filter(compare(id)).length == 1 && !isNaN(qty))
		{
		if (qty > 0)
			{
			req.session.items = req.session.items.map(changeQty(id, qty));	
			res.json({"hasError": false, "message": "successfully changed quantity of item"});
			}
		else
			{
			req.session.items = req.session.items.filter(removeItem(id));	
			res.json({"hasError": false, "message": "successfully removed item from cart"});
			}
		}
	else
		{
		res.json({"hasError": true, "message": "an error occured."});	
		}
	}
};

module.exports.total = (req, res) => {
if (typeof req.session.items != "undefined" && req.session.items.length >= 1)
	{
	res.render('total', {"items" : req.session.items});	
	}
else
	{
	res.redirect('/pricing');	
	}
}

module.exports.success = (req, res) => {
const sig = request.headers['stripe-signature'];

let event;

try {
	event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
	} 
catch(err)
	{
	return response.status(400).send('Webhook Error: ${err.message}');	
	}
	
if (event.type === 'checkout.session.completed')
	{
	const session = event.data.object;
	
	//email to download the digital product
	console.log(session);
	}
response.json({received: true});
}
