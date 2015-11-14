$(document).on('ready', function() {
	bindEvents();
});

function bindEvents() {
	$('#search-form').on('submit', onSearchFormSubmit);
	$('#search-input').on('keyup', onKeyInInput);
	$('body').on('mouseenter', '.search-item',overSearches);
	$('body').on('mouseleave', '.search-item',offSearches);
	$('body').on('click', '.search-item .remove-search',onRemoveClick);
	$('body').on('keydown', stepThroughResults);
	$('body').on('click', '#search-results li', onSearchResultClick);
	$('body').on('mouseenter', '#search-results li', overSearchResults);
	$('body').on('mouseleave', '#search-results li', offSearchResults);
}

function onKeyInInput(e) {
	if(e.keyCode == 40) {
		setFocusOnSearchResults();
		return;
	}
	if($('#search-input').val().length > 2) {
		getData($('#search-input').val());
	}
}

function setFocusOnSearchResults() {
	$('#search-input').blur();
	$('#search-results').children('li:first-child').addClass('active');
}

function stepThroughResults(e) {
	var
		$activeItem = $('#search-results').find('li.active'),
		$next,
		$previous;

	if($activeItem.length > 0) {
		if (e.keyCode == 40) {//down
			$next = $activeItem.next('li');

			if($next.length > 0) {
				$activeItem.removeClass('active');
				$next.addClass('active');
			}
		} else if(e.keyCode == 38) { //up
			$previous = $activeItem.prev('li');
			if($previous.length > 0) {
				$activeItem.removeClass('active');
				$previous.addClass('active');
			}
		} else if(e.keyCode == 13) {
			setSearchBoxValue($activeItem.text());
		}
	}
}

function onSearchResultClick(e) {
	var
		$target = $(e.target);

	setSearchBoxValue($target.text());
	onSearchFormSubmit();
}

function getData(value, callback) {
	callback = callback || function() {};

	var url = 'http://api.openweathermap.org/data/2.5/find?q=' + value + '&type=like&mode=json&appid=7a68049f2651ce7a5f0c51fc6ac3adce';
	$.ajax({
		url: url,
		type: "GET",
		dataType: 'jsonp',
		cache: false,
		success: function(response){
			callback(filterResponse(response));
			return;
		}
	});
}

function filterResponse(res, param) {
	var items = res['list'];

	$('#search-results').empty();
	for(var i in items) {
		createResultItem(items[i]);
	}
}

function createResultItem(item) {
	var
		$search_results = $('#search-results');

	$search_results.find('li').removeClass('active');
	$search_results.prepend('<li>' + item.name + '</li>');
}

function onSearchFormSubmit() {
	createSearchItem(getSearchBoxValue());
	$('#search-input').val('');
	$('#search-results').empty();
	return false;
}

function overSearches(e) {
	e.preventDefault();
	toggleSearchItem($(e.target), true);
}
function offSearches(e) {
	e.preventDefault();
	toggleSearchItem($(e.target), false);
}

function onRemoveClick(e) {
	e.preventDefault();
	removeItem($(e.target));
}
function toggleSearchItem($target, condition){
	$('#search-list').find('.search-item').removeClass('active');

	if(!$target.hasClass('search-item')) {
		$target = $target.closest('.search-item');
	}
	if(condition) {
		$target.addClass('active');
	} else {
		$target.removeClass('active');
	}
}
function overSearchResults(e) {
	var
		$target = $(e.target);

	toggleActiveSearchResult($target, true)
}
function offSearchResults(e) {
	var
		$target = $(e.target);

	toggleActiveSearchResult($target, false)
}
function toggleActiveSearchResult($target, condition) {

	$('#search-results').find('li').removeClass('active');
	if(condition) {
		$target.addClass('active');
	} else {
		$target.removeClass('active');
	}
}

function getSearchBoxValue() {
	return $('#search-input').val();
}

function setSearchBoxValue(value) {
	$('#search-input').val(value).focus();
}

function createSearchItem(value) {
	var
		$ul     = $('#search-list'),
		$li     = $('<li/>').addClass('search-item'),
		$p      = $('<p/>'),
		$button = $('<button/>').attr({
						type:  'submit',
						name:  'remove-search-item'
					}).addClass('remove-search').text('Delete'),
		$time   = $('<span>').addClass('time'),
		$date   = $('<span>').addClass('date'),

		dt      = new Date(),
		date    = dt.getFullYear() + "-" + dt.getMonth() + "-" + formatTime(dt.getDay()),
		time    = dt.getHours() + ":" + formatTime(dt.getMinutes());

	if($ul.length < 1) {
		$ul = $('<ul>').addClass('search-list').attr('id', 'search-list');
		$('#searches').addClass('visible').append($ul);
	}
		$li.append($p.text(value)).append($date.text(date)).append($time.text(time)).append($button);
	$ul.prepend($li);
}

function removeItem($target){
	if(!$target.hasClass('search-item')) {
		$target = $target.closest('.search-item');
	}

	$target.addClass('removing');
	setTimeout(function(){
		$target.remove();
		if($('#search-list').children('li').length < 1) {
			$('#search-list').remove();
			$('#searches').removeClass('visible');
		}
	},500);
}

function formatTime(number) {
	if(number < 10){
		return '0'+ number;
	} else {
		return number;
	}
}