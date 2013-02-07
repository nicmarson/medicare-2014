// Our Javascript Plugins

/*-------------------------------------------------------------------- 
 * JQuery Plugin: "EqualHeights" & "EqualWidths"
 * by:  Chris Coyier
 *
 * http://css-tricks.com/equal-height-blocks-in-rows/
--------------------------------------------------------------------*/

var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = new Array(),
     $el,
     topPosition = 0;

 $('.blocks').each(function() {

   $el = $(this);
   topPostion = $el.position().top;
   
   if (currentRowStart != topPostion) {

     // we just came to a new row.  Set all the heights on the completed row
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }

     // set the variables for the new row
     rowDivs.length = 0; // empty the array
     currentRowStart = topPostion;
     currentTallest = $el.height();
     rowDivs.push($el);

   } else {

     // another div on the current row.  Add it to the list and check if it's taller
     rowDivs.push($el);
     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);

  }
   
  // do the last row
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
   
 });

$(function() {
  
  // Position buttons in equal height containers
  $(".btn-container-bottom .btn-positioned").css({
    bottom: 0,
    left: 0,
    position: "absolute"
  });

  // Add visual toggle icons
  $('ol.breadcrumb a').after(' <span class="divider" role="separator">/</span>');
  $('[data-toggle="collapse"], [data-toggle="dropdown"]').append(' <b class="caret"></b>');
  $('nav#nav div.container').prepend('<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">'+
    '<span class="icon-bar"></span>'+
    '<span class="icon-bar"></span>'+
    '<span class="icon-bar"></span>'+
  '</a>');

  // If browser doesn't support autofocus
  // Then focus on input with autofocus attr
  if (!Modernizr.input.autofocus) {
    $('input[autofocus]').focus();
  }

});
