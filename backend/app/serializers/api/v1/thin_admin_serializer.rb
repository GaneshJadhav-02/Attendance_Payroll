# frozen_string_literal: true

module Api
  module V1
    class ThinAdminSerializer < ::Api::ApplicationSerializer
      attributes :id,
                 :name,
                 :email,
                 :username
    end
  end
end
