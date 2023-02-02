import { computed, ref, watch } from "vue"
import { useClient, useAuth, useFormatters } from "@servicestack/vue"
import { QueryBookings } from "../../mjs/dtos.mjs"

export default {
  template:/*html*/`
  <div title="Bookings CRUD" class="sm:max-w-fit">
    <AutoCreateForm v-if="create" type="CreateBooking" @done="done" @save="done" />
    <AutoEditForm v-else-if="edit" type="UpdateBooking" :deleteType="canDelete ? 'DeleteBooking' : null" v-model="edit" @done="done" @save="done" @delete="done" />
    <OutlineButton @click="() => reset({ create:true })">
      <svg class="w-5 h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"></path></svg>
      New Booking
    </OutlineButton>
    <DataGrid :items="bookings" :visible-from="{ name:'xl', bookingStartDate:'sm', bookingEndDate:'xl' }"
              @row-selected="editId = editId == $event.id ? null : $event.id" :is-selected="row => editId == row.id" >
      <template #id="{ id }">
          <span class="text-gray-900">{{ id }}</span>
      </template>
      <template #name="{ name }">
          {{ name }}
      </template>
      <template #roomNumber-header>
          <span class="hidden lg:inline">Room </span>No
      </template>
      <template #cost="{ cost }">{{ currency(cost) }}</template>
      
      <template #bookingStartDate-header>
          Start<span class="hidden lg:inline"> Date</span>
      </template>
      <template #bookingEndDate-header>
          End<span class="hidden lg:inline"> Date</span>
      </template>
      <template #createdBy-header>
          Employee
      </template>
      <template #createdBy="{ createdBy }">{{ createdBy }}</template>
    </DataGrid>
    <div class="mt-5 flex">
      <SrcLink href="https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp.ServiceModel/Bookings.cs">
        <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4Z"/></svg>
      </SrcLink>
      <SrcLink href="https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp/wwwroot/Pages/BookingsCrud/Index.mjs">
        <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 221"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"/><path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"/><path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"/></svg>
      </SrcLink>
    </div>
  </div>`,
  props: { bookings:Array },
  setup(props) {
    const create = ref(false)
    const editId = ref()
    const edit = ref()
    const expandAbout = ref(false)
    const bookings = ref(props.bookings || [])

    const client = useClient()
    const { currency } = useFormatters()
    const { hasRole } = useAuth()
    const canDelete = computed(() => hasRole('Manager'))
    
    async function refresh() {
      const api = await client.api(new QueryBookings())
      if (api.succeeded) {
        bookings.value = api.response.results || []
      }
    }

    /** @param {{ create?: boolean, editId?:number }} [args] */
    function reset(args={}) {
      create.value = args.create ?? false
      editId.value = args.editId ?? undefined
    }

    function done() {
      refresh()
      reset()
    }
    
    watch(editId, async () => {
      if (editId.value) {
        const api = await client.api(new QueryBookings({ id: editId.value }))
        if (api.succeeded) {
          edit.value = api.response.results[0]
          return
        }
      }
      edit.value = null
    })
    
    return { create, editId, edit, canDelete, expandAbout, bookings, reset, done, currency }
  }
}
