package com.example.webapp.todo;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;

@Entity
public class todo {
	
	public todo() {
		
	}
	
	public todo(int id, String username, String description, LocalDate targetdate, boolean done) {
		super();
		this.id = id;
		this.username = username;
		this.description = description;
		this.targetdate = targetdate;
		this.done = done;
	}
	@Id
	@GeneratedValue
	private int id;
	private String username;
	@Size(min=5, message="Enter at least 5 characters")
	private String description;
	private LocalDate targetdate;
	private boolean done;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public LocalDate getTargetdate() {
		return targetdate;
	}
	public void setTargetdate(LocalDate targetdate) {
		this.targetdate = targetdate;
	}
	public boolean isDone() {
		return done;
	}
	public void setDone(boolean done) {
		this.done = done;
	}

	@Override
	public String toString() {
		return "todo [id=" + id + ", username=" + username + ", description=" + description + ", targetdate="
				+ targetdate + ", done=" + done + "]";
	}

	
	

}
