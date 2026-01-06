# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ApplicationController < ::Api::V1::ApplicationController
        before_action :authenticate_admin!

        def authenticate_admin!
          unauthorized! unless current_user
        end

        def current_user
          @current_user ||= ::Authorizer.authorize_by_token(request.headers['Authorization'], ::Admin)
        end
      end
    end
  end
end
