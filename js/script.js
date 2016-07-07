//Step 1 - Load dependencies jQuery, Underscore, Backbone.

//Step 2 - Define Router and routes.

//Step 3 - Connect to api for 1st time via collection.

//Step 4 - Render Home View.

console.log("Hello wurld!")
console.log($)

var AllListingsView = Backbone.View.extend({

	el: "#container",

	events: {
		'click .listing': '_navToItem'  
	},

	_navToItem: function(evt){

		// console.log(evt)
		var listingId = evt.currentTarget.getAttribute('id')
		console.log(listingId, "<<<<<< listingId is ")

		location.hash = 'itemListing/' + listingId
	},

	_buildTemplate: function(modelArr){

		var listingsArr = modelArr

		htmlString = ''

		for(var i = 0; i < listingsArr.length; i++){

		var listingImgUrl = listingsArr[i].get('Images')[0].url_570xN
		var listingTitle = listingsArr[i].get('title')

		// Take note of using .get here, refer to my evernote.
		// <img src={this.props.listingModel.get('Images')[0].url_170x135} />
        // <h5>{this.props.listingModel.get('title')}</h5>

		htmlString += '<div class="listing" id=' + listingsArr[i].get('listing_id') + '><img src="' + listingImgUrl + '">'
		htmlString += '<h5>' + listingTitle + '</h5>'
		htmlString += '<p><button>+</button></p>'
		htmlString += '</div>'


		console.log("Build template fired!")
		console.log(modelArr)
		}

		return htmlString
	},

	render: function(){
		console.log("Render fired!")
		this.el.innerHTML = this._buildTemplate(this.ac.models)
	},

	initialize: function(allColl){
		console.log("AllListingsView initialize fired!")
		this.ac = allColl
		this.render()
	}

})

var SingleView = Backbone.View.extend({

	el: "#container",


	_buildTemplate: function(listingMod){

		var singleListing = listingMod

		console.log(singleListing)
		
		htmlString = ''

		htmlString += "<h2> ZAMN BABY!@@!!</h2>"

		return htmlString
	},

	render: function(){
		console.log("Single Render fired!")
		this.el.innerHTML = this._buildTemplate(this.listMod)
	},

	initialize: function(listingMod){
		this.listMod = listingMod
		

		// console.log("Collection passed into single View!")
		// this.ac = allColl
		// console.log(this.ac)
		this.render()
	}

})

var allListingsCollection = Backbone.Collection.extend({

	url: "https://openapi.etsy.com/v2/listings/active.js",
	_key: "k4v6u445o5n237im8b03002u",

	parse: function(rawJson){
		console.log(rawJson)
		return rawJson.results
	}
})

var listingModel = Backbone.Model.extend({

	url: "https://openapi.etsy.com/v2/listings/" + this.itemId + ".js",
	_key: "k4v6u445o5n237im8b03002u",

	parse: function(rawJson){
		// console.log(rawJson)
		return rawJson.results[0]
	},

	initialize: function(listingId) {
		this.itemId = listingId
		console.log(this.itemId, "<<<< Listing Model fired!")
	}


})

var Router = Backbone.Router.extend({

	routes: {
		"home" : "showAllListings",
		"search/:inputSearch": "showSearchResults",
		"itemListing/:listing_id" : "showItemListing",
		"*default": "redirect"
	},

	redirect: function() {
		location.hash = 'home'
	},

	showAllListings: function() {
		console.log("Routed to showAllListings")
		var allColl = new allListingsCollection()
		allColl.fetch({
			dataType: 'jsonP',
			data: {
				includes: 'Images, Shop',
				api_key: allColl._key
			}

		}).then(function(jsonResp){
			var allView = new AllListingsView(allColl) 
			// this.render()
		})
	},

	showItemListing: function(itemId) {
		console.log(itemId, "<<<<< itemId is ")
		console.log("Single item route fired!")
		var listingMod = new listingModel(itemId)
		listingMod.fetch({
			dataType: 'jsonP',
			data: {
				includes: 'Images, Shop',
				api_key: listingMod._key,
				listing_id: itemId
			}

		}).then(function(jsonResp){
			var singleView = new SingleView(listingMod)
			// this.render()
		})
	},

	initialize: function() {
		console.log("Initialize fired!")
		Backbone.history.start()
	}

})

var rtr = new Router()