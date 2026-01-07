# frozen_string_literal: true

module Api
  module V1
    class CompanySerializer < ::Api::ApplicationSerializer
      attributes :id,
                 :name,
                 :email,
                 :phone_number,
                 :address,
                 :created_at,
                 :updated_at
    end
  end
end
