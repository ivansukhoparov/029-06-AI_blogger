export interface IGptService {
  jsonRequest(promptMessage: any): Promise<any>;
}
