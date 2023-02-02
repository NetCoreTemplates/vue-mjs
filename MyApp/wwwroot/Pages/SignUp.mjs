import { ref } from "vue"
import { leftPart, rightPart, toPascalCase } from "@servicestack/client"
import { useClient } from "@servicestack/vue"
import { Register } from "../mjs/dtos.mjs"

export default {
    template:/*html*/`    
    <form @submit.prevent="onSubmit">
      <div class="shadow overflow-hidden sm:rounded-md">
        <ErrorSummary except="displayName,userName,password,confirmPassword,autoLogin"/>
        <div class="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
          <div class="flex flex-col gap-y-4">
            <TextInput id="displayName" help="Your first and last name" v-model="displayName"/>
            <TextInput id="userName" label="Email" placeholder="Email" help="" v-model="userName"/>
            <TextInput id="password" type="password" help="6 characters or more" v-model="password"/>
            <TextInput id="confirmPassword" type="password" v-model="confirmPassword"/>
            <CheckboxInput id="autoLogin" v-model="autoLogin" />
          </div>
        </div>
        <div class="pt-5 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
          <div class="flex justify-end">
            <FormLoading v-if="loading" class="flex-1" />
            <PrimaryButton class="ml-3">Sign Up</PrimaryButton>
          </div>
        </div>
      </div>
    </form>

    <div class="flex mt-8 ml-8">
      <h3 class="mr-4 leading-8 text-gray-500">Quick Links</h3>
      <span class="relative z-0 inline-flex shadow-sm rounded-md">
        <button type="button" @click="setUser('new@user.com')"
                class="-ml-px relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            new@user.com
      </button>
    </span>
    </div>`,
    props: { returnUrl:String },
    setup(props) {
        const { api, setError, unRefs, loading } = useClient()
        const displayName = ref("")
        const userName = ref("")
        const password = ref("")
        const confirmPassword = ref("")
        const autoLogin = ref(true)

        /** @param email {string} */
        function setUser(email) {
            let first = leftPart(email, '@')
            let last = rightPart(leftPart(email, '.'), '@')
            displayName.value = toPascalCase(first) + ' ' + toPascalCase(last)
            userName.value = email
            confirmPassword.value = password.value = 'p@55wOrd'
        }
        async function onSubmit() {
            if (password.value !== confirmPassword.value) {
                setError({ fieldName: 'confirmPassword', message: 'Passwords do not match' })
                return
            }
            const registerApi = await api(new Register(unRefs({
                displayName,
                email: userName,
                password,
                confirmPassword,
                autoLogin,
            })))
            if (registerApi.succeeded) {
                location.href = props.returnUrl || '/signin'
            }
        }
        return { loading, displayName, userName, password, confirmPassword, autoLogin, setUser, onSubmit }
    }
}
