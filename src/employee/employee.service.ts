import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './interfaces/employee.interface';
import { CreateEmployeeDTO } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
  ) {}

  async addEmployee(createEmployeeDTO: CreateEmployeeDTO): Promise<Employee> {
    const employee = new this.employeeModel(createEmployeeDTO);
    return employee.save();
  }
  async getAllEmployee(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async getEmployee(employeeId): Promise<Employee> {
    return this.employeeModel.findById(employeeId);
  }

  async updateEmployee(
    employeeId,
    createEmployeeDTO: CreateEmployeeDTO,
  ): Promise<Employee> {
    return this.employeeModel.findByIdAndUpdate(employeeId, createEmployeeDTO, {
      new: true,
    });
  }

  async deleteEmployee(employeeId): Promise<any> {
    return this.employeeModel.findByIdAndRemove(employeeId);
  }
}
