export type ObserveEventMap = {
    "change": any
}

export class Setter {
    static Observe(eventField: string) {
        return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.set
            
            descriptor.set = function (value: any) {
                this[eventField as keyof typeof this].dispatchEvent("change", value)
                return originalMethod?.call(this, value)
            }
        }
    }
}