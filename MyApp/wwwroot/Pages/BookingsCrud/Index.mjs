import Create from "./Create.mjs"
import Edit from "./Edit.mjs"

import { ref, onMounted } from "vue"
import { useClient } from "@servicestack/vue"
import { formatDate, formatCurrency } from "../../mjs/utils.mjs"
import { Booking, QueryBookings } from "../../mjs/dtos.mjs"

export default {
  components: { Create, Edit },
  template:/*html*/`<div title="Bookings CRUD" class="max-w-fit">
    <Create v-if="newBooking" @done="onDone" title="New Booking" />
    <Edit v-else-if="editId" :id="editId" @done="onDone" />
    <OutlineButton @click="() => reset({newBooking:true})">
      <svg class="w-5 h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"></path></svg>
      New Booking
    </OutlineButton>
    <div v-if="bookings.length > 0" class="mt-4 flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr class="select-none">
                <th scope="col" :class="css.th">
                  Id
                </th>
                <th :class="['hidden sm:table-cell',css.th]">
                  Name
                </th>
                <th scope="col" :class="css.th">
                  <span class="hidden sm:inline">Room </span>Type
                </th>
                <th scope="col" :class="css.th">
                  <span class="hidden sm:inline">Room </span>No
                </th>
                <th scope="col" :class="css.th">
                  Cost
                </th>
                <th :class="['hidden sm:table-cell',css.th]">
                  Start Date
                </th>
                <th :class="['hidden sm:table-cell',css.th]">
                  Created By
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(booking, index) in bookings" :key="booking.id" @click="editId = editId == booking.id ? null : booking.id" 
                  :class="[booking.id == editId ? css.trActive : css.tr + (index % 2 === 0 ? ' bg-white dark:bg-black' : ' bg-gray-50 dark:bg-gray-800')]">
                <td :class="css.td">
                  {{ booking.id }}
                </td>
                <td :class="['hidden sm:table-cell',css.td]">
                  {{ booking.name }}
                </td>
                <td :class="['hidden sm:table-cell',css.td]">
                  {{ booking.roomType }}
                </td>
                <td :class="css.td">
                  {{ booking.roomNumber }}
                </td>
                <td :class="css.td">
                  {{ formatCurrency(booking.cost) }}
                </td>
                <td :class="['hidden sm:table-cell',css.td]">
                  {{ formatDate(booking.bookingStartDate) }}
                </td>
                <td :class="['hidden sm:table-cell',css.td]">
                  {{ booking.createdBy }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 flex">
      <SrcLink href="https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp.ServiceModel/Bookings.cs">
        <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4Z"/></svg>
      </SrcLink>
      <SrcLink href="https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp/wwwroot/Pages/BookingsCrud/Index.mjs">
        <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 221"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"/><path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"/><path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"/></svg>
      </SrcLink>
    </div>
  </div>`,
  props:['bookings'],
  setup(props) {
    const css = {
      trActive:'cursor-pointer bg-indigo-100 dark:bg-blue-800',
      tr:'cursor-pointer hover:bg-yellow-50 dark:hover:bg-blue-900',
      th:'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      td:'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
    }
    
    const newBooking = ref(false)
    const editId = ref()
    const expandAbout = ref(false)
    const bookings = ref(props.bookings || [])

    const { api } = useClient()
    
    const refresh = async () => {
      const r = await api(new QueryBookings())
      if (r.succeeded) {
        bookings.value = r.response.results || []
      }
    }

    /** @param {{ newBooking?: boolean, editId?:number }} [args] */
    const reset = (args={}) => {
      newBooking.value = args.newBooking ?? false
      editId.value = args.editId ?? undefined
    }

    const onDone = () => {
      reset()
      refresh()
    }
    
    return { css, newBooking, editId, expandAbout, bookings, refresh, reset, onDone, formatDate, formatCurrency }
  }
}
