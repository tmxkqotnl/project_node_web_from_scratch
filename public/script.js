$(document).ready(function(){
  $('.btn-delete').click(function(e){
    const id = new URLSearchParams(location.search).get('id');
    $.ajax({
      url:`/del?id=${id}`,
      type:'POST',
      dataType:"json",
      success:function(data){
          console.log(`post id ${id} is deleted`);
          location.replace('/');
      }
    });
  })
});