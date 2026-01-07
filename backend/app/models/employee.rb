# frozen_string_literal: true

class Employee < ApplicationRecord
  belongs_to :company
  has_many :attendances
  has_many :advance_payments

  validates :name, :per_day_salary, presence: true
end
