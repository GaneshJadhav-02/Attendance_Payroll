# frozen_string_literal: true

module Api
  module V1
    class EmployeeSerializer < ::Api::ApplicationSerializer
      attributes :id,
                 :name,
                 :per_day_salary,
                 :active,
                 :position,
                 :department,
                 :phone_no,
                 :attendance_status,
                 :company_name,
                 :created_at,
                 :updated_at

      def attendance_status
        object.attendance_status
      end

      def company_name
        object.company.name
      end

      def created_at
        object.created_at.strftime('%Y-%m-%d')
      end
    end
  end
end