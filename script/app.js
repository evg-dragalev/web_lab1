'use strict';

const POSTS_MAX_COUNT = 30;
const SEARCH_WORD = "Привет"

var responseData = [];

var lastPostTime = 0;
	var source = $("#photo-entry-template").html();
	var template = Handlebars.compile(source);

var counterNew = {
	value: 0,
	add: function(){
		this.value++;
		this.display();
		$('.refresher').css('background-color', '#D7FFD9');
	},
	reset: function(){
		this.value = 0;
		this.display();
		$('.refresher').css('background-color', '#CFE7FB');
	},
	display: function(){
		$('.refresher').empty();
		$('.refresher').append("<p>"+counterNew.value+"</p>");
	}
}

var displayedOnce = false;


function refresher(responseData){
	var html = template(responseData);
	$(".photo-entry").empty();
	$('.loaded-info').append(template({objects:responseData.reverse()}));
	counterNew.reset();
}

function onRefreshButtonClick(){
	console.log("tapped!")
	if (counterNew.value > 0){
		refresher(responseData);
	}
}

function renderingPhotoPosts (){
	$('.refresher').css('background-image', 'url(../img/progress.gif)');
	
	$.ajax({
   		url: 'https://api.vk.com/method/photos.search?q='+SEARCH_WORD+'&sort=3&count=20&radius=5000&v=V',
   		type: 'GET',
   		dataType: 'jsonp',
   		crossDomain: true,
   		success: function(data){
   			if (data.error){
				$('.refresher').css('background-color', '#FFDBDB');
   				console.log("Server returned error with code "+data.error.error_code+" : "+data.error.error_msg);
   			} else if (data.response[0]==0) {
   				console.log("Got empty array from api. Wait for a while");
   			} else {
				$('.refresher').css('background-color', '#CFE7FB');
			   	data.response.reverse().forEach( function(entity) {
				if (entity.pid && lastPostTime < entity.created){
					responseData.reverse();
					responseData.push(entity);
					counterNew.add();							lastPostTime = entity.created;
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
				responseData.reverse();
				while (responseData.length > POSTS_MAX_COUNT){
					responseData.pop();
				}
				$('.refresher').css('background-image', 'none');
				});
				console.log("Got data on search word "+SEARCH_WORD+" refreshing responseDatadata");
				console.log(responseData);
				if (!displayedOnce){
					refresher(responseData);
					displayedOnce = true;
				}
			}
		},
		error: function(jqXHR){
			$('.refresher').css('background-color', '#FFDBDB');
			if (400<=jqXHR.status && jqXHR.status < 500){
				console.log("Error "+jqXHR.status+" : client error");
			} else if (500<=jqXHR.status && jqXHR.status < 600){
				console.log("Error "+jqXHR.status+" : server error");
			} else {
				console.log("Error "+jqXHR.status+" : unknown error");
			}
			console.log("Cannot retrieve data from [https://api.vk.com]");
			$('.refresher').css('background-image', 'none');
		}
	});
}

$(document).ready(function(){	

renderingPhotoPosts(SEARCH_WORD);
var timer = setTimeout(function repeat(){
		$('.refresher').css('background-image', 'url(../img/progress.gif);');
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