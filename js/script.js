//Step 1 - Load dependencies jQuery, Underscore, Backbone.

//Step 2 - Define Router and routes.

//Step 3 - Connect to api for 1st time via collection.

//Step 4 - Render Home View.

console.log("Hello wurld!")
console.log($)

var AllListingsView = Backbone.View.extend({

	el: "#container",

	events: {
		'click .itemContainer': '_navToItem'  
	},

	_navToItem: function(evt){

		var listingId = evt.currentTarget.getAttribute('id')

		location.hash = 'itemListing/' + listingId
	},

	_buildTemplate: function(modelArr){

		var listingsArr = modelArr

		htmlString = ''


		for(var i = 0; i < listingsArr.length; i++){

		console.log(listingsArr[i].attributes.Images[0])
		console.log(listingsArr[i].attributes)
		var listingImgUrl = listingsArr[i].attributes.Images[0].url_570xN
		var listingTitle = listingsArr[i].attributes.title

		// Take note of using .get here, refer to my evernote.
		// <img src={this.props.listingModel.get('Images')[0].url_170x135} />
        // <h5>{this.props.listingModel.get('title')}</h5>

		htmlString += '<div class="listing"><img src="' + listingImgUrl + '">'
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

var allListingsCollection = Backbone.Collection.extend({

	url: "https://openapi.etsy.com/v2/listings/active.js",
	_key: "k4v6u445o5n237im8b03002u",

	parse: function(rawJson){
		console.log(rawJson)
		return rawJson.results
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
		})
	},

	initialize: function() {
		console.log("Initialize fired!")
		Backbone.history.start()
	}

})

var rtr = new Router()