package com.zte.push;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zte.framework.util.DateUtil;

public class Ajax extends HttpServlet{
	// <用户,长连接>   
    protected static Map<String, HttpServletResponse> connections = new HashMap<String, HttpServletResponse>(); 
    
	public void doGet(HttpServletRequest request,HttpServletResponse response) throws IOException{
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out=response.getWriter();
		for(int i=0;i<1000;i++){
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			out.write(DateUtil.getCurrentDateTime()+"<br>");
			out.flush();
		}
		out.close();
	}
    
	

}
