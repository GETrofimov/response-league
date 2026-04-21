import { Page, Response, Request } from "@playwright/test"

/**
 * Слушатель для перехвата ответов на странице
 * @param page - страница, на которой будем перехватывать ответы
 * @param route - роут, который будем искать на странице
 * @returns - список перехваченных ответов
 */
function captureResponses(page: Page, route: string): Response[] {
    let captured: Response[] = [] 
    
    page.on("response", response => response.url().includes(route) ? captured.push(response) : null)
    
    return captured
}

/**
 * Слушатель для перехвата запросов на странице
 * @param page - страница, на которой будем перехватывать ответы
 * @param route - роут, который будем искать на странице
 * @returns - список перехваченных запросов
 */
function captureRequests(page: Page, route: string): Request[] {
    let captured: Request[] = [] 
    
    page.on("request", request => request.url().includes(route) ? captured.push(request) : null)
    
    return captured
}

export {captureResponses, captureRequests}