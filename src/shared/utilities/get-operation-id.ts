function ToTitleCase (str: string): string {
    return str
        .toLocaleLowerCase()
        .split(' ')
        .map(word => word.replace(word[0], word[0].toLocaleUpperCase()))
        .join(' ')
}

export function GetOperationId (model: string, operation: string): {title: string; operationId: string} {
    const _model = ToTitleCase(model).replace(/\s/g, '')
    const _operation = ToTitleCase(operation).replace(/\s/g, '')

    return {
        title: '',
        operationId: `${_model}_${_operation}`
    }
}
