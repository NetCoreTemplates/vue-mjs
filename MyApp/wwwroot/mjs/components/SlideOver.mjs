import { ref, onMounted, onUnmounted } from "vue"
import { on } from "@servicestack/client"

export default {
    template:/*html*/`<div :id="id" class="relative z-10" :aria-labelledby="id + '-title'" role="dialog" aria-modal="true">
  <div class="fixed inset-0"></div>
  <div class="fixed inset-0 overflow-hidden">
    <div @click="close" class="absolute inset-0 overflow-hidden">
      <div @click.stop="" class="pointer-events-none fixed inset-y-0 right-0 flex pl-10">
        <!--
          Slide-over panel, show/hide based on slide-over state.
          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        -->
        <div class="pointer-events-auto w-screen xl:max-w-3xl md:max-w-xl max-w-lg">
          <div class="flex h-full flex-col bg-white shadow-xl">
            <div class="flex min-h-0 flex-1 flex-col">

              <div class="flex-1">
                  <!-- Header -->
                  <div class="bg-gray-50 px-4 py-6 sm:px-6">
                    <div class="flex items-start justify-between space-x-3">
                      <div class="space-y-1">
                        <h2 v-if="title" class="text-lg font-medium text-gray-900" :id="id + '-title'">{{title}}</h2>
                        <p class="text-sm text-gray-500">
                            <slot name="subtitle"></slot>
                        </p>
                      </div>
                      <div class="flex h-7 items-center">
                          <CloseButton @close="close"/>
                      </div>
                    </div>
                  </div>              
                  
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <slot></slot>
                  </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                <slot name="footer"></slot>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`,
    props:['id','title'],
    emits:['done'],
    setup(props, { emit }) {
        const globalKeyHandler = e => { if (e.key === 'Escape') close() }
        onMounted(() => window.addEventListener('keydown', globalKeyHandler))
        onUnmounted(() => window.removeEventListener('keydown', globalKeyHandler))

        const close = () => emit('done')
        return { close }
    }
}
