# frozen_string_literal: true

module Api
  module V1
    class AttendanceSerializer < ::Api::ApplicationSerializer
      attributes :id, :date, :paid_amount, :created_at, :updated_at

      belongs_to :employee, serializer: ::Api::V1::EmployeeSerializer
    end
  end
end
