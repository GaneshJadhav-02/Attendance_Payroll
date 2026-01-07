# frozen_string_literal: true

module V1
  module Employees
    class Create < ApplicationInteraction
      integer :company_id
      string  :name
      integer :per_day_salary
      string  :position, default: nil
      string  :department, default: nil
      string  :phone_no, default: nil

      def execute
        company = Company.find(company_id)

        @employee = transactional_create!(company.employees, employee_params)
      end

      def to_model
        @employee
      end

      private

      def employee_params
        inputs.except(:company_id)
      end
    end
  end
end
