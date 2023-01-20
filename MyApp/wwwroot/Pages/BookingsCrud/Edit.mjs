import { computed, inject, ref, watchEffect } from "vue"
import { DeleteBooking, QueryBookings, UpdateBooking } from "../../mjs/dtos.mjs"
import { sanitizeForUi } from "../../mjs/utils.mjs"
import { enumOptions } from "../../mjs/types.mjs"
import { useClient } from "@servicestack/vue"

export default {
    template:/*html*/`
    <SlideOver @done="close" title="Edit Booking">
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
        <div class="flex justify-between space-x-3">
          <div>
            <ConfirmDelete v-if="canDelete" @delete="onDelete">Delete</ConfirmDelete>
          </div>
          <div>
            <PrimaryButton @click="submit">Update Booking</PrimaryButton>
          </div>
        </div>
      </template>
    </SlideOver>`,
    props: { id:Number },
    emits: ['done'],
    setup(props, { emit }) {
        const visibleFields = "name,roomType,roomNumber,bookingStartDate,bookingEndDate,cost,notes"

        const AppData = inject('AppData')
        const canDelete = computed(() => AppData.hasRole('Manager'))
        const client = useClient()
        const request = ref(new UpdateBooking())

        watchEffect(async () => {
            const api = await client.api(new QueryBookings({id: props.id}))
            if (api.succeeded) {
                request.value = new UpdateBooking(sanitizeForUi(api.response?.results[0]))
            }
        })

        /** @param {Event} e */
        const submit = async (e) => {
            const api = await client.api(request.value)
            if (api.succeeded) close()
        }
        const onDelete = async () => {
            const api = await client.apiVoid(new DeleteBooking({id: props.id}))
            if (api.succeeded) close()
        }

        const close = () => emit('done')
        
        return { visibleFields, request, canDelete, submit, onDelete, close, enumOptions, }
    }
}
