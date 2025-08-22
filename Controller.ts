import AppConfig from "./Constants/AppConfig"

const headers = {
    "Cache-Control": "no-cache",
    "Authorization": "Token token=" + AppConfig.token,
}


export type Concern = {
    code: string
    id: number
    has_related_concerns: boolean
}
export async function GetRootConcerns(): Promise<Concern[]> {
    return await fetch(AppConfig.apiUrl + "/general/api/concerns/list_root_codes", {headers}).then(response => response.json())
}



export type Oil = {
    code: string,
    id: number
}
export async function GetAllOils(): Promise<Oil[]> {
    return await fetch(AppConfig.apiUrl + "/general/api/oils/list_oils", {headers}).then(response => response.json())
}



export type Blend = {
    code: string,
    id: number
}
export async function GetAllBlends(): Promise<Blend[]> {
    return await fetch(AppConfig.apiUrl + "/general/api/oils/list_blends_only", {headers}).then(response => response.json())
}



export type Product = {
    code: string,
    id: number
}
export async function GetAllProducts(): Promise<Product[]> {
    return await fetch(AppConfig.apiUrl + "/general/api/oils/list_products", {headers}).then(response => response.json())
}


export type Recommend = "Preferred" | "Suggested" | "Consider";
export type RelatedConcern = {
    code: string
    id: number
    order: number
    recommend: Recommend
}
export async function GetOilRelatedConcerns(oilId: number): Promise<RelatedConcern[]> {
    return await fetch(AppConfig.apiUrl + `/general/api/oils/${oilId}/related_concerns`, {headers}).then(response => response.json());
}


export async function GetRelatedConcerns(concernId: number): Promise<Concern[]> {
    return await fetch(AppConfig.apiUrl + `/general/api/concerns/${concernId}/related_concerns`, { headers }).then(response => response.json());
}



type ShareParams = {
    concern: boolean,
    sender: string,
    senderEmail: string,
    recipient: string,
    recipientEmail: string,
    note: string,
    productId: string,
    productCode: string
}
export async function postShare(params: ShareParams) {
    const response = await fetch(`${AppConfig.apiUrl}/general/api/shares`, {
        method: 'POST',
        headers: { 
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}