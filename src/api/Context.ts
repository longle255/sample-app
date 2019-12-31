import Koa from 'koa';
import { ContainerInstance } from 'typedi';

export interface Context {
    requestId: number;
    request: Koa.Request;
    response: Koa.Response;
    container: ContainerInstance;
}
