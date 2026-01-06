# Copyright © 2025 OwnersTable Inc. All rights reserved.
# This source code is proprietary and confidential.
# Unauthorized copying or distribution is strictly prohibited.

# frozen_string_literal: true

##
# This model makes handling tokens easily by inherit from it.
# There are 2 models using it {Admin::Token Admin::Token} and {Applicant::Token Applicant::Token}
class AuthToken < ApplicationRecord
  self.abstract_class = true

  scope :not_expired, -> { where('expired_at > ?', Time.zone.now) }
  validates :expired_at, presence: true
  validates :value, presence: true, uniqueness: true

  # Length of the token
  TOKEN_LENGTH = 140
  # When the token should expire
  EXPIRE_PERIOD = 2.weeks

  class << self
    # Generate a random hexadecimal string with length indicated by TOKEN_LENGTH
    # @note mainly used on the Authorizer service (app/services/authorizer.rb)
    # @return String
    def generate
      SecureRandom.hex(TOKEN_LENGTH) # for authorization
    end

    # Encrypt a string with MD5 encription
    # @note mainly used on the Authorizer service (app/services/authorizer.rb)
    # @param str [String] any kind of string
    # @return String
    def encrypt(str)
      str = [str, Rails.application.secret_key_base].flatten.compact.join
      Digest::MD5.hexdigest(str)
    end
  end

  # @return Boolean
  def expired?
    expired_at > Time.zone.now
  end
end
