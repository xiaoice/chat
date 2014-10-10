package com.zte.framework.util;

import com.zte.framework.jdbc.BaseAction;

public class AjaxAction extends BaseAction{
	public static final String JSON = "json";
	
	protected AjaxUtil ajaxUtil=new AjaxUtil();
	
	public AjaxUtil getAjaxUtil() {
		return ajaxUtil;
	}

	public void setAjaxUtil(AjaxUtil ajaxUtil) {
		this.ajaxUtil = ajaxUtil;
	}

}
