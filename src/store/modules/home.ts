import { defineStore } from 'pinia'
import { storeHome } from '../types/home'
 
export const useHomeStore = defineStore('index', {
    state: (): storeHome => {
        return {
            count: 0,
            status: false,
            msg:'默认msg'
        }
    },
    getters: {
        curCount(): number {
            return this.count * 3
        },
        curStatus(): boolean {
            return this.status
        },
        curMsg():string{
            return this.msg
        }
    },
    actions: {
        updatecount(val: number) {
            this.count = val
        },
        changeStatus(val: boolean) {
            this.status = val
        },
        updatemsg(val:string){
            this.msg=val
        }
    }
})
export default useHomeStore