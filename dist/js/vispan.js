(function($){ $.fn.vispan = function(options) {
return this.each(function(index) {

	// 	SETTINGS
	// --------------------------------------------------

	var settings = $.extend({
		scroll_duration: 400,
		back_to_top_duration: 1000,
		slide_change_duration: 500,
		dead_zone: 0.1,
		shadow_overlay_opacity: 0,
		button_toggle_duration: 200,
		refresh_interval: 100
	}, options);


	// 	INIT
	// --------------------------------------------------

	var maxWidth = $(this).width();

	// Lets do some prep work
	$(this).children().each(function(index) {
		$(this).addClass('vispan-slide').css('width', maxWidth);
		if(index === 0) {
			$(this).addClass('vispan-current');
		}
	});
	$(this).append('<div class="vispan-shadow"></div>');
	$(this).addClass('vispan').wrapInner('<div class="vispan-frame" />').append('<div class="vispan-btn-previous">&lsaquo;</div><div class="vispan-btn-next">&rsaquo;</div>');


	// Temporarily store this for use in scroller class
	var parent = $(this);
	var frame = $(this).children('.vispan-frame:first');

	// Frame height same as this
	frame.height($(this).height());


	// 	SCROLLER CLASS
	// --------------------------------------------------
	var scroller = new function() {
		
		// Constants
		this.parent = parent;
		this.frame = frame;
		this.frame_top = this.frame.offset().top;
		this.frame_left = this.frame.offset().left;		
		this.slide = {
			current: this.frame.children('.vispan-current:first')
		};
		this.shadow = this.frame.children('.vispan-shadow:first');
		this.button = {
			previous: this.parent.children('.vispan-btn-previous:first'),
			next: this.parent.children('.vispan-btn-next:first'),
			width: $('.vispan-btn-previous:first').width()
		};

		// Variables
		this.wait = false;
		this.mouse_x = 0;
		this.mouse_y = 0;
		this.destination = {
			scale: 0,
			px: 0
		};
		
	}; // End of scroller class


	// 	MOUSEMOVE
	// --------------------------------------------------
    scroller.frame.mousemove(function(e) {
		
		if( ! scroller.wait) {
			
			// Mousemove is called every single time the mouse moves
			// We only want to check at intervals
			// Or it would get really laggy
			setTimeout(function() {
				scroller.wait = false;
			}, settings.refresh_interval);
			scroller.wait = true;
			
			// Record the mouse's Y coord
			scroller.mouse_y = e.pageY;
			
			// Adjust it
			scroller.mouse_y = ((e.pageY - scroller.frame_top) - (settings.dead_zone * scroller.frame.height()));
			
			// Calculate the destination on a scale of 0 to 1
			scroller.destination.scale = (scroller.mouse_y / (scroller.frame.height() * (1 - (settings.dead_zone * 2))));
			if(scroller.destination.scale < 0) {
				scroller.destination.scale = 0;
			}
			else if(scroller.destination.scale > 1) {
				scroller.destination.scale = 1;
			}
			
			// The destination in pixels
			scroller.destination.px = scroller.destination.scale * (scroller.slide.current.height() - scroller.frame.height());
			
			// Scroll to the destination..
			scroller.frame.stop().animate({
				scrollTop: scroller.destination.px
			}, settings.scroll_duration);

		} // if( ! scroller.wait)
		
		// Record the mouse's X coord
		this.mouse_x = e.pageX - scroller.frame_left;
		
		// If the mouse is near the left hand side..
		if(this.mouse_x <= (scroller.button_width + 25)) {
			show_button('previous');
		}
		else {
			hide_button('previous');
		}
		
		// If the mouse is near the right hand side..
		if(this.mouse_x >= (scroller.frame.width() - (scroller.button_width + 25))) {
			show_button('next');
		}
		else {
			hide_button('next');
		}
		
    }); // scroller.frame.mousemove()
	
	
	// 	MOUSE LEAVE
	// --------------------------------------------------
	scroller.frame.mouseleave(function() {
		back_to_top();
	}); // scroller.frame.mouseout()

	scroller.parent.mouseleave(function() {
		hide_button('next');
		hide_button('previous');
	});
	
	
	// 	CLICK
	// --------------------------------------------------
	scroller.button.previous.click(function(e) {
		e.preventDefault();						  
		change_slide('previous');
	});

	scroller.button.next.click(function(e) {
		e.preventDefault();
		change_slide('next');
	});
	
	
	// 	FUNCTIONS
	// --------------------------------------------------

	function back_to_top() {
		// Scroll to top
		scroller.frame.stop().animate({
			scrollTop: 0
		}, settings.back_to_top_duration);
	}


	function show_button(which) {
		if(which == 'previous') {
			scroller.button.previous.stop().animate({
				left: 0
			}, settings.button_toggle_duration);
		}
		else if(which == 'next') {
			scroller.button.next.stop().animate({
				right: 0
			}, settings.button_toggle_duration);
		}
	} // show_button()


	function hide_button(which) {
		if(which == 'previous') {
			scroller.button.previous.stop().animate({
				left: - (scroller.button_width + 50)
			}, settings.button_toggle_duration);
		}
		else if(which == 'next') {
			scroller.button.next.stop().animate({
				right: - (scroller.button_width + 50)
			}, settings.button_toggle_duration);
		}
	} // show_button()


	function change_slide(which) {
		
		// Scroll back to the top
		back_to_top();
		
		// Next or previous?
		if(which == 'next') {
			// What's next?
			scroller.slide.next = scroller.slide.current.next('.vispan-slide');
			if(scroller.slide.next.length <= 0) {
				// If there are no more slides go back to the start..
				scroller.slide.next = scroller.frame.children('.vispan-slide:first');
			}
		}
		else {
			// What's next?
			scroller.slide.next = scroller.slide.current.prev('.vispan-slide');
			if(scroller.slide.next.length <= 0) {
				// If there are no more pages go back to the start..
				scroller.slide.next = scroller.frame.children('.vispan-slide:last');
			}
		}
		
		// Prepare the next page
		scroller.slide.next.addClass('vispan-next');
		
		// Add a fading shadow effect as the page turns
		scroller.shadow.css('opacity', settings.shadow_overlay_opacity).fadeOut(settings.slide_change_duration);


		// Next or previous?
		if(which == 'next') {
			a = - scroller.frame.width();
		}
		else {
			a = scroller.frame.width();
		}
		
		// Turn the page..
		scroller.slide.current.animate({
			marginLeft: a
		}, settings.slide_change_duration, function() {
			
			// Bring the shadow back so we can use it again
			scroller.shadow.css('opacity', scroller.shadow.opacity ).show();
			
			// Reset the slide
			scroller.slide.current.css('marginLeft', 0).removeClass('vispan-current');
			
			// Change the current slide
			scroller.slide.current = scroller.slide.next;
			scroller.slide.current.removeClass('vispan-next').addClass('vispan-current');
			
		});
	} // change_slide() 
}); // return this.each()
}; /* $.fn.vispan */ })(jQuery);