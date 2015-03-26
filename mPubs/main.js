function search(){
	var keyword = $("#search-text").val();
	keyword=keyword.replace(/ /g,"+");
	var site = "http://wsearch.nlm.nih.gov/ws/query?db=digitalCollections&retmax=40&term="+encodeURIComponent(keyword);
	$("#busy-holder").show()
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
	$.getJSON(yql, callback);
}

function callback(res){
	$("#busy-holder").hide()
	var respData = res['results'][0];
	var conData = $.parseXML(respData);
  	var $data = $(conData).find("document");
  	var resStr="";
  	$data.each(function(){
  		var title = "Default Title";
  		var creator='',subject='',publisher='',date='',language='',snippet='';
  		if($(this).find("content[name='dc:title']") && $(this).find("content[name='dc:title']").text()!=""){
  			title = $(this).find("content[name='dc:title']").text()
  		}
  		if($(this).find("content[name='dc:creator']") && $(this).find("content[name='dc:creator']").text()!=""){
  			creator = $(this).find("content[name='dc:creator']").text()
  		}
  		if($(this).find("content[name='dc:subject']") && $(this).find("content[name='dc:subject']").text()!=""){
  			subject = $(this).find("content[name='dc:subject']").text()
  		}
  		if($(this).find("content[name='dc:publisher']") && $(this).find("content[name='dc:publisher']").text()!=""){
  			publisher = $(this).find("content[name='dc:publisher']").text()
  		}
  		if($(this).find("content[name='dc:date']") && $(this).find("content[name='dc:date']").text()!=""){
  			date = $(this).find("content[name='dc:date']").text()
  		}
  		if($(this).find("content[name='dc:language']") && $(this).find("content[name='dc:language']").text()!=""){
  			language = $(this).find("content[name='dc:language']").text()
  		}
  		if($(this).find("content[name='snippet']") && $(this).find("content[name='snippet']").text()!=""){
  			snippet = $(this).find("content[name='snippet']").text()
  		}
  		resStr+="<li><h5><div class='open_box' tabindex='-1'></div>";
  		resStr+="<a href='"+$(this).attr('url')+"' target='_blank'>"+title+"</a>";
		//resStr+="<a href='"+$(this).attr('url')+"' target='_blank'>"+$(this).find("content[name=title]").text()+"("+$(this).find("content[name=organizationName]").text()+")</a>";
		
		resStr+="</h5><div class='contentBlog' style='display:none'>";
		//resStr+=$(this).find("content[name=FullSummary]").text();
		resStr+="<b>creator:</b>  "+creator+"<br/><br/>";
		resStr+="<b>subject:</b>  "+subject+"<br/><br/>";
		resStr+="<b>publisher:</b>  "+publisher+"<br/><br/>";
		resStr+="<b>Date:</b>  "+date+"<br/><br/>";
		resStr+="<b>language:</b>  "+language+"<br/><br/>";
		resStr+="<b>snippet:</b>  "+snippet+"<br/>";
		resStr+="</div></li>"
  	})
  	if($data.length==0){
		resStr="<li><p> No Matching Result(s) </p></li>";
	}
	console.log($data);
	$("#main-result").html(resStr);

	$('#results').pajinate({
		items_per_page : 10,
		nav_label_first : '<<',
		nav_label_last : '>>',
		nav_label_prev : '<',
		nav_label_next : '>'	
	});

	$("#results").show().find(".ellipse").hide();
	$("#search-text").focus();

}

var $test;

$( document ).ready(function() {
	$("#find").on("click",function(){
		search();
	});

	$("#results").on("click",".open_box",function(){
		var thisObj = $(this);
        var contentBlog = thisObj.parent().next(".contentBlog");
        if(contentBlog.is(":visible")){
          thisObj.parent().removeClass('opened');
        	contentBlog.slideUp('slow');
        }else{
          thisObj.parent().addClass('opened')
          contentBlog.slideDown('slow');
        }
	})

	$("#search-text").on("keyup",function(e){
		var keycode = e.keyCode;
		if(keycode==13)
			search();
	})

});