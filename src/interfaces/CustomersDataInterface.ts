export interface CustomersDataInterface {
    name: string,
    socialName: string,
    documentNumber: string,
    authorization: string,
    address: string,
    complement: string,
    neighborhood: string,
    cityState: string,
    zipCode: string,
    dispatchNumber: string,
    publicationDate: string,
    flagStart: string,
    postType: string,
    partners: string[],
    products: CustomersProductsInterface[],
    metadata: Object
}

export interface CustomersProductsInterface {
    product: string,
    tancagem: number,
    nozzles: number
}