import { createApp, reactive } from 'vue'
import { $1, toKebabCase } from "@servicestack/client"
import { client } from "../mjs/app.mjs"
import { Todo, QueryTodos, CreateTodo, UpdateTodo, DeleteTodos } from "../mjs/dtos.mjs"

let store = {
    /** @typedef TODOS - declared in TodoMvc.cshtml 
      * @type {Todo[]} */ 
    todos: (window.TODOS || []),
    newTodo:'',
    filter: 'all',
    error:null,
    finishedTodos() { return this.todos.filter(x => x.isFinished) },
    unfinishedTodos() { return this.todos.filter(x => !x.isFinished) },
    filteredTodos() {
        return this.filter === 'finished'
            ? this.finishedTodos()
            : this.filter === 'unfinished'
                ? this.unfinishedTodos()
                : this.todos
    },
    refreshTodos(errorStatus) {
        this.error = errorStatus
        client.api(new QueryTodos())
            .then(api => {
                if (api.succeeded) {
                    this.todos = api.response.results
                }
            })
    },
    addTodo() {
        this.todos.push(new Todo({ text:this.newTodo }))
        client.api(new CreateTodo({ text:this.newTodo }))
            .then(api => {
                if (api.succeeded)
                    this.newTodo = ''
                return this.refreshTodos(api.error)
            })
    },
    removeTodo(id) {
        this.todos = this.todos.filter(x => x.id !== id)
        client.api(new DeleteTodos({ ids:[id] }))
            .then(api => this.refreshTodos(api.error))
    },
    removeFinishedTodos() {
        let ids = this.todos.filter(x => x.isFinished).map(x => x.id)
        if (ids.length === 0) return
        this.todos = this.todos.filter(x => !x.isFinished)
        client.api(new DeleteTodos({ ids }))
            .then(api => this.refreshTodos(api.error))
    },
    toggleTodo(id) {
        const todo = this.todos.find(x => x.id === id)
        todo.isFinished = !todo.isFinished
        client.api(new UpdateTodo(todo))
            .then(api => this.refreshTodos(api.error))
    },
    changeFilter(filter) {
        this.filter = filter
    }
}
store = reactive(store)

const FilterTab = {
    template:/*html*/`<a href="#" @click.stop="store.changeFilter(filter)" 
      :class="['border-gray-200 text-sm font-medium px-4 py-2 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white',
               filter === store.filter ? 'text-blue-700 dark:bg-blue-600' : 'text-gray-900 hover:text-blue-700 dark:bg-gray-700']"><slot></slot></a>`,
    props:['filter'],
    setup(props) {
        return { store }
    },
}

export default {
    components:{ FilterTab },
    template: $1('#TodoMvc-template'),
    setup(props) {
        return {
            store,
        }
    }
}
