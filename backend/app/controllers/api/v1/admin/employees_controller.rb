# frozen_string_literal: true

module Api
  module V1
    module Admin
      class EmployeesController < ::Api::V1::Admin::ApplicationController
        api :GET, '/api/v1/admin/employees', 'Get list of employees for a company'
        param :company_id, Integer, 'Company ID', required: true

        def index
          company = Company.find(params[:company_id])
          respond_with company.employees, each_serializer: EmployeeSerializer
        end

        api :POST, '/api/v1/admin/employees', 'Add an employees to a company'
        param :company_id, Integer, 'Company ID', required: true
        param :name, String, 'Employee name', required: true
        param :per_day_salary, Integer, 'Per day salary', required: true
        param :position, String, 'Position/Role of the employee', required: false
        param :department, String, 'Department of the employee', required: false
        param :phone_number, String, 'Phone number of the employee', required: false

        def create
          result = ::V1::Employees::Create.run(params)
          respond_with result, serializer: EmployeeSerializer
        end

        def destroy
          Employee.find(params[:id]).destroy
          head :no_content
        end

        def advance_payment
          result = ::V1::AdvancePayments::Create.run(params)
          respond_with result
        end
      end
    end
  end
end
