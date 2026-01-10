# frozen_string_literal: true

class Employee < ApplicationRecord
  belongs_to :company
  has_many :attendances, dependent: :destroy
  has_many :advance_payments, dependent: :destroy

  validates :name, :per_day_salary, presence: true


  def attendance_status
    today_attendance = attendances.find_by(date: Date.current)
    today_attendance&.present? ? 'present' : 'not_marked'
  end
end
