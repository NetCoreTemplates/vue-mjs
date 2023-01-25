import { ref } from "vue"
import { useClient, useAuth } from "@servicestack/vue"
import { Authenticate } from "../mjs/dtos.mjs"

export default {
    template:/*html*/`    
    <form @submit.prevent="submit">
      <div class="shadow overflow-hidden sm:rounded-md">
        <ErrorSummary except="userName,password,rememberMe"/>
        <div class="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
          <div class="flex flex-col gap-y-4">
            <TextInput id="userName" placeholder="Email" help="Email you signed up with" v-model="userName" />
            <TextInput id="password" type="password" help="6 characters or more" v-model="password"/>
            <CheckboxInput id="rememberMe" v-model="rememberMe" />
          </div>
        </div>
        <div class="pt-5 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
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
                class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            admin@email.com
        </button>
        <button type="button" @click="setUser('manager@email.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            manager@email.com
        </button>
        <button type="button" @click="setUser('employee@email.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            employee@email.com
        </button>
        <button type="button" @click="setUser('new@user.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            new@user.com
        </button>
      </span>
    </div>`,
    props: { redirect:String },
    setup(props) {
        const { api, unRefs } = useClient()
        const userName = ref('')
        const password = ref('')
        const rememberMe = ref(true)
        
        function setUser(email) {
            userName.value = email
            password.value = "p@55wOrd"
        }
        
        const { signIn } = useAuth()
        async function submit() {
            const authApi = await api(new Authenticate(unRefs({ provider: 'credentials', userName, password, rememberMe })))
            if (authApi.succeeded) {
                signIn(authApi.response)
                location.href = props.redirect || '/'
            }
        }
        return { userName, password, rememberMe, setUser, submit }
    }
}
