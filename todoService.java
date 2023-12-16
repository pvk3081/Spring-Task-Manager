package com.example.webapp.todo;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.stereotype.Service;

import jakarta.validation.Valid;

@Service
public class todoService {
	private static List<todo> todos = new ArrayList<>();
	
	private static int count = 0;
	
	static {
		todos.add(new todo(++count,"damya","paycom", LocalDate.now().plusYears(1),false));
		todos.add(new todo(++count,"damya","paycom", LocalDate.now().plusYears(2),false));
		todos.add(new todo(++count,"damya","paycom", LocalDate.now().plusYears(3),false));
	}
	
	public List<todo> findByUsername(String username){
		Predicate<? super todo> predicate = todo -> todo.getUsername().equalsIgnoreCase(username);
		return todos.stream().filter(predicate).toList();
	}
	
	public void addtodo(String username, String description, LocalDate targetdate, boolean done) {
		todo td = new todo(++count,username, description, targetdate, done);
		todos.add(td);
	}
	
	public void deleteById(int id) {
		Predicate<? super todo> predicate = todo -> todo.getId() == id;
		todos.removeIf(predicate);
	}
	
	public todo UpdateById(int id) {
		Predicate<? super todo> predicate = todo -> todo.getId() == id;
		todo var = todos.stream().filter(predicate).findFirst().get();
		return var;
		
	}
	
	public void UpdateTodo(@Valid todo todoo) {
		deleteById(todoo.getId());
		todos.add(todoo);
	}

}
