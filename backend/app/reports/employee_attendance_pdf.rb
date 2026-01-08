require "prawn"
require "prawn/table"

class EmployeeAttendancePdf
  def self.generate(data)
    Prawn::Document.new(page_size: "A4", margin: 40) do |pdf|
      # Title
      pdf.text "Attendance Report", size: 18, style: :bold, align: :center
      pdf.move_down 20

      # Header info
      pdf.text "Employee: #{data[:employee_name]}", size: 11
      pdf.text "Company: #{data[:company_name]}", size: 11
      pdf.text "Date Range: #{data[:from_date]} to #{data[:to_date]}", size: 11

      pdf.move_down 15

      # Attendance table
      table_data = [["Date", "Status"]]
      data[:daily_status].each do |row|
        table_data << [row[:date].to_s, row[:status]]
      end

      pdf.table(
        table_data,
        header: true,
        width: pdf.bounds.width,
        cell_style: { padding: 6 }
      ) do
        row(0).font_style = :bold
        row(0).background_color = "EEEEEE"
        columns(1).align = :center
      end

      pdf.move_down 20

      # Summary section
      pdf.text "Summary", size: 14, style: :bold
      pdf.move_down 8

      summary = data[:summary]

      pdf.text "Total Working Days: #{summary[:total_days]}"
      pdf.text "Days Present: #{summary[:days_present]}"
      pdf.text "Total Salary Earned: #{summary[:salary_earned]}"
      pdf.text "Advance Paid: #{summary[:advance_paid]}"
      pdf.text "Final Payable: #{summary[:final_payable]}", style: :bold
    end
  end
end
