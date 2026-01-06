# frozen_string_literal: true

module Api
  module V1
    module Admin
      class AuthController < ::Api::V1::Admin::ApplicationController
        skip_before_action :authenticate_admin!, only: :sign_in
        wrap_parameters :admin

        api :POST, '/api/v1/admin/auth/sign_in', 'Admin sign in'
        param :admin, Hash do
          param :username, String, 'Email or username', required: true
          param :password, String, required: true
        end

        def sign_in
          result = ::V1::Admins::SignIn.run(params.fetch(:admin, {}))
          respond_with result
        end

        api :DELETE, '/api/v1/admin/auth/sign_out', 'Admin sign out'
        header :Authorization, 'Auth token', required: true

        def sign_out
          result = ::V1::Admins::SignOut.run(admin: current_user)
          respond_with result
        end
      end
    end
  end
end
