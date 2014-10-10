package com.zte.user.domain;

import java.io.Serializable;

import org.springframework.stereotype.Component;

@Component
public class User implements Serializable {
	private static final long serialVersionUID = 5282119415543553733L;
	private int id;
	private String username;
	private String password;
	private String name;
	private String photo;
	private int age;
	@Override
	public String toString(){
		return  "id:"+id+"\n"+
				"username:"+username+"\n"+
				"password:"+password+"\n"+
				"name:"+name+"\n"+
				"age:"+age+"\n"+
				"photo:"+photo;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhoto() {
		return photo;
	}
	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}
}
