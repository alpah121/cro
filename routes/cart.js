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
	//check that item id exists in table
	let id = connection.escape(req.body.id);
	let qty = connection.escape(req.body.qty);
	let existInTable = await sql("SELECT * FROM products WHERE ID='" + id + "';"); 
	if (existInTable.length == 1 && req.session.items.filter(compare(id)).length == 0 && !isNaN(qty))
		{
		//add number to session
		req.session.items.push({"id" : id,"qty" : qty});
		}
	};

module.exports.
