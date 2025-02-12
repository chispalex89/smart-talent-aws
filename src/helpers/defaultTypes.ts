
// Utility function to generate JSON object with key names and value types
export function generateTypeJson<T>(): { [K in keyof T]: string } {
    const typeMap: { [key: string]: string } = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        object: 'object',
        array: 'array',
    }

    function getType(value: any): string {
        if (Array.isArray(value)) {
            return 'array'
        }
        return typeMap[typeof value] || 'unknown'
    }

    function createTypeMap(obj: any): any {
        const result: any = {}
        for (const key in obj) {
            const type = typeof obj[key]
            if (type === 'object' && !Array.isArray(obj[key])) {
                result[key] = createTypeMap(obj[key])
            } else {
                result[key] = getType(obj[key])
            }
        }
        return result
    }

    // Create an instance of the type T and populate it with default values
    const instance: T = {} as T
    return createTypeMap(instance)
}
