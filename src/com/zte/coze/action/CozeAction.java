package com.zte.coze.action;

import org.springframework.stereotype.Controller;

import com.zte.framework.util.AjaxAction;

@Controller("cozeAction")
public class CozeAction extends AjaxAction {
	//主页
	public String index(){
		return INPUT;
	}
}
