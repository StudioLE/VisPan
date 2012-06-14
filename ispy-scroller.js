
//  DEVELOPED BY LAURENCE ELSDON
//  for iSpyCreativity.com
//  If you like my code: hi@ispycreativity.com
// --------------------------------------------------
(function($){

	var methods = {


		// 	INIT
		// --------------------------------------------------
		init: function(options) { 
			
			var settings = $.extend({
				'location': 'top',
				'background-color': 'blue'
			}, options);

			var maxWidth = this.width();

			// Lets do some prep work
			this.children().each(function(index) {
				$(this).addClass('ispy-scroller-slide').css('width', maxWidth);
				if(index === 0) {
					$(this).addClass('ispy-scroller-current');
				}
			});
			this.append('<div class="ispy-scroller-shadow"></div>');
			this.addClass('ispy-scroller').wrapInner('<div class="ispy-scroller-frame" />').append('<div class="ispy-scroller-btn-previous">&lsaquo;</div><div class="ispy-scroller-btn-next">&rsaquo;</div>');


			// Temporarily store this for use in scroller class
			var frame = this.children('.ispy-scroller-frame:first');

			frame.height(this.height());

			/**
			 * Scroller class
			 */
			var scroller = new function() {
				
				// Config
				this.duration = {
					intervals: 100,
					animation: 400,
					back_to_top: 1000,
					turn_slide: 500
				};
				this.deadzone = 0.1;
				this.shadow = {
					opacity: 0//0.5
				};
				// Constants
				this.frame = frame;
				this.frametop = this.frame.offset().top;
				this.frameleft = this.frame.offset().left;		
				this.slide = {
					current: this.frame.children('.ispy-scroller-current:first')
				};
				this.shadow.div = this.frame.children('.ispy-scroller-shadow:first');
				this.button_width = $('.ispy-scroller-btn-previous').width();
				// Variables
				this.wait = false;
				this.mouse_x = 0;
				this.mouse_y = 0;
				this.destination = {
					scale: 0,
					px: 0
				};
				
			}; // End of scroller class

			/**
			 * When mouse moves on the scroller
			 */
		    scroller.frame.mousemove(function(e) {
				
				if( ! scroller.wait) {
					
					// Mousemove is called every single time the mouse moves
					// We only want to check at intervals
					// Or it would get really laggy
					setTimeout(function() {
						scroller.wait = false;
					}, scroller.duration.intervals);
					scroller.wait = true;
					
					// Record the mouse's Y coord
					scroller.mouse_y = e.pageY;
					
					// Adjust it
					scroller.mouse_y = ((e.pageY-scroller.frametop) - (scroller.deadzone * scroller.frame.height()));
					
					// Calculate the destination on a scale of 0 to 1
					scroller.destination.scale = (scroller.mouse_y / (scroller.frame.height() * (1 - (scroller.deadzone * 2))));
					if(scroller.destination.scale < 0) {
						scroller.destination.scale = 0;
					}
					else if(scroller.destination.scale > 1) {
						scroller.destination.scale = 1;
					}
					
					// The destination in pixels
					scroller.destination.px = scroller.destination.scale * (scroller.slide.current.height() - scroller.frame.height());
					
					// Scroll to the destination..
					scroller.frame.stop().scrollTo(scroller.destination.px, scroller.duration.animation, {
						easing: 'easeOutCubic',
						axis: 'y'
					});
				} // if( ! scroller.wait)
				
				// Record the mouse's X coord
				this.mouse_x = e.pageX-scroller.frameleft;
				
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
			
			
			/**
			 * When the mouse leaves the scroller-frame
			 */
			scroller.frame.mouseleave(function() {
				back_to_top();
			}); // scroller.frame.mouseout()
			

			/**
			 * When the mouse leaves the scroller
			 */
			$('.ispy-scroller').mouseleave(function() {
				hide_button('next');
				hide_button('previous');
			})

			function back_to_top() {
				// Scroll to top
				scroller.frame.stop().scrollTo(0, scroller.duration.back_to_top, {
					easing: 'easeOutCubic'
				});
			}

			function show_button(which) {
				if(which == 'previous') {
					$('.ispy-scroller-btn-previous').stop().animate({
						left: 0
					}, 200);
				}
				else if(which == 'next') {
					$('.ispy-scroller-btn-next').stop().animate({
						right: 0
					}, 200);
				}
			} // show_button()


			function hide_button(which) {
				if(which == 'previous') {
					$('.ispy-scroller-btn-previous').stop().animate({
						left: - (scroller.button_width + 50)
					}, 200);
				}
				else if(which == 'next') {
					$('.ispy-scroller-btn-next').stop().animate({
						right: - (scroller.button_width + 50)
					}, 200);
				}
			} // show_button()
			
			
			/**
			 * Change slide
			 */
			function change_slide(which) {
				
				// Scroll back to the top
				back_to_top();
				
				// Next or previous?
				if(which == 'next') {
					// What's next?
					scroller.slide.next = scroller.slide.current.next('.ispy-scroller-slide');
					if(scroller.slide.next.length <= 0) {
						// If there are no more slides go back to the start..
						scroller.slide.next = $('.ispy-scroller-slide:first');
					}
				}
				else {
					// What's next?
					scroller.slide.next = scroller.slide.current.prev('.ispy-scroller-slide');
					if(scroller.slide.next.length <= 0) {
						// If there are no more pages go back to the start..
						scroller.slide.next = $('.ispy-scroller-slide:last');
					}
				}
				
				// Prepare the next page
				scroller.slide.next.addClass('ispy-scroller-next');
				
				// Add a fading shadow effect as the page turns
				scroller.shadow.div.css('opacity', scroller.shadow.opacity).fadeOut(scroller.duration.turn_slide);
				


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
				}, scroller.duration.turn_slide, function() {
					// Bring the shadow back so we can use it again
					scroller.shadow.div.css('opacity', scroller.shadow.opacity ).show();
					
					// Reset the slide
					scroller.slide.current.css('marginLeft', 0).removeClass('ispy-scroller-current');
					
					// Change the current slide
					scroller.slide.current = scroller.slide.next;
					scroller.slide.current.removeClass('ispy-scroller-next').addClass('ispy-scroller-current');
					
				});
			} // change_slide()
	
	
			/**
			 * When next button is clicked
			 */
			$('.ispy-scroller-btn-next').click(function(e) {
				e.preventDefault();
				change_slide('next');
			});
			
			/**
			 * When previous button is clicked
			 */
			$('.ispy-scroller-btn-previous').click(function(e) {
				e.preventDefault();						  
				change_slide('previous');
			});

		}, // init

		// 	NEXT
		// --------------------------------------------------
		next: function( ) {

			console.log(scroller);
			
		}, // next

		// 	PREVIOUS
		// --------------------------------------------------
		previous: function( ) { 
			
		} //previous
	}; // methods

	$.fn.ispyscroller = function(method) {

		// Method calling logic
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		}

		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}

		else {
			$.error('Method ' +  method + ' does not exist on jQuery.ispyscroller');
		}    

	}; // $.fn.ispyscroller

})(jQuery);

// calls the init method
$('#ispy-scroller').ispyscroller();