# frozen_string_literal: true

module Api
  module V1
    class Admin::AdminsController < Admin::ApplicationController
      api :GET, '/api/v1/admin/me', 'Get current user'
      header :Authorization, 'Auth token', required: true

      def me
        respond_with current_user, serializer: ::Api::V1::ThinAdminSerializer
      end
    end
  end
end
