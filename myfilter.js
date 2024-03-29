$(document).ready(function() {
 var $container = $(".container"); // the container with all the elements to filter inside
 var filters = {}; //should be outside the scope of the filtering function
 /* --- read the documentation on isotope.metafizzy.co for more options --- */
 var $grid = $container.isotope({
   layoutMode: 'fitRows',
   itemSelector: ".chara", // the elements to filter
   getSortData: {name: '[name]'}, 
   sortBy: 'name', 
   percentPosition: true // put true if you use percentage widths, otherwise put false
 });
 
 $grid.imagesLoaded().progress( function() {
        $grid.isotope('layout');
    });
 
 $(".option-set a").click(function(e) {
   var $this = $(this); // cache the clicked link
   var filterAttr = "data-filter-value";
   var filterValue = $this.attr(filterAttr); // cache the filter
   var $optionSet = $this.parents(".option-set"); // cache the parent element
   var group = $optionSet.attr("data-filter-group"); // cache the parent filter group
   var filterGroup = filters[group];
   if (!filterGroup) {
     filterGroup = filters[group] = [];
   }
   var $selectAll = $optionSet.find('a['+filterAttr+'=""]'); // the 'select all' button in the current group
   var activeClass = "selected", // the class for active links
     exclClass = "exclusive"; // the class for exclusive groups
 comboFiltering($this,filters,filterAttr,filterValue,$optionSet,group,$selectAll,activeClass,exclClass);
   var comboFilter = getComboFilter(filters);
   $grid.isotope({
     filter: comboFilter
   });
   $this.toggleClass(activeClass);
   e.preventDefault();
 });
});

function searchFilter() {
  var qsRegex = new RegExp( $quicksearch.val(), 'gi' );
  var $container = $('.container');
  $container.isotope({ filter: function() {
    var $this = $(this);
    var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
    return searchResult
  } });
}

/// TOOLTIPS
 
tippy('[title]', {
    theme: 'custom',
    arrow: false,
    followCursor: true,
    delay: 100,
    placement: 'right-end',
    zIndex: 9999999999,
    maxWidth: 400,
 
    content(reference) {
         const title = reference.getAttribute('title');
         reference.removeAttribute('title');
         return title;
    },
});

// use value of search field to filter
var $quicksearch = $('#quicksearch').keyup( debounce( searchFilter ) );

// debounce so filtering doesn't happen every millisecond
function debounce( fn, threshold ) {
  var timeout;
  return function debounced() {
    if ( timeout ) {
      clearTimeout( timeout );
    }
    function delayed() {
      fn();
      timeout = null;
    }
    setTimeout( delayed, threshold || 100 );
  }
}