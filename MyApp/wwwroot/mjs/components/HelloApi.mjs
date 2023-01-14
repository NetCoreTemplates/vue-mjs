import { ref } from "vue"
import { useClient } from "../app.mjs"
import { Hello } from "../dtos.mjs"

export default {
    template:/*html*/`<div class="flex items-center flex-wrap sm:flex-nowrap">
        <input type="text" class="mt-2 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" v-model="name" @keyup="update">
        <div class="ml-3 mt-2 text-2xl">{{ result }}</div>
    </div>`,
    props:['value'],
    setup(props) {
        let name = ref(props.value)
        let result = ref('')
        let { api } = useClient()
        
        async function update() {
            let apiResult = await api(new Hello({ name }))
            if (apiResult.succeeded) {
                result.value = apiResult.response.result
            }
        }
        update()
        
        return { name, update, result }
    }
}
