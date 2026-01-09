# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ReportsController < ::Api::V1::Admin::ApplicationController
        def employee_attendance
          result = ::V1::Reports::EmployeeAttendance.run(params.permit!)

          return render json: { errors: result.errors.full_messages }, status: 422 unless result.valid?

          data = result.result

          respond_to do |format|
            format.xlsx do
              package = EmployeeAttendanceXlsx.generate(data)
              send_data package.to_stream.read,
                        filename: "Attendance Report #{data[:employee_name].parameterize}.xlsx",
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            end

            format.pdf do
              pdf = EmployeeAttendancePdf.generate(data)

              send_data pdf.render,
                        filename: "Attendance Report #{data[:employee_name].parameterize}.pdf",
                        type: "application/pdf",
                        disposition: "inline"
            end
          end
        end
      end
    end
  end
end
