import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getTodoList,
  getCompletedTodoList,
  storeTodoList,
  storeCompletedTodoList,
} from "../utils/localStorage";

/* 
  Features: 
  - Change "Be done with a task first! :)" message when you add a better UI for the completed dashboard
  - Add jest tests
  - Make content of task editable
  - Make position / title of task editable
  - Update to have nicer UI
  - To clear completed list
  - Categorize list
  - Fix width
  - Add keybindings to lear
*/

const initialState = {
  todoList: [],
  completedTodoList: [],
  setTodoList: (data: any) => {},
  setCompletedTodoList: (data: any) => {},
  amountOfCompletedTasks: 0,
  onChangeTaskColor: (itemId: number, bg: string, borderColor: string) => {},
  onTaskDone: (itemId: number) => {},
  onRemoveTask: (itemId: number) => {},
  onEditDescription: (itemId: number, description: string) => {},
};

export type TodoItemType = {
  id: number;
  value: string;
  bg: string;
  borderColor: string;
};

export const TodoListContext = createContext(initialState);

export const useTodoList = () => {
  const context = useContext(TodoListContext);
  if (!context) {
    throw new Error("Cannot use useTodoList outside of TodoListProvider");
  }
  return context;
};

export const TodoListProvider = ({ children }: any) => {
  const [todoList, setTodoList] = useState(getTodoList());
  const [completedTodoList, setCompletedTodoList] = useState(
    getCompletedTodoList()
  );

  const amountOfCompletedTasks = completedTodoList.length;

  const onRemoveTask = (itemId: number) => {
    // remove selected item from list
    const tempNewList = todoList.filter(
      (item: TodoItemType) => item.id !== itemId
    );

    // add a new id to every item after the removal
    const newList = tempNewList.map((item: TodoItemType, index: number) => {
      return { ...item, id: index };
    });

    setTodoList(newList);
  };

  const onTaskDone = (itemId: number) => {
    const task = todoList.find((item: TodoItemType) => item.id === itemId);

    // Add task to the completed list of tasks
    setCompletedTodoList([...completedTodoList, task]);

    onRemoveTask(itemId);
  };

  const onEditDescription = (itemId: number, description: string) => {
    // Create a new list with the edited description of the task
    // const newList = todoList.map((item: TodoItemType) => {
    //   return item.id === itemId ? { ...item, value: description } : item;
    // });
    // setTodoList(newList);
    // console.log(description, "description");
    // console.log(newList, "new list");
  };

  const onChangeTaskColor = (
    itemId: number,
    bg: string,
    borderColor: string
  ) => {
    // Create a new list with the edited color of the task
    const newList = todoList.map((item: TodoItemType) => {
      return item.id === itemId ? { ...item, bg: bg, borderColor } : item;
    });

    setTodoList(newList);
  };

  useEffect(() => {
    storeTodoList(todoList);
    storeCompletedTodoList(completedTodoList);
  }, [completedTodoList, todoList]);

  return (
    <TodoListContext.Provider
      value={{
        todoList,
        completedTodoList,
        amountOfCompletedTasks,
        setTodoList,
        setCompletedTodoList,
        onEditDescription,
        onTaskDone,
        onRemoveTask,
        onChangeTaskColor,
      }}
    >
      {children}
    </TodoListContext.Provider>
  );
};
