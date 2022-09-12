import { ObjTy } from '~/common';
export declare const useUserStore: import("pinia").StoreDefinition<"user", {
    username: string;
    avatar: string;
    roles: any[];
}, {}, {
    M_username(username: string): void;
    M_roles(roles: Array<string>): void;
    login(data: ObjTy): Promise<unknown>;
    getInfo(): Promise<unknown>;
    logout(): Promise<unknown>;
    resetState(): Promise<unknown>;
}>;
