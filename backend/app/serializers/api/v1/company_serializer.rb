# frozen_string_literal: true

module Api
  module V1
    class CompanySerializer < ::Api::ApplicationSerializer
      attributes :id,
                 :name,
                 :email,
                 :phone_number,
                 :address,
                 :employee_count,
                 :created_at,
                 :updated_at

      def employee_count
        object.employees.count
      end
    end
  end
end
