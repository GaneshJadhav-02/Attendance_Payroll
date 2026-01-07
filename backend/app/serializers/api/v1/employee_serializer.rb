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
                 :created_at,
                 :updated_at
    end
  end
end
