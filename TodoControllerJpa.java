package com.example.webapp.todo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@SessionAttributes("name")
public class TodoControllerJpa {
	
	public TodoControllerJpa(TodoRepository todor) {
		super();
		this.todor = todor;
	}

	private TodoRepository todor;
	
	@RequestMapping("todos")
	public String getAlllist(ModelMap model) {
		String username = getLoggedInUsername(model);
		List<todo> todos = todor.findByUsername(username);
		model.addAttribute("todo",todos);
		return "ListToDos";
	}

	private String getLoggedInUsername(ModelMap model) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth.getName();
	}
	
	@RequestMapping(value="update_list", method = RequestMethod.GET)
	public String show_Updated_todolist(ModelMap model) {
		String username = getLoggedInUsername(model);
		todo todoo = new todo(0, username, "", LocalDate.now().plusYears(1),false);
		model.put("todoo", todoo);
		return "update_todo";
	}
	
	@RequestMapping(value="update_list", method = RequestMethod.POST)
	public String Updated_todolist(ModelMap model, @Valid  @ModelAttribute("todoo") todo todoo, BindingResult result) {
		if(result.hasErrors()) {
			return "update_todo";
		}
		String username = getLoggedInUsername(model);
		todoo.setUsername(username);
		todor.save(todoo);
		//todo.addtodo(username, todoo.getDescription(), todoo.getTargetdate(),todoo.isDone());
		return "redirect:todos";
	}
	
	@RequestMapping("delete-todo")
	public String Delete_Todo(@RequestParam int id) {
		todor.deleteById(id);
		return "redirect:todos";
	}
	
	@RequestMapping(value="update-todo", method = RequestMethod.GET)
	public String Update_Todo(@RequestParam int id, ModelMap model) {
		todo ret = todor.findById(id).get();
		model.addAttribute("todoo", ret);
		return "update_todo";
	}
	
	@RequestMapping(value="update-todo", method = RequestMethod.POST)
	public String Edit_todolist(ModelMap model, @Valid  @ModelAttribute("todoo") todo todoo, BindingResult result) {
		if(result.hasErrors()) {
			return "update_todo";
		}
		String username = getLoggedInUsername(model);
		todoo.setUsername(username);
		todor.save(todoo);
		return "redirect:todos";
	}
}
