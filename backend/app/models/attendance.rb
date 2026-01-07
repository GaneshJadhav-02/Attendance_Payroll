# frozen_string_literal: true

class Attendance < ApplicationRecord
  belongs_to :employee

  enum status: %i[absent present]

  validates :date, presence: true
  validates :employee_id, uniqueness: { scope: :date }

  before_save :set_paid_amount

  private

  def set_paid_amount
    self.paid_amount = present? ? employee.per_day_salary : 0
  end
end
