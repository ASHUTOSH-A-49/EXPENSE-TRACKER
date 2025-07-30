import { createContext,useContext } from "react";

const ExpenseContext = createContext({
    todos:[
       { id:1,
        todo:"Learn React",
        Completed:false
       }
    ],
    addTodo: (expense) => {},
    updateTodo: (id, expense) => {},
    deleteTodo: (id) => {},
    togglecomplete: (id) => {}
});

export const useExpense = () => {
    return useContext(ExpenseContext);
}

export const ExpenseProvider = ExpenseContext.Provider;