import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Param,
  Post, Req,
  Res, UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth/auth.guard";
@Controller("api")
export class UserController {
  constructor(private readonly appService: UserService, private readonly jwtService:JwtService ) {}

  @Post("register")
  async register(
    @Body("name") name: string,
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    const hashedPassword = await bcrypt.hash(password,12)
    const user =  await this.appService.create({
      name,
      email,
      password: hashedPassword
    })
    const jwt = this.jwtService.sign({id: user.id})
    return {
      status: true,
      message: "You are registered",
      token: jwt
    }
  }
  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
  ){
    const user =  await this.appService.findOne({email})
    if (!user){
      throw new BadRequestException("User with this email not found")
    }
    if (!await bcrypt.compare(password,user.password)){
      throw new BadRequestException("Conditions are wrong")
    }
    const jwt = this.jwtService.sign({id: user.id})
    return { status:true, message: "You logged in",token: jwt }
  }

  @Get("user")
  @UseGuards(AuthGuard)
  user(@Req() request:Request){
    return request['user']
  }
}
