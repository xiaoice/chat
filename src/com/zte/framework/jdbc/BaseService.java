package com.zte.framework.jdbc;

import org.springframework.stereotype.Service;

@Service("baseService")
public interface BaseService<T> extends BaseDao<T>{
	
}
