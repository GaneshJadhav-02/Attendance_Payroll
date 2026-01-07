# frozen_string_literal: true

module V1
  module Attendance
    class MarkPresent < ActiveInteraction::Base
      integer :company_id
      date :date
      array :employee_ids

      validates :employee_ids, presence: true

      def execute
        company = Company.find(company_id)

        # Ensure employees belong to the company (important for safety)
        valid_employee_ids = company.employees
                                    .where(id: employee_ids)
                                    .pluck(:id)

        raise ActiveRecord::RecordNotFound, 'No valid employees found' if valid_employee_ids.empty?

        @created_records = []

        ActiveRecord::Base.transaction do
          valid_employee_ids.each do |emp_id|
            attendance = ::Attendance.find_or_create_by!(
              employee_id: emp_id,
              date: date,
              status: 'present'
            ) do |record|
              record.paid_amount = Employee.find(emp_id).per_day_salary
            end

            @created_records << attendance
          end
        end

        @created_records
      end

      def to_model
        @created_records
      end
    end
  end
end
