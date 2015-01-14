
/*	Define Click Event for Mobile */
	if( 'ontouchstart' in window ){ var click = 'touchstart'; }
	else { var click = 'click'; }



	
	/*	Reveal Menu */
	$('div.button').on(click, function(){
		if( !$('div.content').hasClass('inactive') ){

		
			// Slide and scale content
			$('div.content').addClass('inactive');
			setTimeout(function(){ $('div.content').addClass('flag'); }, 100);
			
			// Change status bar
			$('div.status').fadeOut(100, function(){
				$(this).toggleClass('active').fadeIn(300);
			});
			
			// Slide in menu links
			var timer = 0;
			$.each($('li'), function(i,v){
				timer = 40 * i;
				setTimeout(function(){
					$(v).addClass('visible');
				}, timer);
			});
		}
	});
	
	

	/*	Close Menu */
	function closeMenu() {		
		// Slide and scale content
		$('div.content').removeClass('inactive flag');
		
		// Change status bar
		$('div.status').fadeOut(100, function(){
			$(this).toggleClass('active').fadeIn(300);
		});
		
		// Reset menu
		setTimeout(function(){
			$('li').removeClass('visible');
		}, 300);
	}
	
	$('div.content').on(click, function(){
		if( $('div.content').hasClass('flag') ){
			closeMenu();
		}
	});
	$('#buttonSettings').on(click, function(e){
		e.preventDefault();
		closeMenu();
		window.location = "settings.html";
	});
	$('#buttonHome').on(click, function(e){
		e.preventDefault();
		closeMenu();
		window.location = "index.html";
		
	});

	$('#buttonSteps').on(click, function(e){
		e.preventDefault();
		closeMenu();
		window.location = "new_tell_me_more.html";
		
	});
	$('#buttonSchedule').on(click, function(e){
		e.preventDefault();
		closeMenu();
		window.location = "schedule.html";
		
	});
	$('#buttonNotification').on(click, function(e){
		e.preventDefault();
		closeMenu();
		var who=window.localStorage.getItem('distinction');
		if(who==1)
		{
		
			window.location = "notify_teacher.html";	
		}
		else
		{
		 	window.location = "notify_student.html";	
		}
		
		
	});
	$('#buttonDevice').on(click, function(e){
		e.preventDefault();
		closeMenu();
		window.location = "new_sync.html";
		
	});
	$('#buttonQuit').on(click, function(e){
		e.preventDefault();
		closeMenu();
		window.location = "welcome.html";
		
	});
