# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CompaniesController < ::Api::V1::Admin::ApplicationController
        api :GET, '/api/v1/admin/companies', 'Get list of companies'

        def index
          result = Company.all
          respond_with result, each_serializer: CompanySerializer
        end
      end
    end
  end
end
