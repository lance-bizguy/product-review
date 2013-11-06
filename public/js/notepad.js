if(localStorage.getItem("StockNotepad") === null) {
  localStorage.setItem("StockNotepad", "" );
}

$(document).ready(function($) {
  if (localStorage.getItem("StockNotepad")) {
    $("#notepad").val( localStorage.getItem("StockNotepad") );
  }

  $("#notepad").live("keyup", function() {
    localStorage.setItem("StockNotepad", $(this).val() );
  });
});

  $(window).bind("storage", function (e) {
    if ( e.originalEvent.key === "StockNotepad" ) {
      $("#notepad").val( localStorage.getItem("StockNotepad") );
    }
  });