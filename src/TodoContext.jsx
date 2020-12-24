import React, { createContext, useState, useEffect, useContext } from "react";

const TodoListContext = createContext();

export const useTodoList = () => {
  const context = useContext(TodoListContext);
  if (!context) {
    throw new Error("Cannot use useTodoList outside of TodoListProvider");
  }
  return context;
};

const initialState = [
  { id: 0, value: "Save TODO list on cookie/cache (done)" },
  { id: 1, value: "Make draggable cards so that you can sort them" },
  { id: 2, value: "Make it able to edit the content inside of each card" },
  { id: 3, value: "Make it able to remove tasks (done)" },
  { id: 4, value: "Do some sports" },
  { id: 5, value: "Programming" },
  { id: 6, value: "Dance" },
  { id: 7, value: "Work" },
  { id: 8, value: "Work" },
  { id: 9, value: "Work" },
];

const localState = JSON.parse(localStorage.getItem("todoListStorage"));
const localCompletedState = JSON.parse(
  localStorage.getItem("completedTodoListStorage")
);

export const TodoListProvider = ({ children }) => {
  const [todoList, setTodoList] = useState(localState || initialState);
  const [completedTodoList, setCompletedTodoList] = useState(
    localCompletedState || []
  );

  const amountOfCompletedTasks = completedTodoList.length;

  const onRemoveTask = (itemId) => {
    // remove selected item from list
    const tempNewList = todoList.filter((item) => item.id !== itemId);

    // add new id to every item after the removal
    const newList = tempNewList.map((item, index) => {
      return { id: index, value: item.value };
    });

    setTodoList(newList);
  };

  const onTaskDone = (itemId) => {
    // Add task to the completed list of tasks
    const task = todoList.find((item) => item.id === itemId);
    setCompletedTodoList([...completedTodoList, task]);
    onRemoveTask(itemId);
  };

  useEffect(() => {
    localStorage.setItem("todoListStorage", JSON.stringify(todoList));
    localStorage.setItem(
      "completedTodoListStorage",
      JSON.stringify(completedTodoList)
    );
  }, [completedTodoList, todoList]);

  return (
    <TodoListContext.Provider
      value={{
        todoList,
        completedTodoList,
        amountOfCompletedTasks,
        onTaskDone,
        onRemoveTask,
      }}
    >
      {children}
    </TodoListContext.Provider>
  );
};
