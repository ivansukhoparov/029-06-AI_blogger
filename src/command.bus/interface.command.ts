export interface ICommand {
    name:string
    execute(param: any): boolean | Promise<boolean>
}