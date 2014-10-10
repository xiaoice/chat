package com.zte.message.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zte.framework.jdbc.BaseService;
import com.zte.message.domain.Message;

@Service("messageService")
public interface MessageService extends BaseService<Message>{
	public int insert(Message message);

	public List<Map<String,Object>> getMessageList(Map<String,Object> map);

	public int getMessageCount(Map<String,Object> parameter);
	
	public List<Map<String,Object>> findMessageListByPage(Map<String,Object> map);

	public int updateMessageIsRead(Map<String, Object> map);
	
	//获取未读的新消息列表总数
	public List<Map<String,String>> getUnReadMessageCount(Map<String, Object> map);
}
