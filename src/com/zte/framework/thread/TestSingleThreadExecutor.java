package com.zte.framework.thread;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opensymphony.xwork2.ActionContext;
import com.zte.framework.util.DateUtil;

public class TestSingleThreadExecutor extends HttpServlet {
	ScheduledThreadPoolExecutor poolExec=new ScheduledThreadPoolExecutor(2);
	
	@Override
	public void doGet(HttpServletRequest request,HttpServletResponse response) throws IOException{
		Map<String, Object> session = ActionContext.getContext().getSession();
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html,charset=utf-8");
		PrintWriter out;
		out = response.getWriter();
		while (true){
			List<String> times=(List<String>) session.get("times");
			if(times!=null){
				for(String time: times){
					out.write("当前时间："+time);
					out.flush();
				}
			}
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		//out.close();
	}
	
	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		/*ExecutorService executorService=Executors.newSingleThreadExecutor();
		Thread thread1=new MessageThread();
		Thread thread2=new MessageThread();
		Thread thread3=new MessageThread();
		executorService.execute(thread1);
		executorService.execute(thread2);
		executorService.execute(thread3);
		executorService.shutdown();
		
		
		
		poolExec.scheduleAtFixedRate(new Runnable() {
			@Override
			public void run() {
				Map<String, Object> session = ActionContext.getContext().getSession();
				List<String> times=(List<String>) session.get("times");
				times=times==null?new ArrayList<String>():times;
				times.add(DateUtil.getCurrentDateTime());
				ActionContext.getContext().getSession().put("times", times);
			}
		}, 1, 1, TimeUnit.SECONDS);
		*/
		
		Map<String, Object> session = ActionContext.getContext().getSession();
		ScheduledThreadPoolExecutor poolExec=new ScheduledThreadPoolExecutor(2);
		poolExec.scheduleAtFixedRate(new Runnable() {
			@Override
			public void run() {
				Map<String, Object> session = ActionContext.getContext().getSession();
				List<String> times=(List<String>) session.get("times");
				times=times==null?new ArrayList<String>():times;
				times.add(DateUtil.getCurrentDateTime());
				ActionContext.getContext().getSession().put("times", times);
			}
		}, 1, 1, TimeUnit.SECONDS);
		List<String> times=(List<String>) session.get("times");
		for(String time: times){
			System.out.println("当前时间："+time);
		}
		
	}

}
