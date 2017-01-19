$(function(){
  console.log('ready');
  var addOnClicks = function(){
    $('.viewbtn').click(function(){
      if($(this)[0].hasAttribute('videoid')){
        player.loadVideoById($(this).attr('videoid'), 5, 'large');
      }
      else if($(this[0].hasAttribute('playistid'))){
        player.loadPlaylist({
          list: $(this).attr('playlistid'),
          listType: 'playlist'
        });
      }
      });
    };
    addOnClicks();
  });
