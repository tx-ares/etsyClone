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
		// <img src={this.props.ListingModel.get('Images')[0].url_170x135} />
        // <h5>{this.props.ListingModel.get('title')}</h5>

		htmlString += '<div class="listing" id=' + listingsArr[i].get('listing_id') + '><img src="' + listingImgUrl + '">'
		htmlString += '<h5>' + listingTitle + '</h5>'
		htmlString += '<p class="style">' + listingsArr[i].get('tags')[0] + ', ' + listingsArr[i].get('tags')[1] + '</p>'
		htmlString += '<button class="plus">+</button><p class="price">$' + listingsArr[i].get('price') + '</p>'
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

		// console.log(singleListing.get('Images')[0].url_570xN)
		// console.log(singleListing)

		htmlString = ''

		htmlString += "<div class='listing singleListing'><img src=" + singleListing.get('Images')[0].url_570xN + ">"
		htmlString += "<h5>" + singleListing.get('title') + "</h5>"
		htmlString += '<p class="style">' + singleListing.get('tags')[0] + ', ' + singleListing.get('tags')[1] + ' <span class="price">$' + singleListing.get('price') +'</span></p>'
		htmlString += '<p class="description">' + singleListing.get('description') + '</p>'
		htmlString += "</div>"

		return htmlString
	},

	render: function(err){
		if (err){
			console.log("No search results found, please try again.")
		}
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

var AllListingsCollection = Backbone.Collection.extend({

	url: "https://openapi.etsy.com/v2/listings/active.js",
	_key: "k4v6u445o5n237im8b03002u",

	parse: function(rawJson){
		console.log(rawJson)
		return rawJson.results
	}
})

var ListingModel = Backbone.Model.extend({

	url: function() {
		return "https://openapi.etsy.com/v2/listings/" + this.listingId + ".js"
	},

	_key: "k4v6u445o5n237im8b03002u",

	parse: function(rawJson){

		return rawJson.results[0]
	},

	initialize: function(listingId) {
		this.listingId = listingId
		console.log(this.listingId, "<<<< Listing Model fired!")
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
		var allColl = new AllListingsCollection()
		allColl.fetch({
			dataType: 'jsonP',
			data: {
				includes: 'Images, Shop',
				api_key: allColl._key,
				keywords: 'rock music'
			}

		}).then(function(jsonResp){
			var allView = new AllListingsView(allColl) 
			// this.render()
		})
	},

	showItemListing: function(listingId) {
		console.log(listingId, "<<<<< listingId is ")
		console.log("Single item route fired!")
		var listingMod = new ListingModel(listingId)
		listingMod.fetch({
			dataType: 'jsonP',
			data: {
				includes: 'Images, Shop',
				api_key: listingMod._key,
				listing_id: listingId
			}

		}).then(function(jsonResp){
			var singleView = new SingleView(listingMod)
			// this.render()
		})
	},

	showSearchResults: function(keywords) {
		var searchColl = new AllListingsCollection()
		searchColl.fetch({
			dataType: 'jsonp',
			data: {
				api_key: searchColl._key,
				includes: "Images,Shop",
				keywords: keywords
			}
		}).then(function() {
			var allView = new AllListingsView(searchColl)

		})

	},

	initialize: function() {
		console.log("Initialize fired!")
		Backbone.history.start()
	}

})

var searchEnter = function(eventObj){
	if(eventObj.keyCode === 13) {
		console.log(eventObj.target.value)
		location.hash = "search/" + eventObj.target.value
		eventObj.target.value = ''
	}
}

document.querySelector(".searchBar").addEventListener('keydown', searchEnter)

var rtr = new Router()