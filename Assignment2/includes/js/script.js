/*

My Custom JS
============
*/

$(function(){
  $('#alertMe').click(function(e){
    e.preventDefault();
    $('#successAlert').slideDown();
  });
});
