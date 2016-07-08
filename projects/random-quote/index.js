$('button').click(function() {
	$.ajax({
		url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=quoteGenerator',
		type: 'GET',
		dataType: 'jsonp',
	});
});

function quoteGenerator(rsp){
	let data = rsp[0];

	if($("#quote").html()!==""){
		$("#quote").fadeOut('slow', function() {
			$(this).html(data.content);
			$(this).fadeIn('fast');
		});
		
		$("#author").fadeOut('slow', function() {
			$(this).html(data.title);
			$(this).fadeIn('fast');
		});
	} else{
		$("#quote").fadeOut('fast', function() {
			$(this).html(data.content);
			$(this).fadeIn('fast');
		});
		
		$("#author").fadeOut('fast', function() {
			$(this).html(data.title);
			$(this).fadeIn('fast');
			$('#tweet-quote').attr('href', "https://twitter.com/intent/tweet?text=" + data.content + "- " 
		+ data.title).css('visibility', 'visible');
		});
	}
}