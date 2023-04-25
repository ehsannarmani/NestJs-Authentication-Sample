import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo:Repository<User>) {}

  async create(data:any):Promise<User>{
    return this.userRepo.save(data)
  }

  async findOne(condition:any):Promise<User>{
    return await this.userRepo.findOneBy(condition)
  }

}
