# Copyright © 2025 OwnersTable Inc. All rights reserved.
# This source code is proprietary and confidential.
# Unauthorized copying or distribution is strictly prohibited.

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
