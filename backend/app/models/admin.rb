# frozen_string_literal: true

class Admin < ApplicationRecord
  include TokenAuthorizable

  devise :database_authenticatable, :recoverable,
         :rememberable, :validatable
end
