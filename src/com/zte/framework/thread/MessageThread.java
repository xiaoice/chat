package com.zte.framework.thread;

import java.util.Date;

public class MessageThread extends Thread {

	@Override
	public void run() {
		String threadName=Thread.currentThread().getName();
		System.out.println(new Date().getTime()+"线程名："+threadName);
	}

}
