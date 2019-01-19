import { Injectable, ProviderScope } from "@graphql-modules/di";
import { User } from "../../../entity/User";
import { Connection } from "typeorm";
import { validPassword } from "./auth.provider";
import { OnRequest, OnConnect } from "@graphql-modules/core";
import { ModuleSessionInfo } from "@graphql-modules/core/dist/module-session-info";

@Injectable({
    scope: ProviderScope.Session
})
export class CurrentUserProvider implements OnRequest, OnConnect {
    currentUser: User;
    constructor(private connection: Connection) {}
    async onRequest ({ session }: ModuleSessionInfo) {
        if (session.req) {
            this.currentUser = session.req.user;
        }
    }
    async onConnect (connectionParams: any) {     
      if (connectionParams.authToken) {
        // Create a buffer and tell it the data coming in is base64
        const buf = new Buffer(connectionParams.authToken.split(' ')[1], 'base64');
        // Read it back out as a string
        const [username, password]: string[] = buf.toString().split(':');
        if (username && password) {
          const user = await this.connection.getRepository(User).findOne({where: { username }});
  
          if (user && validPassword(password, user.password)) {
            this.currentUser = user;
          } else {
            throw new Error('Wrong credentials!');
          }
        }
      } else {
        throw new Error('Missing auth token!');
      }
    }
}