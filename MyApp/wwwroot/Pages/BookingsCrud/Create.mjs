import { CreateBooking, RoomType } from "../../mjs/dtos.mjs"
import { dateInputFormat } from "../../mjs/utils.mjs"
import { useClient, useAppMetadata } from "@servicestack/vue"

export default {
  template:/*html*/`
  <SlideOver @done="close" title="New Booking">
    <form @submit.prevent="submit">
      <input type="submit" class="hidden">
      <fieldset>
        <ErrorSummary :except="visibleFields" class="mb-4" />
  
        <div class="grid grid-cols-6 gap-6">

          <div class="col-span-6 sm:col-span-3">
            <TextInput id="name" v-model="request.name" required placeholder="Name for this booking" />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="roomType" v-model="request.roomType" :options="enumOptions('RoomType')" />
          </div>
  
          <div class="col-span-6 sm:col-span-3">
            <TextInput type="number" id="roomNumber" v-model="request.roomNumber" min="0" required />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <TextInput type="number" id="cost" v-model="request.cost" min="0" required />
          </div>
  
          <div class="col-span-6 sm:col-span-3">
            <TextInput type="date" id="bookingStartDate" v-model="request.bookingStartDate" required />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput type="date" id="bookingEndDate" v-model="request.bookingEndDate" />
          </div>
  
          <div class="col-span-6">
            <TextareaInput id="notes" v-model="request.notes" placeholder="Notes about this booking" class="h-24" />
          </div>
        </div>
      </fieldset>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <PrimaryButton @click="submit">Create Booking</PrimaryButton>
      </div>
    </template>
  </SlideOver>`,
  emits:['done'],
  setup(props, { emit }) {

    const visibleFields = "name,roomType,roomNumber,bookingStartDate,bookingEndDate,cost,notes"
    const client = useClient()

    const request = new CreateBooking({
      roomType: RoomType.Single,
      roomNumber: 0,
      cost: 0,
      bookingStartDate: dateInputFormat(new Date())
    })

    /** @param {Event} e */
    const submit = async (e) => {
      const api = await client.api(request)
      if (api.succeeded) close()
    }
    const close = () => emit('done')

    const { enumOptions } = useAppMetadata()
    return { visibleFields, request, submit, close, enumOptions }
  }
}
