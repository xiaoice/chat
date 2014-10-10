/**
 * deskColor - xiaoice
 */

(function($){
	
	var colorHex = new Array('00', '33', '66', '99', 'CC', 'FF');
	var _colorHex = new Array('FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF');
	
	$.fn.deskColor = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.desk.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		options = $.extend({}, $.fn.deskColor.defaults, options);
        var colorTable = '';
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 6; j++) {
                colorTable +='<tr><td style="background-color:#000000">';
                if (i == 0) {
                    colorTable +='<td style="background-color:#' + colorHex[j] + colorHex[j] + colorHex[j] + '">';
                } else {
                    colorTable +='<td style="background-color:#' + _colorHex[j] + '">';
                }
                colorTable +='<td style="background-color:#000000">';
                for (k = 0; k < 3; k++) {
                    for (l = 0; l < 6; l++) {
                        colorTable +='<td style="background-color:#' + colorHex[k + i * 3] + colorHex[l] + colorHex[j] + '">'
                    }
                }
                colorTable +='</tr>';
            }
        }
        colorTable = '<table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;width:100%;height:100%;" >' + colorTable + '</table>';
        var onClick=function(e){
        	options.onClick.call(this, e,$(this).css("background-color"));
        };
        $(this).empty();
		$(colorTable).appendTo(this).find("td").unbind("click").bind("click",onClick);
		
	};
	
	$.fn.deskColor.defaults = {
		onClick:function(e){}
	};
	
})(jQuery);
