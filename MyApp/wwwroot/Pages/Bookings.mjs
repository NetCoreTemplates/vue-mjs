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
      <template #cost="{ cost }"><span v-html="currency(cost)"></span></template>
      
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
    
    <div class="mt-5 flex justify-between">
        <div>
            <SrcLink href="https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp.ServiceModel/Bookings.cs" />
            <SrcLink href="https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp/wwwroot/Pages/Bookings.mjs" />
        </div>
        <div>
            <a href="/bookings-auto" class="text-gray-400 hover:text-gray-600">Bookings AutoQueryGrid</a>
            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="text-gray-400 w-6 h-6 inline" aria-hidden="true">
                <path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42Z"></path>
            </svg>
        </div>
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
