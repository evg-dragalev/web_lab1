'use strict';

const POSTS_MAX_COUNT = 30;
const SEARCH_WORD = "New York";

$(document).ready(function(){

	var lastPostTime = 0;
	var responseData = [];
	var source = $("#photo-entry-template").html();

	var renderingPhotoPosts = function(){
		var template = Handlebars.compile(source);
		$('.loading').show();

		$.ajax({
	   		url: 'https://api.vk.com/method/photos.search?q='+SEARCH_WORD+'&sort=3&count=20&radius=5000&v=V',
	   		type: 'GET',
	   		dataType: 'jsonp',
	   		crossDomain: true,
	   		success: function(data){
	   			if (data.error){
	   				console.log("Server return error with code "+data.error.error_code+" : "+data.error.error_msg);
	   			} else if (data.response[0]==0) {
	   				console.log("Got empty array from server");
	   			} else {
				   		data.response.reverse().forEach( function(entity) {
						if (entity.pid && lastPostTime < entity.created){
							responseData.push(entity);
							lastPostTime = entity.created;
							entity.createTime = (new Date(entity.created*1000)).toLocaleString("ru",{
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								timezone: 'UTC',
								hour: 'numeric',
								minute: 'numeric',
								second: 'numeric'
							})
						}
						while (responseData.length > POSTS_MAX_COUNT){
							responseData.pop();
						}
					});
					console.log("Got data on search word "+SEARCH_WORD+" refreshing responseDatadata");
					console.log(responseData);
					$('.loading').hide();
					var html = template(responseData);
					$(".photo-entry").empty();
					$('.loaded-info').append(template({objects:responseData.reverse()}));
					responseData.reverse();
				}
			},
			error: function(jqXHR){
				if (400<=jqXHR && jqXHR < 500){
					console.log("Error "+jqXHR+" : client error");
				} else if (500<=jqXHR && jqXHR < 600){
					console.log("Error "+jqXHR+" : server error");
				} else {
					console.log("Error "+jqXHR+" : unknown error");
				}
				console.log("Cannot retrieve data from [https://api.vk.com]");
				$('.loading').hide();
			}
		});
	}

	renderingPhotoPosts(SEARCH_WORD);
	var timer = setTimeout(function repeat(){
			renderingPhotoPosts(SEARCH_WORD);
			timer = setTimeout(repeat, 30000);
		}, 30000);
})

/*
	$(".loading").hide();

	$("#search-act").on('submit', function(event){
		event.preventDefault();
		$(".loading").show();

		$(".photo-entry").empty();

		tag = $("#tag-filter").val();
		console.log("Tag "+tag+" submited!");

		while(responseData.length){
			responseData.pop();
		};

	});

	function httpGetPhotos(tag){
		$.ajax({
	   		url: 'https://api.vk.com/method/photos.search?q='+tag+'&count=20&v=V',
	   		type: 'GET',
	   		dataType: 'jsonp',
	   		crossDomain: true,
	   		success: function(data){
				console.log("Got data on tag "+tag+" refreshing responseDatadata");
	   			renderPhotoPosts(data);
				}
		})
	};
	
	function renderPhotoPosts(data){
		data.response.forEach ( function (entity) {
			if (entity.pid && lastPostTime < entity.created){
				responseData.push(entity);
				lastPostTime = entity.created;	
			}
			while (responseData.length > POSTS_MAX_COUNT){
				responseData.pop();
			}
		});
		console.log(responseData);
		$(".photo-entry").empty();
		var source = $("#photo-entry-template").html();
		var template = Handlebars.compile(source);
		$('.loaded-info').append(template({objects:responseData}));
	}

	httpGetPhotos(getTag());
	setInterval(httpGetPhotos(getTag()), 20000);
});
*/