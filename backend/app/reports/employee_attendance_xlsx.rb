class EmployeeAttendanceXlsx
  def self.generate(data)
    package = Axlsx::Package.new
    workbook = package.workbook
    styles = workbook.styles

    left_style = styles.add_style(
      alignment: { horizontal: :left }
    )

    header_style = styles.add_style(
      alignment: { horizontal: :left },
      b:  true,
      bg_color: "DDDDDD"
    )

    title_style = styles.add_style(
      sz: 16,
      b: true,
      alignment: { horizontal: :center }
    )

    label_style = styles.add_style(
      b: true
    )

    workbook.add_worksheet(name: "Attendance Report") do |sheet|
      sheet.add_row ["Attendance Report"], style: title_style
      sheet.merge_cells("A1:B1")

      sheet.add_row []

      sheet.add_row ["Employee Name", data[:employee_name]], style: label_style
      sheet.add_row ["Company", data[:company_name]], style: label_style
      sheet.add_row ["Date Range", "#{data[:from_date]} to #{data[:to_date]}"], style: label_style
      sheet.add_row []

      sheet.add_row ["Date", "Status"], style: [header_style, header_style]

      data[:daily_status].each do |row|
        sheet.add_row [row[:date].to_s, row[:status]], style: [left_style, left_style]
      end

      sheet.add_row []
      sheet.add_row ["Total Working Days", data[:summary][:total_days]]
      sheet.add_row ["Days Present", data[:summary][:days_present]]
      sheet.add_row ["Salary Earned", data[:summary][:salary_earned]]
      sheet.add_row ["Advance Paid", data[:summary][:advance_paid]]
      sheet.add_row ["Final Payable", data[:summary][:final_payable]]

      sheet.column_widths 20, 25
    end

    package
  end
end
