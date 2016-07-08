$('button').click(function() {
	$.ajax({
		url: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?',
		type: 'GET',
		dataType: 'json',
		success: function(data){
			if($("#quote").html()!==""){
				$("#quote").fadeOut('slow', function() {
					$(this).html(data.quoteText);
					$(this).fadeIn('fast');
				});
				
				$("#author").fadeOut('slow', function() {
					$(this).html(data.quoteAuthor);
					$(this).fadeIn('fast');
				});
			} else{
				$("#quote").fadeOut('fast', function() {
					$(this).html(data.quoteText);
					$(this).fadeIn('fast');
				});
				
				$("#author").fadeOut('fast', function() {
					$(this).html(data.quoteAuthor);
					$(this).fadeIn('fast');
					$('#tweet-quote').attr('href', "https://twitter.com/intent/tweet?text=" + data.quoteText + "- " 
				+ data.quoteAuthor).css('visibility', 'visible');
				});
			}
		}
	});
});