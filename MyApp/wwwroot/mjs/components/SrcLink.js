import { lastRightPart } from "@servicestack/client"

export default {
    template:/*html*/`<a v-if="iconSrc" :href="href" class="mr-3 text-gray-500 hover:text-gray-600 text-decoration-none">
        <img :src="iconSrc" class="w-5 h-5 inline-flex text-purple-800 mr-1" alt="file icon">{{ fileName }}</a>
        <a v-else :href="href" class="mr-3 text-gray-400 hover:text-gray-500 text-decoration-none">
        <slot></slot> {{ fileName }}
    </a>`,
    props: ['href','iconSrc'],
    setup(props) {
        const fileName = lastRightPart(props.href, '/')
        return { fileName }
    }
}
