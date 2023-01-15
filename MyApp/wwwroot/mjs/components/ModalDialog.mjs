import { ref, onMounted, onUnmounted } from "vue"

export default {
    template:/*html*/`<div v-if="show" :id="id" :data-transition-for="id" @click="close" 
         class="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div data-transition-for="id" data-transition="{
                entering: { cls:'ease-out duration-300', from:'opacity-0',   to:'opacity-100'},
                leaving:  { cls:'ease-in duration-200',  from:'opacity-100', to:'opacity-0' } 
            }" :class="['fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity', transition1]" aria-hidden="true">
            </div>
            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div @click.stop="" data-transition="{
                    entering: {cls:'ease-out duration-300', from:'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', to:'opacity-100 translate-y-0 sm:scale-100'},
                    leaving:  {cls:'ease-in duration-200',  from:'opacity-100 translate-y-0 sm:scale-100', to:'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
                }" data-transition-for="id" 
                :class="['inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full translate-y-4 sm:translate-y-0 sm:scale-95', 
                         transition2]">
                <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button type="button" @click="close"
                            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span class="sr-only">Close</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>`,
    props:['id','show'],
    emits:['done'],
    setup(props, { emit }) {
        const transition1 = ref(props.show ? 'opacity-0' : '')
        const transition2 = ref(props.show ? 'opacity-0' : '')

        const globalKeyHandler = e => { if (e.key === 'Escape') close() }
        onMounted(() => window.addEventListener('keydown', globalKeyHandler))
        onUnmounted(() => window.removeEventListener('keydown', globalKeyHandler))

        const close = () => emit('done')
        return { transition1, transition2, close }
    }
}
