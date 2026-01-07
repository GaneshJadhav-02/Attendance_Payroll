# frozen_string_literal: true

class AdvancePayment < ApplicationRecord
  belongs_to :employee

  validates :amount, :paid_on, presence: true
end
