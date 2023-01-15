import { ref } from "vue"
import { serializeToObject } from "@servicestack/client"
import { useClient } from "@servicestack/vue"
import { Authenticate } from "../mjs/dtos.mjs"
import { AppData } from "../mjs/app.mjs"

export default {
    template:/*html*/`    
    <form @submit.prevent="submit">
      <div class="shadow overflow-hidden sm:rounded-md">
        <ErrorSummary except="userName,password,rememberMe"/>
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div class="flex flex-col gap-y-4">
            <TextInput id="userName" placeholder="Email" help="Email you signed up with" v-model="userName" />
            <TextInput id="password" type="password" help="6 characters or more" v-model="password"/>
            <CheckboxInput id="rememberMe" v-model="rememberMe" />
          </div>
        </div>
        <div class="pt-5 px-4 py-3 bg-gray-50 text-right sm:px-6">
          <div class="flex justify-end">
            <FormLoading class="flex-1"/>
            <SecondaryButton href="/signup">Register New User</SecondaryButton>
            <PrimaryButton class="ml-3">Login</PrimaryButton>
          </div>
        </div>
      </div>
    </form>

    <div class="flex mt-8">
      <h3 class="hidden xs:block mr-4 leading-8 text-gray-500">Quick Links</h3>
      <span class="relative z-0 inline-flex shadow-sm rounded-md">
        <button type="button" @click="setUser('admin@email.com')"
                class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            admin@email.com
        </button>
        <button type="button" @click="setUser('manager@email.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            manager@email.com
        </button>
        <button type="button" @click="setUser('employee@email.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            employee@email.com
        </button>
        <button type="button" @click="setUser('new@user.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            new@user.com
        </button>
      </span>
    </div>`,
    props:['redirect'],
    setup(props) {
        const { api } = useClient()
        const userName = ref('')
        const password = ref('')
        const rememberMe = ref(true)
        
        function setUser(email) {
            userName.value = email
            password.value = "p@55wOrd"
        }
        async function submit(e) {
            const r = await api(new Authenticate({ provider: 'credentials', userName, password, rememberMe }))
            if (r.succeeded) {
                AppData.Auth = r.response
                location.href = props.redirect || '/'
            }
        }
        return { userName, password, rememberMe, setUser, submit }
    }
}
