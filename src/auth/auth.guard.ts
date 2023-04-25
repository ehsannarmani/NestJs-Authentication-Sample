import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user.service";
import { Request, Response } from "express";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService:JwtService,private readonly userService:UserService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise(async (resolve) => {
      const req = context.switchToHttp().getRequest() as Request
      const res = context.switchToHttp().getResponse() as Response
      const unAuthorized = ()=>{
        res.status(HttpStatus.UNAUTHORIZED).json({message: "Unauthorized"})
        resolve(false)

      }
      const token = req.header("token")
      if (!token) {
        unAuthorized()
        return
      }
      try {
        const data = await this.jwtService.verify(token)
        if (!data) {
          unAuthorized()
          return
        }
        const user = await this.userService.findOne({ id: data.id })
        if (user) {
          req['user'] = user
          resolve(true)
        } else {
          unAuthorized()
        }
      } catch (e) {
        unAuthorized()
      }
    })
  }
}
