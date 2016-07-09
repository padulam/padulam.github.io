$('button').click(function() {
	$.ajax({
		url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=quoteGenerator',
		type: 'GET',
		dataType: 'jsonp',
	});
});

function quoteGenerator(rsp){
	let data = rsp[0];
	let quote = $(data.content).html();

	if($("#quote").html()!==""){
		$("#quote").fadeOut('slow', function() {
			$(this).html(quote);
			$(this).fadeIn('fast');
		});
		
		$("#author").fadeOut('slow', function() {
			$(this).html(data.title);
			$(this).fadeIn('fast');
		});
	} else{
		$("#quote").fadeOut('fast', function() {
			$(this).html(quote);
			$(this).fadeIn('fast');
		});
		
		$("#author").fadeOut('fast', function() {
			$(this).html(data.title);
			$(this).fadeIn('fast');
		});

		$('#tweet-quote').css('visibility', 'visible');
	}
	$('#tweet-quote').attr('href', "https://twitter.com/intent/tweet?text=" + encodeURI(quote) + "- " 
		+ data.title);
}