class EmployeeAttendanceXlsx
  def self.generate(data)
    package = Axlsx::Package.new
    workbook = package.workbook

    workbook.add_worksheet(name: "Attendance Report") do |sheet|
      sheet.add_row ["Employee Name", data[:employee_name]]
      sheet.add_row ["Company", data[:company_name]]
      sheet.add_row ["Date Range", "#{data[:from_date]} to #{data[:to_date]}"]
      sheet.add_row []

      sheet.add_row ["Date", "Status"]

      data[:daily_status].each do |row|
        sheet.add_row [row[:date], row[:status]]
      end

      sheet.add_row []
      sheet.add_row ["Total Working Days", data[:summary][:total_days]]
      sheet.add_row ["Days Present", data[:summary][:days_present]]
      sheet.add_row ["Salary Earned", data[:summary][:salary_earned]]
      sheet.add_row ["Advance Paid", data[:summary][:advance_paid]]
      sheet.add_row ["Final Payable", data[:summary][:final_payable]]
    end

    package
  end
end
