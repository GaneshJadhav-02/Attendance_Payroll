module V1::Reports
  class EmployeeAttendance < ApplicationInteraction
    integer :employee_id
    date :from_date
    date :to_date

    validates :from_date, :to_date, presence: true
    validate :date_range_valid

    def execute
      employee = Employee
        .includes(:company, :advance_payments)
        .find(employee_id)

      date_range = (from_date..to_date).to_a

      present_dates = employee.attendances
        .where(date: from_date..to_date)
        .pluck(:date)
        .to_set

      daily_status = date_range.map do |date|
        {
          date: date,
          status: present_dates.include?(date) ? "Present" : "Absent"
        }
      end

      days_present = present_dates.size
      total_days = date_range.size
      per_day_salary = employee.per_day_salary

      salary_earned = days_present * per_day_salary

      advance_paid = employee.advance_payments
        .where(paid_on: from_date..to_date)
        .sum(:amount)

      {
        employee_name: employee.name,
        company_name: employee.company.name,
        from_date: from_date,
        to_date: to_date,
        per_day_salary: per_day_salary,
        daily_status: daily_status,
        summary: {
          total_days: total_days,
          days_present: days_present,
          salary_earned: salary_earned,
          advance_paid: advance_paid,
          final_payable: salary_earned - advance_paid
        }
      }
    end

    private

    def date_range_valid
      errors.add(:to_date, "must be after from_date") if to_date < from_date
    end
  end
end
